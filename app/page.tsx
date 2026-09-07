import Header from '@/components/brand-site/Header'
import Hero from '@/components/brand-site/Hero'
import BeliefsSection from '@/components/brand-site/BeliefsSection'
import DefyPlatformSection from '@/components/brand-site/DefyPlatformSection'
import ThemeGrid from '@/components/brand-site/ThemeGrid'
import PortfolioList from '@/components/brand-site/PortfolioList'
import Footer from '@/components/brand-site/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <BeliefsSection />
      <DefyPlatformSection />
      <ThemeGrid />
      <PortfolioList />
      <Footer />
    </>
  )
}
