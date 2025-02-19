'use client';

import React, { ReactNode, createContext, useState } from 'react';
import CustomAlertDialog from '../components/alert.dialog.js';

type AlertType = 'Success' | 'Error' | 'Warning' | 'Info';

type Alert = {
  type?: AlertType;
  title?: string;
  message: string;
};

type AlertContext = {
  showAlert: (data: Alert) => void;
};

type AlertContextProvider = {
  children: ReactNode;
};

// Create a new context for the Alert
export const AlertContext = createContext<AlertContext>({
  showAlert: () => {},
});

export const AlertProvider: React.FC<AlertContextProvider> = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState<Alert[]>([]);

  // Function to hide an alert based on its index
  const hideAlert = (index: number) => {
    setAlertMessage((prev) => prev.filter((_, i) => i !== index));
  };

  // Context value containing the showAlert function
  const contextValue: AlertContext = {
    showAlert: (alertData: Alert) => {
      alertData.type = alertData.type || 'Info'; // Default to 'Info' if no type is provided
      setAlertMessage((prev) => [...prev, alertData]);
    },
  };

  return (
    <AlertContext.Provider value={contextValue}>
      <>
        {alertMessage.map((alert, index) => (
          <CustomAlertDialog
            key={index}
            variant={alert.type} // Pass the alert type as the variant
            isOpen={true}
            onClose={() => hideAlert(index)}
            title={alert.title || ''}
            description={alert.message}
          />
        ))}
      </>
      {children}
    </AlertContext.Provider>
  );
};
