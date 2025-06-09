import React, { useState } from 'react';
import LoginScreen from '@/components/auth/LoginScreen';
import ForgotPasswordScreen from '@/components/auth/ForgotPasswordScreen';
import SuccessScreen from '@/components/auth/SuccessScreen';
import RegisterTypeScreen from '@/components/auth/RegisterTypeScreen';
import RegisterCompanyScreen from '@/components/auth/RegisterCompanyScreen';
import RegisterPersonScreen from '@/components/auth/RegisterPersonScreen';

export type AuthScreen =
  | 'login'
  | 'register-type'
  | 'register-company'
  | 'register-person'
  | 'forgot-password'
  | 'success';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [userEmail, setUserEmail] = useState('');

  const handleScreenChange = (screen: AuthScreen, email?: string) => {
    setCurrentScreen(screen);
    if (email) setUserEmail(email);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onScreenChange={handleScreenChange} />;
      case 'register-type':
        return <RegisterTypeScreen onScreenChange={handleScreenChange} />;
      case 'register-company':
        return <RegisterCompanyScreen onScreenChange={handleScreenChange} />;
      case 'register-person':
        return <RegisterPersonScreen onScreenChange={handleScreenChange} />;
      case 'forgot-password':
        return <ForgotPasswordScreen onScreenChange={handleScreenChange} />;
      case 'success':
        return (
          <SuccessScreen
            onScreenChange={handleScreenChange}
            email={userEmail}
          />
        );
      default:
        return <LoginScreen onScreenChange={handleScreenChange} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full container">{renderScreen()}</div>
    </div>
  );
};

export default Index;
