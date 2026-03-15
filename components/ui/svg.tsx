import type { SVGProps } from 'react';

export function ArrowRight({
  className,
  ...props
}: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className={className}
      {...props}
    >
      <polygon
        className='fill-current'
        points='23 11 23 13 22 13 22 14 21 14 21 15 20 15 20 16 19 16 19 17 18 17 18 18 17 18 17 19 16 19 16 20 15 20 15 21 14 21 14 22 13 22 13 23 12 23 12 22 11 22 11 21 12 21 12 20 13 20 13 19 14 19 14 18 15 18 15 17 16 17 16 16 17 16 17 15 18 15 18 14 19 14 19 13 1 13 1 11 19 11 19 10 18 10 18 9 17 9 17 8 16 8 16 7 15 7 15 6 14 6 14 5 13 5 13 4 12 4 12 3 11 3 11 2 12 2 12 1 13 1 13 2 14 2 14 3 15 3 15 4 16 4 16 5 17 5 17 6 18 6 18 7 19 7 19 8 20 8 20 9 21 9 21 10 22 10 22 11 23 11'
      />
    </svg>
  );
}

export function Moon({
  className,
  ...props
}: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className={className}
      {...props}
    >
      <polygon
        className='fill-current'
        points='22 17 22 19 21 19 21 20 20 20 20 21 18 21 18 22 16 22 16 23 10 23 10 22 8 22 8 21 6 21 6 20 5 20 5 19 4 19 4 17 3 17 3 15 2 15 2 9 3 9 3 7 4 7 4 5 5 5 5 4 6 4 6 3 8 3 8 2 10 2 10 1 15 1 15 2 13 2 13 3 11 3 11 4 10 4 10 6 9 6 9 8 8 8 8 12 9 12 9 14 10 14 10 16 11 16 11 17 13 17 13 18 15 18 15 19 19 19 19 18 21 18 21 17 22 17'
      />
    </svg>
  );
}

export function Sun({
  className,
  ...props
}: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className={className}
      {...props}
    >
      <polygon
        className='fill-current'
        points='17 10 17 14 16 14 16 15 15 15 15 16 14 16 14 17 10 17 10 16 9 16 9 15 8 15 8 14 7 14 7 10 8 10 8 9 9 9 9 8 10 8 10 7 14 7 14 8 15 8 15 9 16 9 16 10 17 10'
      />
      <path
        className='fill-current'
        d='m21,11v-1h1v-1h1v-2h-3v-1h-2v-2h-1V1h-2v1h-1v1h-1v1h-2v-1h-1v-1h-1v-1h-2v3h-1v2h-2v1H1v2h1v1h1v1h1v2h-1v1h-1v1h-1v2h3v1h2v2h1v3h2v-1h1v-1h1v-1h2v1h1v1h1v1h2v-3h1v-2h2v-1h3v-2h-1v-1h-1v-1h-1v-2h1Zm-3,4h-1v1h-1v1h-1v1h-6v-1h-1v-1h-1v-1h-1v-6h1v-1h1v-1h1v-1h6v1h1v1h1v1h1v6Z'
      />
    </svg>
  );
}

export function Globe({
  className,
  ...props
}: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className={className}
      {...props}
    >
      <path
        className='fill-current'
        d='m22,9v-2h-1v-2h-1v-1h-1v-1h-2v-1h-2v-1h-6v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1v-6h-1Zm-4,3v-3h1v-1h1v1h1v4h-2v-1h-1Zm-4,7v2h-2v-3h-1v-1h-1v-3h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-2h1v-1h1v-1h1v-1h3v-1h2v1h1v4h-2v2h1v1h-2v-1h-2v2h3v1h4v1h1v3h-1v2h-1Z'
      />
    </svg>
  );
}
