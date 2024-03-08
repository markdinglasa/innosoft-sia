import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import './assets/index.css'
import {
  DatabaseConfig,
  DatabaseConfigProvider,
  DraggableTopBar,
  LicenseKeyEntry,
  LicenseKeyProvider
} from './components'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DraggableTopBar />
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path="/" element={<DatabaseConfig />} />
          <Route path="/app" element={<App />} />
          <Route path="/license" element={<LicenseKeyEntry />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
)

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DatabaseConfigProvider>
      <LicenseKeyProvider>{children}</LicenseKeyProvider>
    </DatabaseConfigProvider>
  )
}
