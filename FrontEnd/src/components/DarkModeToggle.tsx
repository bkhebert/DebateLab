// components/DarkModeToggle.tsx
import { useDarkMode } from "../contexts/useDarkMode";
import { FaMoon } from '@react-icons/all-files/fa/FaMoon';
import { FaSun } from '@react-icons/all-files/fa/FaSun';
const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      className="col-span-3 col-span-1 p-1 mt-3 mx-auto text-cstmblack bg-cstmwhite border-2 border-dashed border-primarydark dark:text-cstmwhite dark:bg-cstmdarkaccent dark:border-cstmwhite my-auto rounded-full hover:bg-opacity-80 transition-all duration-200"
      onClick={toggleDarkMode}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <FaSun className="w-6 h-6" />
      ) : (
        <FaMoon className="w-6 h-6" />
      )}
    </button>
  );
};

export default DarkModeToggle