import parse, {
  HTMLReactParserOptions,
  domToReact,
  Element,
} from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';
import CodeRenderer from './code-renderer';

type ArticleRendererProps = {
  dirtyHtml: string;
};

const renderPre = (domNode: Element, children: React.ReactNode) => {
  const codeElement = domNode.children?.find(
    (child) => child instanceof Element && child.name === 'code',
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
    <ul className='list-disc list-outside marker:text-accent-1 ml-6 mb-4 space-y-1'>
      {children}
    </ul>
  ),
  ol: (_, children) => (
    <ol className='list-decimal marker:text-accent-1 list-outside ml-6 mb-4 space-y-1'>
      {children}
    </ol>
  ),
  li: (_, children) => (
    <li className='mt-1 leading-relaxed text-base md:text-lg'>{children}</li>
  ),
  pre: renderPre,
  code: (node, children) => {
    // Só renderiza inline code se NÃO estiver dentro de um <pre>
    if (!(node.parent instanceof Element && node.parent.name === 'pre')) {
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
    if (
      domNode instanceof Element &&
      domNode.attribs &&
      domNode.name in tagHandlers
    ) {
      // Pré-processamos os filhos usando o domToReact
      // @ts-expect-error (O tipo do children pode ser chato no TS aqui)
      const children = domToReact(domNode.children, options);

      // Chamamos a função correspondente no nosso dicionário
      return tagHandlers[domNode.name](domNode, children);
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
      <div className='max-w-3xl mx-auto'>{reactElement}</div>
    </article>
  );
}
