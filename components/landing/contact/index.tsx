import { getSectionId } from '@/lib/utils';
import { ROUTES } from '@/lib/constant';
import FlipText from '../../extra/flip-text';
import DvdLogo from './dvd-logo';
import VHSTape from './vhs-tape';
import { getSocials } from '@/actions/socials';
import { Reveal } from '@/components/motion/reveal';
import Image from 'next/image';
import VCREffect from '@/components/extra/vcr';
import { getTranslations } from 'next-intl/server';

export default async function Contact() {
  const [{ data: socials }, t] = await Promise.all([
    getSocials(true),
    getTranslations('contact')
  ]);

  return (
    <section id={getSectionId(ROUTES.contact)} className='w-full'>
      <Reveal direction='up' once={false}>
        <FlipText text={t('title')} className='font-heading text-8xl mb-6' />
      </Reveal>
      <div className='flex gap-6'>
        <Reveal
          direction='up'
          delay={0.2}
          once={false}
          className='w-1/2 min-w-1/2'
        >
          <div className='relative w-full aspect-square my-[-5%]'>
            <div
              className='absolute z-10'
              style={{ top: '14%', bottom: '27%', left: '10%', right: '10%' }}
            >
              <div className='w-full h-full relative overflow-hidden bg-white/70'>
                <VCREffect
                  config={{ glitch: false, contentBlur: 0.7 }}
                  className='absolute inset-0 w-full h-full'
                >
                  <div className='absolute inset-0 flex items-center justify-center pointer-events-none opacity-20'>
                    <span className='font-heading text-7xl text-center font-bold leading-tight whitespace-nowrap text-black uppercase'>
                      {t('lets_talk_1')}
                      <br />
                      {t('lets_talk_2')}
                    </span>
                  </div>
                  <DvdLogo />
                </VCREffect>
              </div>
            </div>

            <Image
              src='/img/tv.webp'
              alt='Retro TV Frame'
              fill
              className='object-contain pointer-events-none z-10 absolute inset-0 drop-shadow-2xl'
            />
          </div>
        </Reveal>
        <div className='flex flex-col w-full justify-center'>
          {(socials || []).map((social, index) => (
            <VHSTape key={social.id} social={social} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

