import RevealWords from "@/components/RevealWords";

export default function Footer() {
  return (
    <>
        <div className='px-40 items-center ml-[100px] py-32 flex gap-16'>
          <div className='flex flex-col'>
            <p className='text-2xl font-extrabold'>VAMOS</p>
            <p className='text-2xl font-extrabold'>FAZER</p>
            <p className='text-2xl font-extrabold'>UM</p>
          </div>
          <RevealWords interval={3} question words={["site", "vídeo", "curso", "portfolio", "ecommerce", "aplicativo"]} />
        </div>
        <div className='w-full bg-foreground py-1'>
          <p className='text-center font-regular text-background'>TODOS OS DIRETOS RESERVADOS DANIEL LUZ </p>
        </div>
    </>
  )
}