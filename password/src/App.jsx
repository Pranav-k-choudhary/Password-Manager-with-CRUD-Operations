import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'
import Auth from './components/Auth'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5600';

function App() {
  const [auth, setAuth] = useState(() => ({
    token: sessionStorage.getItem('authToken') || '',
    email: sessionStorage.getItem('userEmail') || '',
    userId: sessionStorage.getItem('userId') || '',
    isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true',
  }));

  const saveAuth = ({ token, email, userId }) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('isLoggedIn', 'true');
    setAuth({ token, email, userId, isLoggedIn: true });
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('isLoggedIn');
    setAuth({ token: '', email: '', userId: '', isLoggedIn: false });
    toast.info('You have been logged out');
  };

  useEffect(() => {
    if (!auth.token) return;

    const validate = async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/validate`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          logout();
          return;
        }

        const data = await response.json();
        setAuth((prev) => ({
          ...prev,
          email: data.user.email,
          userId: data.user.userId,
          isLoggedIn: true,
        }));
      } catch (error) {
        logout();
      }
    };

    validate();
  }, []);

  return (
    <>
      <Navbar
        isLoggedIn={auth.isLoggedIn}
        userEmail={auth.email}
        onLogout={logout}
      />
      <div className='min-h-[85vh] pt-16 pb-28'>
        {auth.isLoggedIn ? (
          <Manager
            authToken={auth.token}
            user={auth}
            onLogout={logout}
          />
        ) : (
          <Auth onAuthSuccess={saveAuth} />
        )}
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App
