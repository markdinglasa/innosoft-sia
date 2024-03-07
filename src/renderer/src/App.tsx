import { AccountList, Content, DraggableTopBar, RootLayout } from '@/components'
const App = () => {
  return (
    <>
    <DraggableTopBar />
      <RootLayout>
        <Content  className="bg-zinc-900/50 flex justify-center items-center "  style={{background:'var()'}}> 
          <>
            <div className='shadow-2xl rounded-full flex justify-center items-center ' style={{borderRadius:'20px',background:'#FFF', width:'500px', height: '500px'}} >
                <div className=' '>
                  <div className="flex justify-center text-primary mt-3">
                    <span className="text-primary font-bold text-xl"> Cebu Innosoft Solutions Inc.</span>
                  </div>
                  <div className="flex justify-center ">
                    <span className="text-slate-500 "> Boilerplate © 2024 | v1.0.0</span>
                  </div>
                  <div>
                    <AccountList/>
                  </div>
                 
                </div>
                
            </div>
          </>
        </Content>
      </RootLayout>
    </>
  )
}

export default App
