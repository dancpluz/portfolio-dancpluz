import LanguageSwitcher from './lang-switcher';
import ThemeSwitcher from './theme-switcher';
import Hamburguer from './header/hamburguer';
import Logo from './header/logo';
import { MenuProvider } from '@/hooks/use-menu';
import { getContacts } from '@/actions/icons';
import MenuOverlay from './header/menu-overlay';

export default async function Header() {
  const contacts = await getContacts();
  // TODO: Handle error

  return (
    <MenuProvider contacts={contacts.data || []}>
      <nav className='fixed inset-x-0 top-0 p-6 grid grid-cols-3 items-center justify-between gap-4 z-50'>
        <div className='flex items-center justify-start'>
          <Logo />
        </div>
        <div className='flex items-center justify-center'>
          <Hamburguer />
        </div>
        <div className='flex items-center justify-end gap-4'>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </nav>
      <MenuOverlay />
    </MenuProvider>
  );
}
