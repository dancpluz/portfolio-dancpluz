'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { triggerExitAnimation } from '@/components/motion/events';
import { AnchorHTMLAttributes } from 'react';

type TransitionLinkProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export default function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let default behavior handle modifier keys (ctrl+click, etc)
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      if (onClick) onClick(e);
      return;
    }

    e.preventDefault();
    if (onClick) onClick(e);

    // Trigger exit animation
    await triggerExitAnimation();
    
    // Then navigate
    router.push(href.toString());
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
