import { Content, DraggableTopBar, RootLayout } from '@/components'; // Check this import path

const App = () => {
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Content
          className="bg-zinc-900/50 flex justify-center items-center"
          style={{ background: 'var(--your-variable-here)' }}
        >
          <div
            className="shadow-2xl rounded-full flex justify-center items-center"
            style={{ borderRadius: '20px', background: '#FFF', width: '500px', height: '500px' }}
          >
            <div className=" border-red px-2 py-2">
              <h1 className='text-red border-red'> hellow</h1>
            </div>
          </div>
        </Content>
      </RootLayout>
    </>
  )
}

export default App
