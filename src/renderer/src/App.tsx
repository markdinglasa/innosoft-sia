import { Content, DraggableTopBar, RequireAuth, RootLayout, Unauthorized } from '@/components';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard, Layout, Login, Missing } from './pages';

const App = () => {
  const [display, setDisplay] = useState('')

  const ROLES = {
    'User': 2001,
    'Editor': 1984,
    'Admin': 5150

  }
  
  return (
    <>
    <DraggableTopBar className={'z-auto'} />
      <RootLayout>
        <Content  className="bg-zinc-900/50 flex justify-center items-center "  style={{background:'var()'}}> 
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* public routes */}
            <Route path="login" element={<Login />} />
            <Route path="unauthorized" element={<Unauthorized />} />

            {/* we want to protect these routes */}
            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path="/" element={<Dashboard />} />
            </Route>

            {/* catch all */}
            <Route path="*" element={<Missing />} />
          </Route>
        </Routes>
        </Content>
      </RootLayout>
    </>
  )
}

export default App
