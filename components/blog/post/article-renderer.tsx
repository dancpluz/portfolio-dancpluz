'use client';

import parse, {
  domToReact,
  type HTMLReactParserOptions,
  Element,
} from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';
import CodeRenderer from './code-renderer';

type ArticleRendererProps = {
  dirtyHtml: string;
};

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      if (domNode.name === 'img') {
        const { src, alt, width, height } = domNode.attribs;
        const imgWidth = width ? Number.parseInt(width, 10) : 800;
        const imgHeight = height ? Number.parseInt(height, 10) : 500;

        return (
          <Image
            src={src || '/placeholder.png'}
            alt={alt || 'Imagem do artigo'}
            width={imgWidth}
            height={imgHeight}
            className='rounded-lg shadow-md w-full h-auto'
          />
        );
      }

      if (domNode.name === 'a') {
        return (
          <Link
            href={domNode.attribs.href}
            target='_blank'
            rel='noopener noreferrer'
            className='underline-magical'
          >
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </Link>
        );
      }

      if (domNode.name === 'h1') {
        return (
          <h1
            id={domNode.attribs.id}
            className='text-4xl md:text-5xl font-bold leading-tight text-balance mt-6 mb-5'
          >
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </h1>
        );
      }

      if (domNode.name === 'h2') {
        return (
          <h2
            id={domNode.attribs.id}
            className='text-3xl md:text-4xl font-bold leading-tight text-balance mt-10 mb-3 scroll-mt-20'
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
            className='text-2xl md:text-3xl font-semibold leading-tight text-balance mt-8 mb-2 scroll-mt-20'
          >
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </h3>
        );
      }

      if (domNode.name === 'h4') {
        return (
          <h4
            id={domNode.attribs.id}
            className='text-xl md:text-2xl font-semibold leading-snug text-balance mt-8 mb-2 scroll-mt-20'
          >
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </h4>
        );
      }

      if (domNode.name === 'p') {
        return (
          <p className='mb-4 leading-relaxed text-pretty text-base md:text-lg'>
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </p>
        );
      }

      if (domNode.name === 'blockquote') {
        return (
          <blockquote className='border-l-4 border-accent-1 pl-6 py-2 my-6 italic rounded text-foreground/80 bg-accent-1/5'>
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </blockquote>
        );
      }

      if (domNode.name === 'ul') {
        return (
          <ul className='list-disc list-outside marker:text-accent-1 ml-6 mb-4 space-y-1'>
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </ul>
        );
      }

      if (domNode.name === 'ol') {
        return (
          <ol className='list-decimal marker:text-accent-1 list-outside ml-6 mb-4 space-y-1'>
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </ol>
        );
      }

      if (domNode.name === 'li') {
        return (
          <li className='mt-1 leading-relaxed text-base md:text-lg'>
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </li>
        );
      }

      if (
        domNode.name === 'code' &&
        !(domNode.parent instanceof Element && domNode.parent.name === 'pre')
      ) {
        return (
          <code className='bg-accent-1/20 px-1.5 py-0.5 rounded text-sm font-mono'>
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </code>
        );
      }

      if (domNode.name === 'pre') {
        const codeElement = domNode.children?.find(
          (child) => child instanceof Element && child.name === 'code',
        ) as Element | undefined;

        if (codeElement) {
          // Extract language from className (e.g., "language-javascript")
          const preClassName = domNode.attribs?.class || '';
          const codeClassName = codeElement.attribs?.class || '';

          // Check pre element first, then code element
          const languageMatch =
            preClassName.match(/language-(\w+)/) ||
            codeClassName.match(/language-(\w+)/);
          const language = languageMatch ? languageMatch[1] : 'text';

          // Get the code content
          const codeContent =
            codeElement.children?.[0] && 'data' in codeElement.children[0]
              ? (codeElement.children[0].data as string)
              : '';

          return <CodeRenderer code={codeContent} language={language} />;
        }

        // Fallback for pre without code element
        return (
          <pre className='bg-accent-1/20 p-4 rounded-lg overflow-x-auto my-6 text-sm'>
            {/* @ts-expect-error */}
            {domToReact(domNode.children, options)}
          </pre>
        );
      }
    }
  },
};

export default function ArticleRenderer({ dirtyHtml }: ArticleRendererProps) {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return null;
  }

  const reactElement = parse(dirtyHtml, options);

  return (
    <article className='prose prose-lg max-w-none'>
      <div className='max-w-3xl mx-auto'>{reactElement}</div>
    </article>
  );
}
