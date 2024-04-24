'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function Sobre() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress);

  const background = useTransform(scrollYProgress,
    [0, 1],
    ["rgb(86,1,245)", "rgb(1,245,13)"]
  )

  return (
    <main>
      <motion.div
        style={{
          scaleX,
          background,
          transformOrigin: 'left',
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '4px',
        }}
        className='mt-24 m-auto h-32 w-32 bg-foreground'/>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non eros non dui posuere aliquam. Duis aliquam dui quis ligula condimentum facilisis. Morbi dui diam, tempus quis tortor et, elementum efficitur augue. Quisque tortor felis, euismod sit amet nunc sed, imperdiet consectetur diam. Sed et pulvinar purus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas tortor libero, iaculis quis tincidunt sed, gravida gravida nulla. 
        </p>
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Ut mollis mattis eros, eu aliquet sapien euismod id. Duis fermentum, ex vel consectetur egestas, sem odio dignissim odio, at rutrum ipsum metus vitae elit. Nunc massa nisl, cursus quis mauris eu, auctor imperdiet felis. Maecenas vel velit sed mi viverra maximus sed nec neque. Vestibulum a felis rutrum, vestibulum urna a, ullamcorper est. Suspendisse aliquam neque vel neque sollicitudin facilisis. Pellentesque porta et quam a scelerisque. Aenean ut nulla ac sapien rhoncus faucibus nec ac sem. Vivamus non tincidunt velit. Nunc ut massa sed lacus ultricies dapibus a id neque. Integer non metus eget ex aliquet tincidunt. Nam faucibus pretium felis, sit amet porta sem fringilla et. 
        </p>
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Ut mollis mattis eros, eu aliquet sapien euismod id. Duis fermentum, ex vel consectetur egestas, sem odio dignissim odio, at rutrum ipsum metus vitae elit. Nunc massa nisl, cursus quis mauris eu, auctor imperdiet felis. Maecenas vel velit sed mi viverra maximus sed nec neque. Vestibulum a felis rutrum, vestibulum urna a, ullamcorper est. Suspendisse aliquam neque vel neque sollicitudin facilisis. Pellentesque porta et quam a scelerisque. Aenean ut nulla ac sapien rhoncus faucibus nec ac sem. Vivamus non tincidunt velit. Nunc ut massa sed lacus ultricies dapibus a id neque. Integer non metus eget ex aliquet tincidunt. Nam faucibus pretium felis, sit amet porta sem fringilla et. 
        </p>
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Ut mollis mattis eros, eu aliquet sapien euismod id. Duis fermentum, ex vel consectetur egestas, sem odio dignissim odio, at rutrum ipsum metus vitae elit. Nunc massa nisl, cursus quis mauris eu, auctor imperdiet felis. Maecenas vel velit sed mi viverra maximus sed nec neque. Vestibulum a felis rutrum, vestibulum urna a, ullamcorper est. Suspendisse aliquam neque vel neque sollicitudin facilisis. Pellentesque porta et quam a scelerisque. Aenean ut nulla ac sapien rhoncus faucibus nec ac sem. Vivamus non tincidunt velit. Nunc ut massa sed lacus ultricies dapibus a id neque. Integer non metus eget ex aliquet tincidunt. Nam faucibus pretium felis, sit amet porta sem fringilla et. 
        </p>
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Ut mollis mattis eros, eu aliquet sapien euismod id. Duis fermentum, ex vel consectetur egestas, sem odio dignissim odio, at rutrum ipsum metus vitae elit. Nunc massa nisl, cursus quis mauris eu, auctor imperdiet felis. Maecenas vel velit sed mi viverra maximus sed nec neque. Vestibulum a felis rutrum, vestibulum urna a, ullamcorper est. Suspendisse aliquam neque vel neque sollicitudin facilisis. Pellentesque porta et quam a scelerisque. Aenean ut nulla ac sapien rhoncus faucibus nec ac sem. Vivamus non tincidunt velit. Nunc ut massa sed lacus ultricies dapibus a id neque. Integer non metus eget ex aliquet tincidunt. Nam faucibus pretium felis, sit amet porta sem fringilla et. 
        </p>
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Ut mollis mattis eros, eu aliquet sapien euismod id. Duis fermentum, ex vel consectetur egestas, sem odio dignissim odio, at rutrum ipsum metus vitae elit. Nunc massa nisl, cursus quis mauris eu, auctor imperdiet felis. Maecenas vel velit sed mi viverra maximus sed nec neque. Vestibulum a felis rutrum, vestibulum urna a, ullamcorper est. Suspendisse aliquam neque vel neque sollicitudin facilisis. Pellentesque porta et quam a scelerisque. Aenean ut nulla ac sapien rhoncus faucibus nec ac sem. Vivamus non tincidunt velit. Nunc ut massa sed lacus ultricies dapibus a id neque. Integer non metus eget ex aliquet tincidunt. Nam faucibus pretium felis, sit amet porta sem fringilla et. 
        </p>
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Ut mollis mattis eros, eu aliquet sapien euismod id. Duis fermentum, ex vel consectetur egestas, sem odio dignissim odio, at rutrum ipsum metus vitae elit. Nunc massa nisl, cursus quis mauris eu, auctor imperdiet felis. Maecenas vel velit sed mi viverra maximus sed nec neque. Vestibulum a felis rutrum, vestibulum urna a, ullamcorper est. Suspendisse aliquam neque vel neque sollicitudin facilisis. Pellentesque porta et quam a scelerisque. Aenean ut nulla ac sapien rhoncus faucibus nec ac sem. Vivamus non tincidunt velit. Nunc ut massa sed lacus ultricies dapibus a id neque. Integer non metus eget ex aliquet tincidunt. Nam faucibus pretium felis, sit amet porta sem fringilla et. 
        </p>
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Ut mollis mattis eros, eu aliquet sapien euismod id. Duis fermentum, ex vel consectetur egestas, sem odio dignissim odio, at rutrum ipsum metus vitae elit. Nunc massa nisl, cursus quis mauris eu, auctor imperdiet felis. Maecenas vel velit sed mi viverra maximus sed nec neque. Vestibulum a felis rutrum, vestibulum urna a, ullamcorper est. Suspendisse aliquam neque vel neque sollicitudin facilisis. Pellentesque porta et quam a scelerisque. Aenean ut nulla ac sapien rhoncus faucibus nec ac sem. Vivamus non tincidunt velit. Nunc ut massa sed lacus ultricies dapibus a id neque. Integer non metus eget ex aliquet tincidunt. Nam faucibus pretium felis, sit amet porta sem fringilla et. 
        </p>
    </main>
  )
}
