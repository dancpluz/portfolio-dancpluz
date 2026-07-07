'use client';
import React, { useRef } from 'react';
import { useScroll, useTransform, m, MotionValue } from 'motion/react';

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className='flex items-center justify-center relative py-12 md:py-32 section-px'
      ref={containerRef}
    >
      <div
        className='w-full relative'
        style={{
          perspective: '1000px',
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <m.div
      style={{
        translateY: translate,
      }}
      className='max-w-5xl mx-auto text-center mb-8 md:mb-16'
    >
      {titleComponent}
    </m.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <m.div
      style={{
        rotateX: rotate,
        scale,
      }}
      className='max-w-5xl mx-auto aspect-4/3 md:aspect-video w-full border-2 md:border-4 border-foreground/20 p-2 md:p-4 bg-surface pixel-corners-border shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative'
    >
      <div className='h-full w-full overflow-hidden pixel-corners-small bg-background/50'>
        {children}
      </div>
    </m.div>
  );
};
