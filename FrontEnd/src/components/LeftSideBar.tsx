import useAuth from "../contexts/useAuth";


const LeftSideBar = () => {
  const { user } = useAuth();

  return (
          <aside className="hidden lg:block lg:col-span-2 border-r border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto">
    <nav className="space-y-4 text-sm text-gray-700">
      <a href="/" className="block hover:text-black">Home</a>
      { user ? <a href="/profile" className="block hover:text-black">Profile</a> : null}
      { user ? null :  <a href="/signUp" className="block hover:text-black">Sign Up</a> }
      { user ? null : <a href="/signIn" className="block hover:text-black">Log In</a> }
      { user ? <a href="/logout" className="block hover:text-black">Logout</a> : null}
      <a href="/analyzer" className="block hover:text-black"> 
            Analyze</a>
            <a href="/debates" className="block hover:text-black">
            Debates</a>
    </nav>
  </aside>
  )
}

export default LeftSideBar;