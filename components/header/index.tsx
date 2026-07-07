import LanguageSwitcher from '../lang-switcher';
import ThemeSwitcher from '../theme-switcher';
import Hamburguer from './hamburguer';
import Logo from './logo';
import MenuOverlay from './menu-overlay';

export default function Header() {
  return (
    <>
      {/* Logo layer (No blend) */}
      <div className='fixed inset-x-0 top-0 py-4 md:py-6 section-px flex justify-between items-center z-50 pointer-events-none'>
        <div className='flex items-center justify-start pointer-events-auto'>
          <Logo />
        </div>
      </div>

      {/* Controls layer (With blend) */}
      <nav className='fixed inset-x-0 top-0 py-4 md:py-6 section-px flex items-center justify-end md:grid md:grid-cols-3 z-50 mix-blend-difference pointer-events-none'>
        {/* Desktop Hamburguer */}
        <div className='hidden md:flex col-start-2 items-center justify-center pointer-events-auto'>
          <Hamburguer />
        </div>
        {/* Desktop Switchers */}
        <div className='hidden md:flex col-start-3 items-center justify-end gap-4 pointer-events-auto'>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        {/* Mobile Controls (grouped on the right) */}
        <div className='flex md:hidden items-center gap-3 pointer-events-auto'>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Hamburguer />
        </div>
      </nav>
      <MenuOverlay />
    </>
  );
}
