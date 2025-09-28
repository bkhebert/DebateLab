
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './views/Home';
import DebateLabPitch from './views/DebateLabPitch';
import { DarkModeProvider } from './contexts/DarkModeContext';

import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';

import Logout from "./views/Logout";
import SignIn from './views/Signin';
import SignUp from './views/SignUp';
import Onboarding from './views/Onboaring';
import Profile from './views/Profile';
import LeftSideBar from './components/LeftSideBar';
import RightSideBar from './components/RightSideBar';
import AnalyzerCard from './components/AnalyzerCard';
import Debates from './views/Debates';
import OnboardingTags from './views/onboardingTags';
import OnboardingBeliefs from './views/onboardingBeliefs';
import TheGreatConversation from './views/TheGreatConversation';
import ExtensionDownloadPage from './views/ExtensionDownload';
import Admin from './views/Admin';
import CoverLetterGenerator from './views/CoverLetterGenerator';
import RecoilSimulatorApp from './views/PleaseHireMeHaptech';
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
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/logout" element={<Logout />}/>
      <Route path="/About" element={<DebateLabPitch />}/>
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/onboarding" element={<Onboarding/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/analyzer" element={<AnalyzerCard closeModal={null} showLogo={true} showExit={false}/>} />
      <Route path="/debates" element={<Debates />} />
      <Route path="/onboarding/beliefs" element={<OnboardingBeliefs />} />
      <Route path="/onboarding/tags" element={<OnboardingTags/>} />
      <Route path="/thegreatconversation" element={<TheGreatConversation/>}/>
      <Route path="/extension" element={<ExtensionDownloadPage/>} />
      <Route path="/coverlettergenerator" element={<CoverLetterGenerator/>}/>
      <Route path="/pleasehiremehaptech" element={<RecoilSimulatorApp/>}/>
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
