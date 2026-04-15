import { cn } from '@/lib/utils';

type BracketTextProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  text?: string;
  accentClass?: string;
};

export default function BracketText({
  children,
  text,
  accentClass = 'text-accent-1',
  className = '',
  ...props
}: BracketTextProps) {
  return (
    <div
      className={cn('font-heading font-bold tracking-wider text-foreground', className)}
      {...props}
    >
      <span className={accentClass}>[</span> {children || text}{' '}
      <span className={accentClass}>]</span>
    </div>
  );
}
