import { Box, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { FaFloppyDisk } from 'react-icons/fa6'

export const EncryptCard = () => {
  const [key, setKey] = useState('')
  const [encryptedKey, setEncryptedKey] = useState('')
  const [error, setError] = useState(false)
  const [storedKey, setStoredKey] = useState('')

  useEffect(() => {
    const fetchStoredKey = async () => {
      try {
        const response = await window.api.get('get-key')
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
      const response = await window.api.post('set-key', key)
      console.log('Response from main process:', response)
      setEncryptedKey(response) // Assuming response directly contains the encrypted key
    } catch (error) {
      console.error('Error saving key:', error)
      setError(true)
    }
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          label="Key"
          id="outlined-size-small"
          defaultValue=""
          placeholder="Enter key..."
          name="key"
          size="small"
          onChange={handleChange}
        />
      </div>
      <div>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-zinc-400 rounded-md flex justify-center items-center px-3 py-2"
        >
          <FaFloppyDisk /> Save
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
  )
}
