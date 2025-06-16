
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './views/Home';
import DebateLabPitch from './views/DebateLabPitch';
import { DarkModeProvider } from './contexts/DarkModeContext';
import DarkModeToggle from './components/DarkModeToggle';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import { useState } from 'react';
import Logout from "./views/Logout";
import SignIn from './views/Signin';
import SignUp from './views/SignUp';
import Onboarding from './views/Onboaring';
import Profile from './views/Profile';
function App() {

  const user = false;
  return (
     <>
   <DarkModeProvider>
      <AuthProvider>
     <BrowserRouter>
      <Header/>
        <div className="lg:py-8"></div>
      <div className={`grid grid-cols-1 lg:grid-cols-12 h-screen`}>
      <aside className="hidden lg:block lg:col-span-2 border-r border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto">
    <nav className="space-y-4 text-sm text-gray-700">
      <a href="#" className="block hover:text-black">Home</a>
      <a href="#" className="block hover:text-black">Profile</a>
      <a href="#" className="block hover:text-black">Settings</a>
      <a href="#" className="block hover:text-black">Logout</a>
    </nav>
  </aside>
  <div className="col-span-8">
     <Routes>
      <Route path="/" element={<Home user={user} />}/>
      <Route path="/logout" element={<Logout />}/>
      <Route path="/About" element={<DebateLabPitch />}/>
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/onboarding" element={<Onboarding/>} />
      <Route path="/profile" element={<Profile />} />
     </Routes>
     </div>
     <aside className="hidden lg:block lg:col-span-2 border-l border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Trending Topics</h2>
        <ul className="text-xs text-gray-600 space-y-2">
          <li>#FreeSpeech</li>
          <li>#LogicalFallacies</li>
          <li>#Philosophy</li>
          <li>#Politics</li>
        </ul>
      </aside>
     </div>
     </BrowserRouter>
     </AuthProvider>
     </DarkModeProvider>
     </>
  )
}

export default App
