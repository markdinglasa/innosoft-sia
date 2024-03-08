import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import './assets/index.css';
import { DatabaseConfig, DraggableTopBar, LicenseKeyEntry, LicenseKeyProvider } from './components';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DraggableTopBar />
    <BrowserRouter>
      <LicenseKeyProvider>
        <Routes>
          <Route path='/app' Component={App} />
          <Route path='/config/database' Component={DatabaseConfig} />
          <Route path='/' Component={LicenseKeyEntry} />
        </Routes>
      </LicenseKeyProvider>
    </BrowserRouter>
  </React.StrictMode>
)
