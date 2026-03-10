'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

type CodeRendererProps = {
  code: string;
  language: string;
};

export default function CodeRenderer({ code, language }: Readonly<CodeRendererProps>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='relative my-6 rounded-lg overflow-hidden shadow-sm group'>
      <button
        onClick={handleCopy}
        className='absolute top-3 right-3 p-2 rounded-md bg-white/10 hover:bg-white/20 transition-all md:opacity-0 opacity-80 group-hover:opacity-100 focus:opacity-100 z-10'
        aria-label='Copy code'
      >
        {copied ? (
          <Check className='w-4 h-4 text-accent-1' />
        ) : (
          <Copy className='w-4 h-4 text-white' />
        )}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.2rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        showLineNumbers={code.split('\n').length > 5}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
