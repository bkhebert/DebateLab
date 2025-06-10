// components/DarkModeToggle.tsx
import { useDarkMode } from "../contexts/useDarkMode";

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      className="text-cstmwhite bg-cstmblack px-4 py-1"
      onClick={toggleDarkMode}
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default DarkModeToggle