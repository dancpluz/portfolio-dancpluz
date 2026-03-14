import PageTransition from '@/components/motion/page-transition';

export default function Container({
  children,
  divClassName = '',
  mainClassName = '',
}: Readonly<{
  children: React.ReactNode;
  divClassName?: string;
  mainClassName?: string;
}>) {
  return (
    <div className={`flex w-full flex-col min-h-svh pt-16 items-center ${divClassName}`}>
      <PageTransition 
        tag="main"
        className={`flex w-full min-h-[calc(100svh-4rem)] max-w-5xl flex-col gap-4 border border-b-0 border-foreground/20 p-10 ${mainClassName}`}
      >
        {children}
      </PageTransition>
    </div>
  );
}
