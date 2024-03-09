import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/index.css';
import { DraggableTopBar, LicenseKeyEntry } from './components';

const Licensing = () => {
  return (
    <React.StrictMode>
      <DraggableTopBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <LicenseKeyEntry /> } />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('licensing') as HTMLElement).render(<Licensing />);
