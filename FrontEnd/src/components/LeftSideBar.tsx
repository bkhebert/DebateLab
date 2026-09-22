import useAuth from "../contexts/useAuth";
import { Link } from "react-router-dom";

const LeftSideBar = () => {
  const { user } = useAuth();

  return (
          <aside className="hidden lg:block lg:col-span-2 border-r border-border p-4 bg-background h-screen overflow-y-auto text-foreground">
    <nav className="space-y-4 text-sm text-muted-foreground">
     <Link to="/" className="block hover:text-primary transition-colors">Home</Link>
      { user ?<Link to="/profile" className="block hover:text-primary transition-colors">Profile</Link> : null}
      { user ? null : <Link to="/signUp" className="block hover:text-primary transition-colors">Sign Up</Link> }
      { user ? null :<Link to="/signIn" className="block hover:text-primary transition-colors">Log In</Link> }
      { user ?<Link to="/logout" className="block hover:text-primary transition-colors">Logout</Link> : null}
     <Link to="/analyzer" className="block hover:text-primary transition-colors">
            Analyze</Link>
            <Link to="/debates" className="block hover:text-primary transition-colors">
            Debates</Link>
      <a
        href="https://www.paypal.com/donate/?business=BCJFZUCNXZ7L4&no_recurring=0&item_name=Hi%21+I+am+the+guy+who+made+DebateLab%21+This+project+is+kept+alive+by+donations+until+we+receive+funding.+Anything+helps.+%0A-Cheers&currency_code=USD"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:text-primary transition-colors"
      >
        Donate
      </a>
    </nav>
          
          {/* <a href='/About'>About</a> */}
     
  </aside>
  )
}

export default LeftSideBar;