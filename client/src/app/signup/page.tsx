"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, CheckCircle, User } from "lucide-react";

type SignupStep = 'email' | 'verification' | 'password' | 'success';

export default function Signup() {
  const [currentStep, setCurrentStep] = useState<SignupStep>('email');
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/send-verification", {
        email,
      });
      console.log("Verification code sent:", response.data);
      setSuccess("Verification code sent to your email!");
      setCurrentStep('verification');
    } catch (err: any) {
      console.error("Send verification error:", err);
      if (err.response && err.response.data) {
        setError(
          `Failed to send verification code: ${err.response.data.message || err.message || `Status ${err.response.status}`}`
        );
      } else {
        setError("Failed to send verification code: Network or unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-code", {
        email,
        code: verificationCode,
      });
      console.log("Verification successful:", response.data);
      setSuccess("Email verified successfully!");
      setCurrentStep('password');
    } catch (err: any) {
      console.error("Verification error:", err);
      if (err.response && err.response.data) {
        setError(
          `Verification failed: ${err.response.data.message || err.message || `Status ${err.response.status}`}`
        );
      } else {
        setError("Verification failed: Network or unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
        name,
        verificationCode,
      });
      console.log("Signup success:", response.data);
      setCurrentStep('success');
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.response && err.response.data) {
        setError(
          `Signup failed: ${err.response.data.message || err.message || `Status ${err.response.status}`}`
        );
      } else {
        setError("Signup failed: Network or unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetToEmailStep = () => {
    setCurrentStep('email');
    setError("");
    setSuccess("");
  };

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Enter your email to get started</p>
      </div>
      
      <form onSubmit={handleSendVerificationCode} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Send Verification Code</span>
          )}
        </button>
      </form>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
        <p className="text-gray-600">We sent a verification code to <span className="font-medium">{email}</span></p>
      </div>
      
      <form onSubmit={handleVerifyCode} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Verification Code</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-lg font-mono tracking-widest"
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Verify Code</span>
          )}
        </button>
        
        <button
          type="button"
          onClick={resetToEmailStep}
          className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 transition-colors"
        >
          Use different email
        </button>
      </form>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Account</h1>
        <p className="text-gray-600">Set up your password and profile</p>
      </div>
      
      <form onSubmit={handleCompleteSignup} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Created!</h1>
        <p className="text-gray-600">Your account has been successfully created. Redirecting to login...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}
        
        {currentStep === 'email' && renderEmailStep()}
        {currentStep === 'verification' && renderVerificationStep()}
        {currentStep === 'password' && renderPasswordStep()}
        {currentStep === 'success' && renderSuccessStep()}
        
        {currentStep !== 'success' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
