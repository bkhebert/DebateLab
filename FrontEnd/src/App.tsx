
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
import LeftSideBar from './components/LeftSideBar';
import RightSideBar from './components/RightSideBar';
import AnalyzerCard from './components/AnalyzerCard';
import Debates from './views/Debates';
function App() {


  return (
     <>
   <DarkModeProvider>
      <AuthProvider>
     <BrowserRouter>
      <Header/>
        <div className="lg:py-8"></div>
      <div className={`grid grid-cols-1 lg:grid-cols-12 h-screen`}>
    <LeftSideBar />
  <div className="col-span-8">
     <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/logout" element={<Logout />}/>
      <Route path="/About" element={<DebateLabPitch />}/>
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/onboarding" element={<Onboarding/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/analyzer" element={<AnalyzerCard closeModal={null}/>} />
      <Route path="/debates" element={<Debates />} />
     </Routes>
     </div>
      <RightSideBar />
     </div>
     </BrowserRouter>
     </AuthProvider>
     </DarkModeProvider>
     </>
  )
}

export default App
