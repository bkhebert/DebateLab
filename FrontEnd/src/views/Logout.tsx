
import React, { useEffect } from "react";
import useAuth from "../contexts/useAuth";
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      navigate('/');
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Logging out...</h1>
        <p className="text-slate-600">Please wait while we securely sign you out.</p>
      </div>
    </div>
  );
};

export default Logout;