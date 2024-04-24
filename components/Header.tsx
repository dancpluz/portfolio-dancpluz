'use client'

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";

type Props = {
  title: string;
  slug: string;
  counter?: number;
}

export default function Header() {
  const currentPage = usePathname().split('/')[1];

  function NavItem({ title, slug, counter }: Props) {
    const active = slug == '/' + currentPage;

    return (
      <Link href={slug}>
        <li className={`flex items-center gap-1 px-5 py-2 text-xl rounded-full ${active ? 'bg-foreground text-background' : 'text-tertiary'}`}>
          {counter && (
            <div className={`text-sm rounded-full w-5 h-5 flex items-center font-semibold justify-center ${active ? 'bg-secondary text-foreground' : 'bg-tertiary text-background'}`}>{counter}</div>
          )}
          {title}
        </li>
      </Link>
    )
  }

  return (
    <>
      <div className='flex w-full justify-center py-6'>
        <Link href='/'>
          <Image src='/lumentosh.svg' alt='lumentosh' width={64} height={64}/>
        </Link>
      </div>
      <nav className='flex justify-center'>
        <ul className='flex border-8 border-secondary bg-secondary rounded-full items-center gap-4'>
          <NavItem title='Início' slug='/'/>
          <NavItem title='Projetos' slug='/projetos' counter={5}/>
          <NavItem title='Sobre' slug='/sobre' />
          <NavItem title='Contato' slug='/contato' />
        </ul>
      </nav>
    </>
  )
}