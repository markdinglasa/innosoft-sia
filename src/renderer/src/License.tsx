
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import { DraggableTopBar, LicenseKeyEntry, LicenseKeyProvider } from './components';

const License = () => {
  return (
    <>
        <DraggableTopBar />
        <BrowserRouter>
            <LicenseKeyProvider>
                <Routes>
                    <Route path='/app' Component={App} />
                    <Route path='/license' Component={LicenseKeyEntry} />
                </Routes>
            </LicenseKeyProvider>
        </BrowserRouter>
    </>
  )
}

export default License
