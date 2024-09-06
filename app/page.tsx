'use client'

import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Home from "@/components/Home";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useScroll } from "framer-motion";
import { useRef } from "react";

const queryClient = new QueryClient()

export default function HomePage() {
  
  const inicioRef = useRef<HTMLDivElement | null>(null)
  const projetosRef = useRef<HTMLDivElement | null>(null)
  const sobreRef = useRef<HTMLDivElement | null>(null)
  const habilidadesRef = useRef<HTMLDivElement | null>(null)
  const contatoRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress: inicioScroll } = useScroll({
    target: inicioRef,
    offset: ["start start", "end center"]
  })

  const { scrollYProgress: projetosScroll } = useScroll({
    target: projetosRef,
    offset: ["start center", "end center"]
  })

  const { scrollYProgress: sobreScroll } = useScroll({
    target: sobreRef,
    offset: ["start center", "end center"]
  })

  const { scrollYProgress: habilidadesScroll } = useScroll({
    target: habilidadesRef,
    offset: ["start center", "end center"]
  })

  const { scrollYProgress: contatoScroll } = useScroll({
    target: contatoRef,
    offset: ["start center", "end center"]
  })

  const sections = {
    inicio: {
      scroll: inicioScroll,
      id: 'inicio',
    },
    projetos: {
      scroll: projetosScroll,
      id: 'projetos',
      icon: 'gem.svg',
    },
    sobre: {
      scroll: sobreScroll,
      id: 'sobre',
      icon: 'user.svg',
    },
    habilidades: {
      scroll: habilidadesScroll,
      id: 'habilidades',
      icon: 'lamp.svg',
    },
    contato: {
      scroll: contatoScroll,
      id: 'contato',
      icon: 'phone.svg',
    },
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Header sections={sections} />
      <section id={sections.inicio.id} ref={inicioRef}>
        <Home />
      </section>
      <section id={sections.projetos.id} ref={projetosRef}>
        <Projects />
      </section>
      <section id={sections.sobre.id} ref={sobreRef}>
        <About />
      </section>
      <section id={sections.habilidades.id} ref={habilidadesRef}>
        <Skills />
      </section>
      <section id={sections.contato.id} ref={contatoRef}>
        <Contact />
      </section>
      <footer>
        <Footer />
      </footer>
    </QueryClientProvider>
  )
}