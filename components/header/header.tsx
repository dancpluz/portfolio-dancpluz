import LanguageSwitcher from '../lang-switcher';
import ThemeSwitcher from '../theme-switcher';
import Hamburguer from './hamburguer';
import Logo from './logo';
import { MenuProvider } from '@/hooks/use-menu';
import { getSocials } from '@/actions/socials';
import MenuOverlay from './menu-overlay';

export default async function Header() {
  const socials = await getSocials(true);
  // TODO: Handle error

  return (
    <MenuProvider socials={socials.data || []}>
      {/* Non-blended layer (Logo) */}
      <div className='fixed inset-x-0 top-0 py-6 section-px grid grid-cols-3 items-center justify-between gap-4 z-50 pointer-events-none'>
        <div className='flex items-center justify-start pointer-events-auto'>
          <Logo />
        </div>
      </div>

      {/* Blended layer (Menu + Switchers) */}
      <nav className='fixed inset-x-0 top-0 py-6 section-px grid grid-cols-3 items-center justify-between gap-4 z-50 mix-blend-difference pointer-events-none'>
        <div className='col-start-2 flex items-center justify-center pointer-events-auto'>
          <Hamburguer />
        </div>
        <div className='col-start-3 flex items-center justify-end gap-4 pointer-events-auto'>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </nav>
      <MenuOverlay />
    </MenuProvider>
  );
}
