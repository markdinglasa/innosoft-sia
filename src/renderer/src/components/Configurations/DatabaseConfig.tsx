import { TextField } from '@mui/material'
import { useRef, useState } from 'react'
import { FaArrowRight, FaCircleXmark, FaDatabase } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { DBTest } from './DBTest'
import { useDatabaseConfig } from './DatabaseConfigProvider'

export const DatabaseConfig = () => {
  const navigate = useNavigate()

  const [config, setConfig] = useState({
    username: '',
    password: '',
    server: '',
    database: '',
    port: ''
  })

  const [errorMessage, setErrorMessage] = useState('')

  const errorMessageLabel = useRef<HTMLLabelElement>(null)
  const dbConfig = useDatabaseConfig()
  const handleCancel = async () => {
    window.action.send('close-app')
  }
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setConfig((prevState) => ({
      ...prevState,
      [name]: value
    }))
    setErrorMessage('')
  }

  const handleDatabaseConfig = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()

    if (!config) {
      setErrorMessage('Config cannot be empty.')
      return
    }

    try {
      const response = await dbConfig.handleDatabaseConfig(config)
      if (!response.error) {
        setErrorMessage(response.errorMessage)
        return
      }
      setTimeout(() => {
        navigate('/license')
      }, 3000)
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xl p-6 bg-white rounded-md shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-600 mb-2">
          <span className="flex items-center justify-center">
            {' '}
            <FaDatabase className="mr-3" />
            Database Configuration{' '}
          </span>
        </h1>
        <div className='border-red'> <DBTest/></div>
        <div className="border-gray-100 px-2 py-2"></div>
        <form className="space-y-4">
          <div className="w-full md:w-auto">
            <span className="flex justify-start items-center text-primary">
              {' '}
              <h1 className="ms-2 font-medium"> </h1>{' '}
            </span>
            <div className="px-2 py-2 border-red">
              <TextField
                label="Username"
                defaultValue=""
                placeholder="Enter Username..."
                name="username"
                size="small"
                type="text"
                onChange={handleChange}
                className="w-full input input-primary "
              />
            </div>
            <div className="px-2 py-2 border-red">
              <TextField
                label="Password"
                defaultValue=""
                placeholder="Enter password..."
                name="password"
                size="small"
                type="password"
                onChange={handleChange}
                className="w-full input input-primary "
              />
            </div>
            <div className="px-2 py-2 border-red">
              <TextField
                label="Server"
                defaultValue=""
                placeholder="Enter server..."
                name="server"
                size="small"
                type="text"
                onChange={handleChange}
                className="w-full input input-primary "
              />
            </div>
            <div className="px-2 py-2 border-red">
              <TextField
                label="Database"
                defaultValue=""
                placeholder="Enter database..."
                name="database"
                size="small"
                type="text"
                onChange={handleChange}
                className="w-full input input-primary "
              />
            </div>
            <div className="px-2 py-2 border-red">
              <TextField
                label="Port"
                defaultValue=""
                placeholder="Enter port..."
                name="[port]"
                size="small"
                type="number"
                onChange={handleChange}
                className="w-full input input-primary "
              />
            </div>
            <div className="border-red py-2 px-2 justify-end flex items-center">
              <button className="shadow-md btn rounded-md mr-3 btn-default" onClick={handleCancel}>
                <span className="flex items-center justify-center">
                  <FaCircleXmark className="mr-2" />
                  Cancel
                </span>
              </button>
              <button
                type="button"
                onClick={handleDatabaseConfig}
                className="btn-primary rounded-md flex justify-center items-center px-3 py-2"
              >
                <FaArrowRight /> Next
              </button>
            </div>
            <div className="px-2 justify-center">
              <div className="text-red"> {errorMessage} </div>
            </div>
          </div>
        </form>
      </div>
      
    </div>
    
  )
}
