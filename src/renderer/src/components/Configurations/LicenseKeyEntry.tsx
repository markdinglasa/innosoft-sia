import { TextField } from '@mui/material'
import { useRef, useState } from 'react'
import { FaCircleXmark, FaKey } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { useLicenseKey } from './LicenseKeyProvider'
import { Test } from './Test'
import { UnitKey } from './UnitKey'

export const LicenseKeyEntry = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [key, setKey] = useState('')
  const errorMessageLabel = useRef<HTMLLabelElement>(null)
  const licenseKeyRef = useRef<HTMLInputElement>(null)

  const licenseKey = useLicenseKey()
  const navigate = useNavigate()
  const handleCancel = async () => {
    window.action.send('close-app')
  }
  const handleChange = (e) => {
    setKey(e.target.value)
    setErrorMessage('')
  }

  const handleActivateLicenseKey = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()

    if (key === '') {
      setErrorMessage('License key cannot be empty.')
      return
    }

    try {
      const response = await licenseKey.handleActivateLicenseKey(key)
      if (!response.error) {
        setErrorMessage(response.errorMessage)
        return
      }
      setTimeout(() => {
        navigate('/app')
      }, 5000)
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  }



  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xl p-6 bg-white rounded-md shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-600 mb-2">iPOS Licensing</h1>
        <div className="border-gray-100 px-2 py-2">
          <UnitKey />
        </div>
        <form className="space-y-4">
          <div className="px-2 py-2 ">
            <label className="label  ">
              <span className="text-base label-text">Please enter your license key</span>
            </label>
            <div className=" py-2">
              <TextField
                label="License Key"
                defaultValue=""
                placeholder="Enter license key..."
                name="username"
                size="small"
                type="text"
                onChange={handleChange}
                className="w-full input input-primary "
              />
            </div>
          </div>
          <div className="flex justify-end px-2">
            <button className="shadow-md btn rounded-md mr-3 btn-default" onClick={handleCancel}>
              <span className="flex items-center justify-center">
                <FaCircleXmark className="mr-2" />
                Cancel
              </span>
            </button>
            <button
              className="shadow-md btn btn-primary rounded-md"
              onClick={handleActivateLicenseKey}
            >
              <span className="flex items-center justify-center">
                <FaKey className="mr-2" />
                Activate
              </span>
            </button>
          </div>
        </form>
        {errorMessage !== '' && (
          <>
            <span ref={errorMessageLabel} className="text-xs label-text text-error display-none">
              {errorMessage}
            </span>
            <br />
          </>
        )}
      <Test/>   
      </div>
    </div>
  )
}
