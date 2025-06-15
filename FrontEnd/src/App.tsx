
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

function App() {

  return (
     <>
   <DarkModeProvider>
      <AuthProvider>
     <BrowserRouter>
      <Header/>
     <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/logout" element={<Logout />}/>
      <Route path="/About" element={<DebateLabPitch />}/>
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />
     </Routes>
     </BrowserRouter>
     </AuthProvider>
     </DarkModeProvider>
     </>
  )
}

export default App
