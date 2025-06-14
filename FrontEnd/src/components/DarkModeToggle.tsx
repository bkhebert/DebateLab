// components/DarkModeToggle.tsx
import { useDarkMode } from "../contexts/useDarkMode";
import { FaMoon } from '@react-icons/all-files/fa/FaMoon';
import { FaSun } from '@react-icons/all-files/fa/FaSun';
const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      className="mx-auto p-1 mr-1 text-cstmblack bg-cstmwhite border-2 border-dashed border-primarydark dark:text-cstmwhite dark:bg-cstmdarkaccent dark:border-cstmwhite my-auto rounded-full hover:bg-opacity-80 transition-all duration-200"
      onClick={toggleDarkMode}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <FaSun className="w-7 h-7" />
      ) : (
        <FaMoon className="w-7 h-7" />
      )}
    </button>
  );
};

export default DarkModeToggle