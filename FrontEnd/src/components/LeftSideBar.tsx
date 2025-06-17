import useAuth from "../contexts/useAuth";


const LeftSideBar = () => {
  const { user } = useAuth();

  return (
          <aside className="hidden lg:block lg:col-span-2 border-r border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto dark:text-covenantlight dark:bg-covenantDark">
    <nav className="space-y-4 text-sm text-gray-700">
      <a href="/" className="block hover:text-black dark:hover:!text-primaryglow transition-colors">Home</a>
      { user ? <a href="/profile" className="block hover:text-black dark:hover:!text-primaryglow transition-colors">Profile</a> : null}
      { user ? null :  <a href="/signUp" className="block hover:text-black dark:hover:!text-primaryglow transition-colors">Sign Up</a> }
      { user ? null : <a href="/signIn" className="block hover:text-black dark:hover:!text-primaryglow transition-colors">Log In</a> }
      { user ? <a href="/logout" className="block hover:text-black dark:hover:!text-primaryglow transition-colors">Logout</a> : null}
      <a href="/analyzer" className="block hover:text-black dark:hover:!text-primaryglow transition-colors"> 
            Analyze</a>
            <a href="/debates" className="block hover:text-black dark:hover:!text-primaryglow transition-colors">
            Debates</a>
      <a
        href="https://www.paypal.com/donate/?business=BCJFZUCNXZ7L4&no_recurring=0&item_name=Hi%21+I+am+the+guy+who+made+DebateLab%21+This+project+is+kept+alive+by+donations+until+we+receive+funding.+Anything+helps.+%0A-Cheers&currency_code=USD"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:text-black dark:hover:!text-primaryglow transition-colors"
      >
        Donate
      </a>
    </nav>
          
          {/* <a href='/About'>About</a> */}
     
  </aside>
  )
}

export default LeftSideBar;