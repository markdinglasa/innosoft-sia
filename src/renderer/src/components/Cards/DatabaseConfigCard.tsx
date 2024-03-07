import { Box, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { FaArrowRight, FaDatabase } from 'react-icons/fa6'
import { twMerge } from 'tailwind-merge'

export const DatabaseConfigCard = ({ className }) => {
  const [key, setKey] = useState('')
  const [encryptedKey, setEncryptedKey] = useState('')
  const [error, setError] = useState(false)
  const [storedKey, setStoredKey] = useState('')

  useEffect(() => {
    const fetchStoredKey = async () => {
      try {
        const response = await window.api.get('get-config')
        console.log('Response from main process:', response)
        setStoredKey(response) // Assuming response directly contains the encrypted key
      } catch (error) {
        console.error('Error fetching stored key:', error)
        setError(true)
      }
    }
    fetchStoredKey()
  }, [])

  const handleChange = (e) => {
    setKey(e.target.value)
  }

  const handleSubmit = async () => {
    try {
      const response = await window.api.post('set-config', key)
      console.log('Response from main process:', response)
      setEncryptedKey(response) // Assuming response directly contains the encrypted key
    } catch (error) {
      console.error('Error saving key:', error)
      setError(true)
    }
  }

  return (
    <>
      <div className="w-full md:w-auto">
        <span className="flex justify-start items-center text-primary">
          {' '}
          <FaDatabase className="ml-3" />{' '}
          <h1 className="ms-2 font-medium"> Database Configuration</h1>{' '}
        </span>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' }
          }}
          noValidate
          autoComplete="off"
          className={twMerge('border-red px-3 py-3', className)}
        >
          <div className="border-red">
            <TextField
              label="Username"
              defaultValue=""
              placeholder="Enter username..."
              name="username"
              size="small"
              onChange={handleChange}
            />
          </div>
          <div className="border-red">
            <TextField
              label="Password"
              defaultValue=""
              placeholder="Enter password..."
              name="password"
              size="small"
              onChange={handleChange}
            />
          </div>
          <div className="border-red">
            <TextField
              label="Server"
              defaultValue=""
              placeholder="Enter server..."
              name="server"
              size="small"
              onChange={handleChange}
            />
          </div>
          <div className="border-red">
            <TextField
              label="Database Name"
              defaultValue=""
              placeholder="Enter database name..."
              name="dbname"
              size="small"
              onChange={handleChange}
            />
          </div>
          <div className="border-red">
            <TextField
              label="Port"
              defaultValue=""
              placeholder="Enter port..."
              name="port"
              size="small"
              onChange={handleChange}
            />
          </div>
          <div className="border-red justify-end flex items-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary rounded-md flex justify-center items-center px-3 py-2"
            >
              <FaArrowRight /> Next
            </button>
          </div>
          <div className="px-2 justify-center">
            {error && <div className="text-red">Something went wrong!</div>}
          </div>

          <div>
            <span className="text-red border">{encryptedKey ? 'true' : 'false'}</span>
            <span className="text-red border">{storedKey}</span>
          </div>
        </Box>
      </div>
    </>
  )
}
