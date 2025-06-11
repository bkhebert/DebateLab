
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './views/Home';
import DebateLabPitch from './views/DebateLabPitch';
import { DarkModeProvider } from './contexts/DarkModeContext';
import DarkModeToggle from './components/DarkModeToggle';

function App() {

  // const [darkMode, setDarkMode] = useState(false);

  // // useEffect(() => {
  // //   if(darkMode){
  // //     document.documentElement.classList.toggle('dark');
  // //   }
  // // }, [darkMode])
  return (
     <>
           <DarkModeProvider>
           <div className="flex justify-end p-1">
              <DarkModeToggle/>
           </div>
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/About" element={<DebateLabPitch />}/>
     </Routes>
     </BrowserRouter>
     </DarkModeProvider>
     </>
  )
}

export default App
