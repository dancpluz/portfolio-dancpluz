'use client'

import About from "@/components/About";
import Header from "@/components/Header";
import Projects from "@/components/Projects";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";

const queryClient = new QueryClient()

export default function HomePage() {
  const sections = {
    inicio: {
      ref: useRef<HTMLDivElement | null>(null),
      id: 'inicio',
    },
    projetos: {
      ref: useRef<HTMLDivElement | null>(null),
      id: 'projetos',
      icon: 'gem.svg',
    },
    sobre: {
      ref: useRef<HTMLDivElement | null>(null),
      id: 'sobre',
      icon: 'user.svg',
    },
    habilidades: {
      ref: useRef<HTMLDivElement | null>(null),
      id: 'habilidades',
      icon: 'lamp.svg',
    },
    contato: {
      ref: useRef<HTMLDivElement | null>(null),
      id: 'contato',
      icon: 'phone.svg',
    },
    final: {
      ref: useRef<HTMLDivElement | null>(null),
      id: 'final',
      icon: 'phone.svg',
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Header sections={sections} />
      <div id={sections.inicio.id} ref={sections.inicio.ref} className='h-[100vh]'>
        <h1>Home</h1>
      </div>
      <div id={sections.projetos.id} ref={sections.projetos.ref}>
        <Projects />
      </div>
      <div id={sections.sobre.id} ref={sections.sobre.ref}>
        <About />
      </div>
      <div id={sections.habilidades.id} ref={sections.habilidades.ref} className='h-[100vh]'>
        <h1>Habilidades</h1>
      </div>
      <div id={sections.contato.id} ref={sections.contato.ref} className='h-[100vh]'>
        <h1>Contato</h1>
      </div>
      <div id={sections.final.id} ref={sections.final.ref} className='h-[30vh]'>
        <h1>Rodape</h1>
      </div>
      {/*
      <div ref={fiveRef} className='h-[30vh]'>
        <h1>Footer</h1>
      </div>
      */}
    </QueryClientProvider>
  )
}