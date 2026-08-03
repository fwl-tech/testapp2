import Anthropic from '@anthropic-ai/sdk'
import { toolDefinitions, runTool } from './tools'

const SYSTEM_PROMPT = `You are the billing & invoicing assistant for a one-person LLC. You have tools to
look up and create clients, draft invoices, email invoices and payment reminders via Gmail, and mark
invoices paid. Today's date is ${new Date().toISOString().slice(0, 10)}.

Rules:
- Always find or create the client before creating an invoice.
- Never send an invoice or reminder without being asked (directly, or as part of a clear instruction
  like "send reminders for overdue invoices").
- Keep amounts and dates precise; don't guess a client's email — ask for it via find_or_create_client
  and surface a request for it in your final answer if it's missing.
- Be concise. After acting, summarize exactly what you did (invoice numbers, amounts, who was emailed).`

export interface AgentResult {
  response: string
  toolCalls: { name: string; input: any; output: string }[]
}

export async function runAgent(instruction: string): Promise<AgentResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const client = new Anthropic({ apiKey })
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'
  const toolCalls: AgentResult['toolCalls'] = []

  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: instruction }]

  for (let turn = 0; turn < 10; turn++) {
    const message = await client.messages.create({
      model,
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      tools: toolDefinitions,
      messages,
    })

    if (message.stop_reason !== 'tool_use') {
      const text = message.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
      return { response: text, toolCalls }
    }

    messages.push({ role: 'assistant', content: message.content })

    const toolResults: Anthropic.ToolResultBlockParam[] = []
    for (const block of message.content) {
      if (block.type !== 'tool_use') continue
      const output = await runTool(block.name, block.input)
      toolCalls.push({ name: block.name, input: block.input, output })
      toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: output })
    }
    messages.push({ role: 'user', content: toolResults })
  }

  return { response: 'Reached maximum number of steps without finishing.', toolCalls }
}
