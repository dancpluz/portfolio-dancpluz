import parse, {
  HTMLReactParserOptions,
  domToReact,
  Element,
  DOMNode,
} from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';
import CodeRenderer from './code-renderer';
import { isGif } from '@/lib/utils';
import { PixelPoint } from '@/components/ui/svg';

type ArticleRendererProps = {
  dirtyHtml: string;
};

const renderPre = (domNode: Element, children: React.ReactNode) => {
  const codeElement = domNode.children?.find(
    (child) => (child as Element).name === 'code',
  ) as Element | undefined;

  if (codeElement) {
    const preClassName = domNode.attribs?.class || '';
    const codeClassName = codeElement.attribs?.class || '';

    const languageRegex = /language-(\w+)/;
    const languageMatch =
      languageRegex.exec(preClassName) || languageRegex.exec(codeClassName);
    const language = languageMatch ? languageMatch[1] : 'text';

    const codeContent =
      codeElement.children?.[0] && 'data' in codeElement.children[0]
        ? (codeElement.children[0].data as string)
        : '';

    return <CodeRenderer code={codeContent} language={language} />;
  }

  return (
    <pre className='bg-accent-1/20 p-4 rounded-lg overflow-x-auto my-6 text-sm'>
      {children}
    </pre>
  );
};

const renderImg = (domNode: Element) => {
  const { src, alt, width, height } = domNode.attribs;
  const imgWidth = width ? Number.parseInt(width, 10) : 800;
  const imgHeight = height ? Number.parseInt(height, 10) : 500;

  return (
    <Image
      src={src || '/placeholder.png'}
      alt={alt || 'Imagem do artigo'}
      width={imgWidth}
      height={imgHeight}
      unoptimized={isGif(src)}
      className='rounded-lg shadow-md w-full h-auto'
    />
  );
};

const tagHandlers: Record<
  string,
  (
    node: Element,
    children: React.ReactNode,
  ) => React.ReactElement | undefined | null
> = {
  img: renderImg,
  a: (node, children) => (
    <Link
      href={node.attribs.href}
      target='_blank'
      rel='noopener noreferrer'
      className='underline-magical'
    >
      {children}
    </Link>
  ),
  h1: (node, children) => (
    <h1
      id={node.attribs.id}
      className='text-4xl md:text-5xl font-heading font-bold leading-tight text-balance mt-6 mb-5'
    >
      {children}
    </h1>
  ),
  h2: (node, children) => (
    <h2
      id={node.attribs.id}
      className='text-3xl md:text-4xl font-heading font-bold leading-tight text-balance mt-10 mb-3 scroll-mt-20'
    >
      {children}
    </h2>
  ),
  h3: (node, children) => (
    <h3
      id={node.attribs.id}
      className='text-2xl md:text-3xl font-heading font-semibold leading-tight text-balance mt-8 mb-2 scroll-mt-20'
    >
      {children}
    </h3>
  ),
  h4: (node, children) => (
    <h4
      id={node.attribs.id}
      className='text-xl md:text-2xl font-heading font-semibold leading-snug text-balance mt-8 mb-2 scroll-mt-20'
    >
      {children}
    </h4>
  ),
  p: (_, children) => (
    <p className='mb-4 leading-relaxed text-pretty text-base md:text-lg'>
      {children}
    </p>
  ),
  blockquote: (_, children) => (
    <blockquote className='border-l-4 border-accent-1 pl-6 py-2 my-6 italic rounded text-foreground/80 bg-accent-1/5'>
      {children}
    </blockquote>
  ),
  ul: (_, children) => (
    <ul className='list-none ml-2 mb-4 space-y-2'>
      {children}
    </ul>
  ),
  ol: (_, children) => (
    <ol className='list-decimal list-outside ml-6 mb-4 space-y-1'>
      {children}
    </ol>
  ),
  li: (node, children) => {
    // Calcula o índice relativo apenas entre os elementos <li> para ignorar nós de texto/espaçamentos
    const parent = node.parent as Element;
    const parentChildren = parent?.children || [];
    const liElements = parentChildren.filter(
      (child) => (child as Element).name === 'li',
    );
    const relativeIndex = liElements.indexOf(node);

    const accents = [
      'text-accent-1',
      'text-accent-2',
      'text-accent-3',
    ];
    const accentClass = accents[relativeIndex % accents.length];

    if (parent?.name === 'ol') {
      return (
        <li className={`mt-1 leading-relaxed text-base md:text-lg marker:${accentClass}`}>
          {children}
        </li>
      );
    }

    return (
      <li className='flex gap-3 items-start mt-1 leading-relaxed text-base md:text-lg'>
        <PixelPoint className={`size-2 shrink-0 mt-3 ${accentClass}`} />
        <span>{children}</span>
      </li>
    );
  },
  pre: renderPre,
  code: (node, children) => {
    // Só renderiza inline code se NÃO estiver dentro de um <pre>
    const parentNode = node.parent as Element | null;
    if (parentNode?.name !== 'pre') {
      return (
        <code className='bg-accent-1/20 px-1.5 py-0.5 rounded text-sm font-mono'>
          {children}
        </code>
      );
    }
    return undefined; // Deixa o fallback do parser lidar com isso
  },
};

// 4. A função principal agora é minúscula e limpa
const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    const element = domNode as Element;
    if (element.attribs && element.name && element.name in tagHandlers) {
      // Pré-processamos os filhos usando o domToReact com a tipagem recomendada (v6)
      const children = domToReact(element.children as DOMNode[], options);

      // Chamamos a função correspondente no nosso dicionário
      return tagHandlers[element.name](element, children);
    }
  },
};

// 5. O componente em si não muda
export default function ArticleRenderer({
  dirtyHtml,
}: Readonly<ArticleRendererProps>) {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return null;
  }

  const reactElement = parse(dirtyHtml, options);

  return (
    <article className='prose prose-lg max-w-none'>
      <div className='mx-auto'>{reactElement}</div>
    </article>
  );
}
