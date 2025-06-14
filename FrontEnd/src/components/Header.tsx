import DarkModeToggle from "./DarkModeToggle";
import HamburgerMenu from "./HamburgerMenu";
const Header = () => {
  return (
    <div className="relative grid grid-cols-3 border border-btm border-cstmblack bg-primarylight/50">
     <HamburgerMenu /> {/* 👈 Now mobile only */}
   <div className="text-center mt-2 mb-2 md:mt-44 w-full">
        <div className="bg-cstmblack/85 my-auto mx-auto ml-2 rounded-full">
          <img src="/debatelabwhite.png" alt="DebateLab Logo" className="w-13 md:w-80 mx-auto" />
        </div>
      </div>
    <DarkModeToggle/>
      </div>
  )
}

export default Header;