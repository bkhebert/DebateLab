import MobileLayout from "../components/MobileLayout";
import DesktopLayout from "./DesktopLayout";
import useAuth from "../contexts/useAuth";
function Home() {

  const {user} = useAuth();
console.log(JSON.stringify(user));
  

return (
    <div>
      {/* Left Sidebar */}


  { !user && <div className="hidden lg:block">
  <DesktopLayout />
  </div>
  }
   <div className={`${user ? "" : "lg:hidden" }`}>
    <MobileLayout topic={null}/>
    </div>
      {/* Right Sidebar */}

    </div>
  );
}


export default Home;