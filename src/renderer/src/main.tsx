import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './assets/index.css';
import { DatabaseConfig, DraggableTopBar, LicenseKeyEntry } from './components';

const Root = () => {
  return (
    <React.StrictMode>
      <DraggableTopBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <App /> } />
          <Route path="/connection" element={ <DatabaseConfig /> } />
          <Route path="/license" element={ <LicenseKeyEntry /> } />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
