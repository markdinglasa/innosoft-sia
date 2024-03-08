import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaCircleXmark, FaDatabase } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

export const DatabaseConfig = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    username: '',
    password: '',
    server: '',
    database: '',
    port: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStoredKey = async () => {
      try {
        const response = await window.api.get('get-connected');
        if (!response) {
          setError('Database connection is not connected');
        } else {
          navigate('/app'); // Move navigate inside if block
        }
      } catch (error) {
        console.error('Error fetching stored key:', error);
        setError('Error connecting to the database. Please try again.'); // Provide a user-friendly error message
      }
    };
    fetchStoredKey();
  }, [navigate]); // Add navigate as a dependency

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCancel = async () => {
    window.action.send('close-app');
  };

  const handleSubmit = async () => {
    if (!config.username || !config.password || !config.server || !config.database || !config.port) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await window.api.post('set-database-config', config);
      console.log('Response from main process:', response);
      setConfig(response); // Assuming response directly contains the encrypted key
    } catch (error) {
      console.error('Error saving key:', error);
      setError('Error saving database configuration. Please try again.'); // Provide a user-friendly error message
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xl p-6 bg-white rounded-md shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-600 mb-2"> 
          <span className='flex items-center justify-center'> <FaDatabase className="mr-3" />Database Configuration </span>
        </h1>
        <div className='border-gray-100 px-2 py-2'>
       
        </div>
        <form className="space-y-4">
        <div className="w-full md:w-auto">
        <span className="flex justify-start items-center text-primary">
          {' '}
         {' '}
          <h1 className="ms-2 font-medium"> </h1>{' '}
        </span>
          <div className='px-2 py-2 border-red'>
            <TextField
              label="Username"
              defaultValue=""
              placeholder="Enter Username..."
              name="username"
              size="small"
              type="text" 
              onChange={handleChange}
              className='w-full input input-primary '
            />
          </div>
          <div className='px-2 py-2 border-red'>
            <TextField
              label="Password"
              defaultValue=""
              placeholder="Enter password..."
              name="password"
              size="small"
              type="password" 
              onChange={handleChange}
              className='w-full input input-primary '
            />
          </div>
          <div className='px-2 py-2 border-red'>
            <TextField
              label="Server"
              defaultValue=""
              placeholder="Enter server..."
              name="server"
              size="small"
              type="text" 
              onChange={handleChange}
              className='w-full input input-primary '
            />
          </div>
          <div className='px-2 py-2 border-red'>
            <TextField
              label="Database"
              defaultValue=""
              placeholder="Enter database..."
              name="database"
              size="small"
              type="text" 
              onChange={handleChange}
              className='w-full input input-primary '
            />
          </div>
          <div className='px-2 py-2 border-red'>
            <TextField
              label="Port"
              defaultValue=""
              placeholder="Enter port..."
              name="[port]"
              size="small"
              type="number" 
              onChange={handleChange}
              className='w-full input input-primary '
            />
          </div>
          <div className="border-red py-2 px-2 justify-end flex items-center">
            <button className="shadow-md btn rounded-md mr-3 btn-default" onClick={handleCancel}> 
              <span className='flex items-center justify-center'><FaCircleXmark className='mr-2'/>Cancel</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary rounded-md flex justify-center items-center px-3 py-2"
            >
              <FaArrowRight /> Next
            </button>
          </div>
          <div className="px-2 justify-center">
            <div className="text-red"> { error } </div>
          </div>

          <div>
            <span className="text-red border">{config.username}</span>
          </div>
      </div>
         
        </form>
      
      </div>
    </div>
  );
}
