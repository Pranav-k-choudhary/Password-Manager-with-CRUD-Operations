import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';


const Auth = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login');

  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
      
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-green-700">VaultX Authentication</h1>
        <p className="text-sm text-gray-600 mt-2">
          Secure access to your password manager. Create an account, login, or reset your password.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => setMode('login')}
          className={`px-4 py-2 rounded-full transition ${mode === 'login' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border border-green-600'}`}
        >
          Login
        </button>
        <button
          onClick={() => setMode('register')}
          className={`px-4 py-2 rounded-full transition ${mode === 'register' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border border-green-600'}`}
        >
          Register
        </button>
        
      </div>

      <div className="w-full max-w-md rounded-3xl border border-green-200 bg-white/90 p-8 shadow-xl">
        {mode === 'login' && <Login onAuthSuccess={onAuthSuccess} />}
        {mode === 'register' && <Register onAuthSuccess={onAuthSuccess} />}
      </div>
      </div>
    </>
  );
};

export default Auth;
