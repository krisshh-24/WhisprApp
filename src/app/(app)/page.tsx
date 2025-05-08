'use client'
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import messages from '@/messages.json'
const Home = () => {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      <section className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Whisper Freely.<br />
          Connect Anonymously.
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Step into <span className="font-semibold text-indigo-600">Whispr</span> — the safe space where voices are heard, not judged. 
          Speak your truth. No names, no limits.
        </p>
      </section>
      <Carousel
      plugins={[Autoplay({delay:2000})]}
      opts={{
        align: "start",
      }}
      className="w-full max-w-sm"
    >
  <CarouselContent>
  {messages.map((message, index) => (
    <CarouselItem
      key={index}
      className="md:basis-1/2 lg:basis-1/3 flex justify-center "
    >
      <div className="w-full max-w-xs p-2">
        <Card className="flex flex-col h-full min-h-[200px] overflow-auto">
          <CardHeader className="text-base font-bold text-center break-words px-4 pt-4">
            {message.title}
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center px-4 pb-6 overflow-hidden">
            <p className="text-sm font-medium text-center break-words whitespace-pre-wrap">
              {message.content}
            </p>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  ))}
</CarouselContent>
<CarouselPrevious />
<CarouselNext />

    </Carousel>

    </main>
    <footer className='text-center p-4 md:p-6'>
      Whispr.All rights reserved.
    </footer>
    </>
  )
}

export default Home
