"use client";
import { useState } from 'react';
import { login } from '../../../lib/api';
import { setToken } from '../../../lib/auth';
import { useRouter } from 'next/navigation';
import { FaRegUser, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { IoTicketOutline } from "react-icons/io5";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(username, password);
      setToken(res.token);
      if (res.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/booking');
      }
    } catch (err: any) {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-[#F8FAFF] bg-white overflow-hidden">
     
      
    <div className="bg-white h-screen sm:h-auto flex justify-center items-center shadow-none rounded-2xl px-6 py-8 w-full sm:max-w-xs max-w-full  flex flex-col items-center relative">
         {/* Decorative bubble circles */}
     <div className="absolute block sm:hidden top-12 -left-28 w-48 h-48 bg-blue-100 rounded-full opacity-20 z-10" />
     <div className="absolute block sm:hidden top-32 -right-28 w-48 h-48 bg-blue-100 rounded-full opacity-20 z-10 flex items-center justify-start">
        <span className="text-[#bfdbfe] text-2xl ms-4 mb-22 rotate-[-13deg]"><IoTicketOutline className="text-[#A6CDFF] text-3xl" /></span>
     </div>
      <div className="absolute block sm:hidden bottom-10 -left-10 w-22 h-22 bg-blue-100 rounded-full opacity-15 z-10" />
      <div className="absolute top-1/3 -right-10 w-12 h-12 bg-blue-100 rounded-full opacity-10 z-10" />
      
    

        {/* <div className="bg-blue-600 rounded-xl p-3 mb-5 flex items-center justify-center">
          <FaCalendarAlt className="text-white text-2xl" />
        </div> */}
        <h1 className="text-2xl font-medium tracking-widest text-center mb-1 text-black font-arvo">T M MAHAL</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">Please sign in to continue</p>
        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div>
            <label className="block text-gray-700 mb-2 text-sm " htmlFor="username">Username</label>
            <div className="flex items-center border rounded-lg px-3 py-4 border-[#E5E7EB]">
              <FaRegUser  className="text-gray-400 mr-2" />
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="bg-transparent outline-none focus:bg-transparent flex-1 text-gray-700 text-sm"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
        <div>
            <label className="block text-gray-700 mb-2 text-sm" htmlFor="password">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-4 border-[#E5E7EB]">
              <FiLock  className="text-gray-400 mr-2" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="bg-transparent focus:bg-transparent outline-none flex-1 text-gray-700 text-sm"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="ml-2 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <FaRegEyeSlash className="text-gray-400" />
                ) : (
                  <FaRegEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="mt-3 bg-[#204DC5] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-base w-full"
            disabled={loading}
          >
            {loading ? 'Redirecting...' : 'Sign In'}
          </button>
        </form>
       
      </div>
    </div>
  );
} 