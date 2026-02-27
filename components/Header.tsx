import LanguageSwitcher from "./lang-switcher";
import ThemeSwitcher from "./theme-switcher";

export default function Header() {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  );
}
