import React, { createContext, useContext, useState } from 'react';
import AlertComponent from '@/components/Alert/AlertComponent';

interface AlertContextProps {
  showAlert: (variant: 'default' | 'destructive', title: string, description: string) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<{ variant: 'default' | 'destructive'; title: string; description: string } | null>(null);

  const showAlert = (variant: 'default' | 'destructive', title: string, description: string) => {
    setAlert({ variant, title, description });
    setTimeout(() => {
      setAlert(null);
    }, 5000); // Auto-hide after 5 seconds
  };

  const handleClose = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className="fixed top-20 right-6 z-50">
          <AlertComponent
            variant={alert.variant}
            title={alert.title}
            description={alert.description}
            onClose={handleClose}
          />
        </div>
      )}
    </AlertContext.Provider>
  );
};