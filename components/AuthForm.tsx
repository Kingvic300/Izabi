import React, { useState } from 'react';
import { loginUser, registerUser, sendVerificationOtp } from '../services/api';
import { User } from '../types';
import Spinner from './Spinner';
import VoiceRecorder from './VoiceRecorder';

interface AuthFormProps {
  onLogin: (token: string, user: User) => void;
}

enum AuthState {
  LOGIN,
  REGISTER,
  VERIFY_OTP,
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOGIN);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVoiceLogin, setShowVoiceLogin] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { token, user } = await loginUser({ email: formData.email, password: formData.password, role: 'STUDENT' });
      onLogin(token, user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      await sendVerificationOtp({ email: formData.email, password: formData.password, role: 'STUDENT' });
      setAuthState(AuthState.VERIFY_OTP);
      setSuccessMessage(`An OTP has been sent to ${formData.email}. Please check your inbox.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await registerUser({ name: formData.name, email: formData.email, otp: formData.otp, role: 'STUDENT' });
      setAuthState(AuthState.LOGIN);
      setFormData({ name: '', email: '', password: '', otp: '' });
      setSuccessMessage('Registration successful! Please log in to continue.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    const inputClasses = "w-full px-4 py-3 bg-white/10 rounded-lg placeholder-light/70 focus:outline-none focus:ring-2 focus:ring-highlight transition duration-300";
    const buttonClasses = "w-full py-3 font-semibold text-white bg-gradient-to-r from-highlight to-accent rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-12";
    
    switch (authState) {
      case AuthState.LOGIN:
        return (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <h2 className="text-4xl font-bold text-center text-white drop-shadow-lg">Welcome Back!</h2>
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} className={inputClasses} value={formData.email} />
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} className={inputClasses}/>
            <button type="submit" disabled={isLoading} className={buttonClasses}>
              {isLoading ? <Spinner size="sm" /> : 'Login'}
            </button>
            <button type="button" onClick={() => setShowVoiceLogin(true)} className="w-full mt-2 py-3 font-semibold text-white bg-white/10 rounded-lg hover:bg-white/20 transition duration-300 flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 10.724a.75.75 0 01-1.5 0V14a5 5 0 00-10 0v.724a.75.75 0 01-1.5 0V14a6.5 6.5 0 1113 0v.724z" clipRule="evenodd" /></svg>
                <span>Login with Voice</span>
            </button>
          </form>
        );
      case AuthState.REGISTER:
        return (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <h2 className="text-4xl font-bold text-center text-white drop-shadow-lg">Create Your Account</h2>
            <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className={inputClasses}/>
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} className={inputClasses} value={formData.email}/>
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} className={inputClasses}/>
            <button type="submit" disabled={isLoading} className={buttonClasses}>
              {isLoading ? <Spinner size="sm" /> : 'Register'}
            </button>
          </form>
        );
      case AuthState.VERIFY_OTP:
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">Verify Your Account</h2>
            <input type="text" name="otp" placeholder="Enter OTP" required onChange={handleChange} className={inputClasses} maxLength={6}/>
            <button type="submit" disabled={isLoading} className={buttonClasses}>
              {isLoading ? <Spinner size="sm" /> : 'Complete Registration'}
            </button>
          </form>
        );
    }
  };

  const toggleForm = () => {
    setError(null);
    setSuccessMessage(null);
    setAuthState(authState === AuthState.LOGIN ? AuthState.REGISTER : AuthState.LOGIN);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-secondary/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
        <div className="text-center">
            <div className="inline-block p-3 bg-gradient-to-r from-highlight to-accent rounded-full mb-4">
                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494M5.335 12.001L12 3l6.665 9.001-3.332 4.502-3.333-4.502-3.333 4.502L5.335 12.001z"></path></svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Izabi</h1>
        </div>
        
        {error && <div className="p-3 text-white bg-danger/50 border border-danger rounded-lg text-center">{error}</div>}
        {successMessage && <div className="p-3 text-white bg-success/50 border border-success rounded-lg text-center">{successMessage}</div>}

        {renderForm()}
        
        <p className="text-center text-light/80">
          {authState === AuthState.LOGIN ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleForm} className="font-semibold text-cyan hover:underline ml-2">
            {authState === AuthState.LOGIN ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
       {showVoiceLogin && (
          <VoiceRecorder
              email={formData.email}
              onClose={() => setShowVoiceLogin(false)}
              onLogin={onLogin}
          />
      )}
    </div>
  );
};

export default AuthForm;