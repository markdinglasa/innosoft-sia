import { Content, DraggableTopBar, RootLayout } from '@/components';
import { useState } from 'react';
import { FaDatabase } from 'react-icons/fa6';
const App = () => {
  const [display, setDisplay] = useState('')
  
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Content className="bg-zinc-900/50 flex justify-center items-center" style={{ background: 'var(--your-variable-here)' }} >
          <div  className="shadow-2xl rounded-full flex justify-center items-center" style={{ borderRadius: '20px', background: '#FFF', width: '500px', height: '500px' }} >
            <div className='w-full px-5 border-red'>
            <div className=" border-red px-2 py-2">
                <label className="label  ">
                  <span className="text-base label-text">Please enter your license key</span>
                </label>
                <div className=" py-2 w-full">
                  <button className='btn btn-primary w-full rounded-md items-center'> 
                    <span className='flex items-center justify-center'><FaDatabase className="mr-3" /> Connection</span>
                  </button>
                </div>
              </div>
              <div className=" border-red px-2 py-2">
                <label className="label  ">
                  <span className="text-base label-text">Please enter your license key</span>
                </label>
                <div className=" py-2 w-full">
                  <button className='btn btn-primary w-full rounded-md items-center'> 
                    <span className='flex items-center justify-center'><FaDatabase className="mr-3" /> Connection</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </RootLayout>
    </>
  )
}

export default App
