import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    const success = await login(email, password);
    if (success) {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo and Title */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🎨</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Sahab Studio</h1>
          <p className="text-purple-200">AI-Powered Design Platform</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-white mb-3">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-white mb-3">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div className="flex items-center justify-between" variants={itemVariants}>
              <label className="flex items-center text-sm text-gray-300 cursor-pointer hover:text-white transition">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20 text-purple-500 focus:ring-purple-500" />
                <span className="ml-2">Remember me</span>
              </label>
              <button type="button" className="text-sm text-purple-400 hover:text-purple-300 transition bg-transparent border-none cursor-pointer p-0">
                Forgot password?
              </button>
            </motion.div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2 group"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="group-hover:translate-x-1 transition" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div className="relative my-8" variants={itemVariants}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/10 text-gray-400">Or continue with</span>
            </div>
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
            <button className="bg-white/5 hover:bg-white/10 border border-white/20 text-white py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2">
              <span>🔵</span> Google
            </button>
            <button className="bg-white/5 hover:bg-white/10 border border-white/20 text-white py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2">
              <span>🐙</span> GitHub
            </button>
          </motion.div>
        </motion.div>

        {/* Sign Up Link */}
        <motion.p className="text-center mt-8 text-gray-300" variants={itemVariants}>
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 font-semibold hover:text-purple-300 transition">
            Create one now
          </Link>
        </motion.p>

        {/* Footer */}
        <motion.div className="text-center mt-8 text-xs text-gray-500" variants={itemVariants}>
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </motion.div>
      </motion.div>

      {/* Add animation styles */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;
