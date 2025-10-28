'use client';

import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
} from 'html-react-parser';
import Image from 'next/image';
import React from 'react';

type ArticleRendererProps = {
  dirtyHtml: string;
};

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      if (domNode.name === 'img') {
        const { src, alt, width, height } = domNode.attribs;
        const imgWidth = width ? parseInt(width, 10) : 500;
        const imgHeight = height ? parseInt(height, 10) : 300;

        return (
          <Image
            src={src || '/placeholder.png'}
            alt={alt || 'Imagem do artigo'}
            width={imgWidth}
            height={imgHeight}
            className='my-2 rounded-md shadow-lg'
          />
        );
      }
      if (domNode.name === 'a') {
        return (
          <a
            href={domNode.attribs.href}
            target='_blank'
            rel='noopener noreferrer'
            className='underline-magical'
          >
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </a>
        );
      }
      if (domNode.name === 'h2') {
        return (
          <h2
            id={domNode.attribs.id}
            className='text-3xl font-bold leading-tight'
          >
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </h2>
        );
      }
      if (domNode.name === 'h3') {
        return (
          <h3
            id={domNode.attribs.id}
            className='text-2xl font-semibold leading-tight mt-6 mb-3'
          >
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </h3>
        );
      }
      if (domNode.name === 'p') {
        return (
          <p className='mb-4 leading-relaxed'>
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </p>
        );
      }
    }
  },
};

export default function ArticleRenderer({ dirtyHtml }: ArticleRendererProps) {
  const reactElement = parse(dirtyHtml, options);

  return <article className='prose lg:prose-xl'>{reactElement}</article>;
}
