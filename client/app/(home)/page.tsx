import React from 'react'
import Hero from './_components/hero'
import Features from './_components/features'
import Testimonials from './_components/testimonials'
import Pricing from './_components/pricing'
import FAQ from './_components/faq'
import CTA from './_components/cta'

export default function Page() {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow'>
        {/* Hero Section */}
        <section className='py-20'>
          <Hero />
        </section>

        {/* Features Section */}
        <section className='py-20 bg-zinc-50'>
          <Features />
        </section>

        {/* Testimonials Section */}
        <section className='py-20'>
          <Testimonials />
        </section>

        {/* Pricing Section */}
        <section className='py-20 bg-zinc-50'>
          <Pricing />
        </section>

        {/* FAQ Section */}
        <section className='py-20'>
          <FAQ />
        </section>

        {/* Final CTA Section */}
        <section className='py-20 bg-gradient-to-r from-purple-400 to-pink-600'>
          <CTA />
        </section>
      </main>
    </div>
  )
}