import React, { useState, useEffect } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoIosArrowBack } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('select');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleBack = () => {
        setMode('select');
    }

    const handleGoogleLogin = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = window.location.origin;
        const scope = 'email profile';
        const responseType = 'token'; 
  
        const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=consent`;
  
        window.location.href = oauthUrl;
    };

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const token = hashParams.get('access_token');
      
        if (token) {
            fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json()).then(async (user) => {
                console.log("User info:", user);

                const res = await fetch('http://localhost:3000/api/google-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('token', `Bearer ${data.token}`);
                    window.history.replaceState({}, document.title, window.location.pathname);
                    navigate('/dashboard');
                } else {
                    console.error('Backend login error:', data.error);
                }
            });
        }
    }, []);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
      
        const email = e.target.email.value;
        const password = e.target.password.value;
      
        try {
            const res = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
      
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            console.log('Login success:', data);
      
            localStorage.setItem('token', data.token);
      
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage(error.message);
            console.error(error);
        }
    };

    const handleEmailSignup = async (e) => {
        e.preventDefault();
      
        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
      
        try {
            const res = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });
      
            if (!res.ok) throw new Error('Signup failed');
            const data = await res.json();
            console.log('Signup success:', data);
      
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            alert('Signup failed');
            console.error(err);
        }
    };

    if (!isOpen) {
        return <div style={{ display: 'none' }} />;
    }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
        <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md h-[600px] overflow-y-auto text-center relative shadow-xl flex flex-col justify-between">
            <div className="w-full">
            {mode === 'select' && (
                <>
                    <div className="flex justify-end mb-4">
                    <button onClick={onClose} className="text-2xl font-bold text-gray-500 hover:text-black cursor-pointer">&times;</button>
                    </div>
                    <h2 className="text-2xl font-semibold leading-snug">Sign in to unlock the best of <span className="block">TravelBuddy.</span></h2>
                    <div className="flex flex-col gap-4 mt-20">
                        <button onClick={handleGoogleLogin} className="w-full border border-black rounded-full flex items-center justify-center gap-3 py-3 hover:bg-gray-100 cursor-pointer">
                            <FcGoogle size={22} />
                            <span className="font-medium">Continue with Google</span>
                        </button>

                        <button className="w-full border border-black rounded-full flex items-center justify-center gap-3 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => setMode('login')}>
                            <FaEnvelope size={18} />
                            <span className="font-medium">Continue with email</span>
                        </button>
                    </div>
                </>
            )}

            {mode === 'login' && (
                <>
                    <div className="flex justify-center items-center mb-6 gap-85">
                            <IoIosArrowBack className="text-2xl text-gray-500 hover:text-black cursor-pointer" onClick={handleBack}/>
                        
                        <button onClick={onClose} className="text-2xl font-bold text-gray-500 hover:text-black cursor-pointer">
                            &times;
                        </button>
                    </div>

                    <h2 className="text-2xl font-semibold mb-6">Welcome back.</h2>
                    <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 w-full max-w-sm mx-auto">
                        <div>
                            <label className="block font-medium mb-1 text-left">Email address</label>
                            <input type="email" placeholder="Email" name="email" className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-left">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} placeholder="Password" name="password" className="w-full border rounded-lg px-4 py-2 pr-10" />
                                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <a href="#" className="text-sm underline text-center hover:text-indigo-600">Forgot password?</a>
                        <button type="submit" className="bg-black text-white rounded-full py-3 cursor-pointer hover:bg-neutral-800">Sign in</button>
                        {errorMessage && (
                            <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
                        )}
                    </form>
                    <div className="my-6 flex items-center text-gray-400 text-sm">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2">Not a member?</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                    <p className="text-sm text-center">
                    <span className="underline font-semibold cursor-pointer hover:text-indigo-600" onClick={() => setMode('signup')}>Join</span> today to unlock the best of TravelBuddy.
                    </p>
                </>
            )}

            {mode === 'signup' && (
                <>
                    <div className="flex justify-center items-center mb-6 gap-85">
                        <IoIosArrowBack className="text-2xl text-gray-500 hover:text-black cursor-pointer" onClick={handleBack}/>
                        <button onClick={onClose} className="text-2xl font-bold text-gray-500 hover:text-black cursor-pointer">
                            &times;
                        </button>
                    </div>
                    <h2 className="text-2xl font-semibold mb-6">Join to unlock the best of TravelBuddy</h2>
                    <form onSubmit={handleEmailSignup} className="flex flex-col gap-4 w-full max-w-sm mx-auto">
                        <div className="flex flex-col flex-1">
                            <label className="block font-medium mb-1 text-left">First Name</label>
                            <input type="text" name="firstName" placeholder="First Name" className="border rounded-lg px-4 py-2" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="block font-medium mb-1 text-left">Last Name</label>
                            <input type="text" name="lastName" placeholder="Last Name" className="border rounded-lg px-4 py-2" />
                        </div>

                        <div className="flex flex-col flex-1">
                            <label className="block font-medium mb-1 text-left">Email address</label>
                            <input type="email" name="email" placeholder="Email" className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div className="relative">
                            <label className="block font-medium mb-1 text-left">Password</label>
                            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" className="w-full border rounded-lg px-4 py-2 pr-10" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-12.5 transform -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <label className="text-left text-sm flex items-center gap-2">
                            <input type="checkbox" className="cursor-pointer"/> Yes, inform me on deals & new features.
                        </label>
                        <button type="submit" className="bg-black text-white rounded-full py-3 cursor-pointer hover:bg-neutral-800">Join</button>
                    </form>
                    <div className="my-6 flex items-center text-gray-400 text-sm">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-2">Already a member?</span>
                    <hr className="flex-grow border-gray-300" />
                    </div>
                    <p className="text-sm text-center">
                    <span className="font-semibold underline cursor-pointer hover:text-indigo-600" onClick={() => setMode('login')}>Log in</span> using your TravelBuddy account.
                    </p>
                </>
            )}
            </div>
            <p className="text-xs text-gray-500 mt-10 leading-relaxed">By proceeding, you agree to our <a className="underline" href="#">Terms of Use</a> and confirm you have read our <a className="underline" href="#">Privacy and Cookie Statement</a>.
            <br />
            This site is protected by reCAPTCHA and the Google <a className="underline" href="#">Privacy Policy</a> and <a className="underline" href="#">Terms of Service</a> apply.
            </p>
        </div>
    </div>
  );
};

export default AuthModal