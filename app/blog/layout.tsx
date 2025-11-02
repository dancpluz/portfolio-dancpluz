import ReactLenis from 'lenis/react';
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root>
      {children}
    </ReactLenis>
  );
}
