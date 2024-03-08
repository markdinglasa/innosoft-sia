import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import License from './License';
import './assets/index.css';
import { DatabaseConfig, DatabaseConfigProvider, DraggableTopBar } from './components';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DraggableTopBar />
    <BrowserRouter>
      <DatabaseConfigProvider>
        <Routes>
          <Route path='/' Component={DatabaseConfig} />
          <Route path='/license' Component={License} />
        </Routes>
      </DatabaseConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
)
