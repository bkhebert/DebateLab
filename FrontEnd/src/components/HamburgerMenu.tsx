import { useState } from "react";
import { Menu, X } from "lucide-react"; // Optional: swap with your preferred icon lib
import { Link } from "react-router-dom";
import useAuth from "../contexts/useAuth";
const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <div className="relative lg:hidden flex items-center ml-1">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 bg-primarylight border border-double border-4 border-primarydark dark:border-cstmneutral focus:outline-none focus:ring-2 focus:ring-cstmblack"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div 
        onClick={()=> {setOpen(false)}}
        className="absolute top-full left-0 mt-2 w-48 bg-white shadow-md rounded-md z-50">
          <nav className="flex flex-col text-left text-sm text-cstmblack">
            <Link to="/"><li className="p-4 hover:bg-gray-100 cursor-pointer border-solid border-primary/30 border-2">
            Home</li></Link>
            { user ? <Link to="/profile"><li className="p-4 hover:bg-gray-100 cursor-pointer border-solid border-primary/30 border-2">
            Profile</li></Link> : null}
           <Link to="/analyzer"> <li className="p-4 hover:bg-gray-100 cursor-pointer border-solid border-primary/30 border-2">
            Analyze</li></Link>
            <Link to="/debates"><li className="p-4 hover:bg-gray-100 cursor-pointer border-solid border-primary/30 border-2">
            Debates</li></Link>
            { user ? null :  <Link to="/signIn"><li className="p-4 hover:bg-gray-100 cursor-pointer border-solid border-primary/30 border-2">
           Log in</li></Link>}
            { user ? null :  <Link to="/signUp"><li className="p-4 hover:bg-gray-100 cursor-pointer border-solid border-primary/30 border-2">
           Sign up</li></Link>}
            { user ?<Link to="/logout"> <li className="p-4 hover:bg-gray-100 cursor-pointer border-solid border-primary/30 border-2">
            Log out</li></Link> : null}
            <li className="p-4 hover:bg-gray-100 cursor-pointer">
            <div className="flex justify-center">
          {/* <a href='/About'>About</a> */}
      <a
        href="https://www.paypal.com/donate/?business=BCJFZUCNXZ7L4&no_recurring=0&item_name=Hi%21+I+am+the+guy+who+made+DebateLab%21+This+project+is+kept+alive+by+donations+until+we+receive+funding.+Anything+helps.+%0A-Cheers&currency_code=USD"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-yellow-400/80 hover:bg-cstmgold text-cstmblack font-bold py-2 px-4 rounded"
      >
        Donate via PayPal
      </a>
      </div>
            </li>
          </nav>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
