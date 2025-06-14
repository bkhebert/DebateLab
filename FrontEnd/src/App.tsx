
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './views/Home';
import DebateLabPitch from './views/DebateLabPitch';
import { DarkModeProvider } from './contexts/DarkModeContext';
import DarkModeToggle from './components/DarkModeToggle';
import Header from './components/Header';
import { useState } from 'react';
function App() {

const [user, setUser] = useState({ name: 'John Doe' });
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/products', label: 'Products' },
  ];

  const handleLogin = () => {
    setUser({ name: 'John Doe' });
  };

  const handleLogout = () => {
    setUser({ name: 'John Doe' });
  };
  // const [darkMode, setDarkMode] = useState(false);

  // // useEffect(() => {
  // //   if(darkMode){
  // //     document.documentElement.classList.toggle('dark');
  // //   }
  // // }, [darkMode])
  return (
     <>
   <DarkModeProvider>
      
      <Header/>
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
