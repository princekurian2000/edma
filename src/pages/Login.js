import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from './firebase';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      const name = result.user.displayName;
      const photoURL = result.user.photoURL;

      const userData = { email, name, photoURL };
      localStorage.setItem('user', JSON.stringify(userData));

      const response = await fetch(
        `https://edmamalayalee.co.uk/api/check_user.php?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (data.exists) {
        navigate(`/dashboard?familyId=${data.family_id}`);
      } else {
        alert('You are not registered. Please register before logging in.');
        localStorage.removeItem('user');
        await signOut(auth);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: 'linear-gradient(to right, #f8f9fa, #e8f0fe)',
      }}
    >
      <div
        className="card shadow border-0 p-4"
        style={{ maxWidth: '400px', width: '100%', borderRadius: '1rem' }}
      >
        <div className="text-center mb-4">
          <img
            src="/logo192.png"
            alt="EDMA Logo"
            width="60"
            className="mb-2"
          />
          <h3 className="fw-bold text-primary">Welcome to EDMA</h3>
          <p className="text-muted small">Login using your Google Account</p>
        </div>

        <button
          onClick={handleLogin}
          className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 w-100"
          style={{ fontWeight: '600' }}
        >
          <FcGoogle size={24} /> Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
