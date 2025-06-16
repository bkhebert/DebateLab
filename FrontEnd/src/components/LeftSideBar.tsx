import useAuth from "../contexts/useAuth";


const LeftSideBar = () => {
  const { user } = useAuth();

  return (
          <aside className="hidden lg:block lg:col-span-2 border-r border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto">
    <nav className="space-y-4 text-sm text-gray-700">
      <a href="/" className="block hover:text-black">Home</a>
      { user ? <a href="/profile" className="block hover:text-black">Profile</a> : null}
      <a href="#" className="block hover:text-black">Settings</a>
      { user ? <a href="/logout" className="block hover:text-black">Logout</a> : null}
    </nav>
  </aside>
  )
}

export default LeftSideBar;