import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Sparkles, Mail, Lock, User, Database, ArrowRight, Eye, EyeOff } from 'lucide-react';

// SVG Logos for social providers
const GoogleLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.002 1.413-.103.249-.129.597-.129.946v5.446h-3.554s.05-8.836 0-9.754h3.554v1.391c.43-.666 1.204-1.616 2.923-1.616 2.136 0 3.738 1.397 3.738 4.4v5.579zM5.337 9.341c-1.14 0-1.881-.755-1.881-1.697 0-.943.74-1.697 1.92-1.697 1.181 0 1.882.754 1.901 1.697 0 .942-.72 1.697-1.94 1.697zm1.946 11.111H3.392V9.698h3.891v10.754zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
  </svg>
);


/*
  LoginPage (updated)
  - Fixed React usage and form state (consistent useState)
  - Removed external sonner toast dependency to keep this file self-contained and runnable
  - Kept social login stubs and localStorage storage logic
  - Improved layout, accessibility, and visuals
*/

export function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', fundName: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.email || !formData.password) {
      // In production you might show a toast; here we simply return
      return;
    }

    // Simulate authentication
    const userData = {
      name: formData.name || 'User',
      email: formData.email,
      fundName: formData.fundName || 'My Fund',
    };

    // Store user data
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');

    if (onLogin) onLogin(userData);
  };

  const handleSocialLogin = (provider) => {
    // Simulate a social login
    const userData = {
      name: 'Demo User',
      email: 'demo@example.com',
      fundName: 'Demo Ventures',
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    if (onLogin) onLogin(userData);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                flowFound
              </h1>
              <p className="text-sm text-slate-600">AI Deal Flow Intelligence</p>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-2xl"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 text-center mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-slate-500 text-center">
              {isSignUp 
                ? 'Start discovering the best deal flow for your fund' 
                : 'Sign in to access your deal flow dashboard'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      required={isSignUp}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Fund Name</Label>
                  <div className="relative">
                    <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Acme Ventures"
                      value={formData.fundName}
                      onChange={(e) => setFormData({ ...formData, fundName: e.target.value })}
                      className="pl-10 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      required={isSignUp}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-end">
                <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-600 font-semibold">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            <motion.button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="p-3 border border-slate-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-center text-slate-600 hover:text-slate-900"
              title="Continue with Google"
            >
              <GoogleLogo />
            </motion.button>
            
            <motion.button
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="p-3 border border-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center text-slate-600 hover:text-slate-900"
              title="Continue with GitHub"
            >
              <GitHubLogo />
            </motion.button>
            
            <motion.button
              type="button"
              onClick={() => handleSocialLogin('LinkedIn')}
              whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="p-3 border border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center text-slate-600 hover:text-slate-900"
              title="Continue with LinkedIn"
            >
              <LinkedInLogo />
            </motion.button>
          </div>

          {/* Sign up / Sign in toggle */}
          <div className="mt-6 text-center text-sm text-slate-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { 
                setIsSignUp(!isSignUp); 
                setFormData({ name: '', email: '', password: '', fundName: '' }); 
              }}
              className="text-indigo-600 hover:text-indigo-700 hover:underline font-semibold"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
