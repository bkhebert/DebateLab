import DarkModeToggle from "./DarkModeToggle";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
const Header = () => {
  return (
    <div className="lg:fixed lg:top-0 lg:right-0 lg:left-0 grid grid-cols-3 border border-btm border-cstmblack bg-primarylight/50 z-10">
      
      <div className="grid grid-cols-3">
      <HamburgerMenu /> {/* 👈 Now mobile only */}
 
      <div className="col-span-2 mt-2 mb-2 ml-2 w-full">
        <div className="bg-cstmblack/85 rounded-lg w-full  max-w-[100px] ">
          <img src="/debatelabwhite.png" alt="DebateLab Logo" className="w-96 max-w-[100px] md:w-80 mx-auto lg:ml-1" />
        </div>

      </div>
      </div>
      <div>
      </div>
      <div className="lg:grid lg:grid-cols-3">
        <div className="hidden lg:flex"></div>
        <div className="hidden lg:flex"></div>
      <div className="grid grid-cols-3">
       <Link to="/signIn"> <p className="hidden lg:flex mr-1 mx-auto mt-2 my-auto text-black dark:text-primaryglow hover:!text-cstmgold">Log in</p></Link>
        <Link to="/signUp"> <p className="hidden lg:flex mx-auto mt-2 my-auto text-black dark:text-primaryglow hover:!text-cstmgreen">Sign up</p></Link>
      <DarkModeToggle/>
      </div>
      </div>
      </div>
  )
}

export default Header;