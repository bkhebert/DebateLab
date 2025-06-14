import { useState } from "react";
import { Menu, X } from "lucide-react"; // Optional: swap with your preferred icon lib

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center ml-1">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 bg-primarylight border border-double border-4 border-primarydark focus:outline-none focus:ring-2 focus:ring-cstmblack"
      >
        {open ? <X size={24} /> : <Menu size={20} />}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-md rounded-md z-50">
          <ul className="flex flex-col text-left text-sm text-cstmblack">
            <li className="p-3 hover:bg-gray-100 cursor-pointer">Home</li>
            <li className="p-3 hover:bg-gray-100 cursor-pointer">Analyze</li>
            <li className="p-3 hover:bg-gray-100 cursor-pointer">Debates</li>
            <li className="p-3 hover:bg-gray-100 cursor-pointer">Login</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
