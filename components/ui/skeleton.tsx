export default function Skeleton({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-foreground/10 ${className || ''}`}
      {...props}
    />
  )
}