import { motion } from "framer-motion";

export default function Footer() {
  return (
    <>
      <div className='px-40 justify-end mr-[400px] py-32 flex gap-16 grow'>
        <div className='flex flex-col'>
          <p className='text-2xl font-extrabold'>VAMOS</p>
          <p className='text-2xl font-extrabold'>FAZER</p>
          <p className='text-2xl font-extrabold'>UM</p>
        </div>
        <RevealLinks />
        {/* <h1 className='text-center text-8xl font-extrabold'>PROJETO UI/UX</h1> */}
        <h1 className='text-center text-8xl font-extrabold'>?</h1>
      </div>
      <div className='w-full bg-foreground py-1'>
        <p className='text-center text-background'>TODOS OS DIRETOS RESERVADOS DANIEL LUZ </p>
      </div>
    </>
  )
}

export const RevealLinks = () => {
  return (
    <section className="grid place-content-center gap-2 text-foreground">
      <FlipLink href="#">Twitter</FlipLink>
    </section>
  );
};

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, href }: { children: string; href: string }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative w-full base overflow-hidden whitespace-nowrap text-8xl font-black uppercase"
      style={{
        lineHeight: 0.75,
      }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              hovered: {
                y: "-100%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {'children'.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: "100%",
              },
              hovered: {
                y: 0,
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};
