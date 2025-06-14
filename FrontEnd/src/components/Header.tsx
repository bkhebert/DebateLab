import DarkModeToggle from "./DarkModeToggle";
import HamburgerMenu from "./HamburgerMenu";
const Header = () => {
  return (
    <div className="relative grid grid-cols-3 border border-btm border-cstmblack bg-primarylight/50">
      <div className="grid grid-cols-3">
      <HamburgerMenu /> {/* 👈 Now mobile only */}
 
      <div className="col-span-2 mt-2 mb-2 ml-2 md:mt-44 w-full h-full">
        <div className="bg-cstmblack/85 rounded-lg w-full">
          <img src="/debatelabwhite.png" alt="DebateLab Logo" className="w-96 md:w-80 mx-auto" />
        </div>

      </div>
      </div>
      <div></div>
      <DarkModeToggle/>
      </div>
  )
}

export default Header;