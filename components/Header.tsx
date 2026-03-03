import LanguageSwitcher from "./lang-switcher";
import ThemeSwitcher from "./theme-switcher";
import Hamburguer from "./ui/hamburguer";
import Logo from "./ui/logo";

export default function Header() {
  return (
    <nav className='fixed inset-x-0 top-0 p-6 z-50 grid grid-cols-3 items-center justify-between gap-4'>
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
  );
}
