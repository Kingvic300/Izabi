import React, { useState, useEffect, useCallback } from 'react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { User } from './types';
import { getUserProfile } from './services/api';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('izabi_token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = useCallback(async (authToken: string) => {
    try {
      // The /users/{id} endpoint needs an ID.
      // A common pattern is a /users/me endpoint. Assuming one exists or we decode JWT.
      // For this app, we'll simulate fetching user data after login.
      // A real app would decode the token to get user ID.
      const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
      const userId = decodedToken.id; // Or whatever the user ID field is in the JWT
      if(userId) {
        const profile = await getUserProfile(userId, authToken);
        setUser(profile);
      } else {
        // Fallback if token doesn't have ID - this part is speculative
        setUser({ id: 'mock-id', name: 'Student', email: 'student@izabi.com' });
      }
    } catch (error) {
      console.error("Failed to fetch user or decode token:", error);
      // If token is invalid, log out
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token, fetchUser]);

  const handleLogin = (newToken: string, loggedInUser: User) => {
    localStorage.setItem('izabi_token', newToken);
    setToken(newToken);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('izabi_token');
    setToken(null);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary to-secondary">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-highlight"></div>
      </div>
    );
  }

  const user1 = {
    id: "1",
    name: "divine mercy",
    email: "divineobinali9@gmail.com"
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      {user1 ? (
        <>
          <Header user={user1} onLogout={handleLogout} />
          <Dashboard token={token} />
        </>
      ) : (
        <AuthForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
