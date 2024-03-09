import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/index.css';
import { DatabaseConfig, DraggableTopBar } from './components';

const Connection = () => {
  return (
    <React.StrictMode>
      <DraggableTopBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <DatabaseConfig /> } />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('connection') as HTMLElement).render(<Connection />);
