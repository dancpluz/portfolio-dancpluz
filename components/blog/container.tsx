export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`flex w-full flex-col items-center justify-center`}>
      <main className={`flex min-h-svh w-full max-w-5xl flex-col gap-4 border border-foreground/20 p-8 pt-16 ${className}`}>
        {children}
      </main>
    </div>
  );
}
