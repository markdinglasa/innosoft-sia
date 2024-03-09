import { DatabaseConfig } from '@/components'; // Import the component you want to display
import { useState } from 'react';

export const Sidebar = () => {
  const [showOtherComponent, setShowOtherComponent] = useState(false);

  const toggleOtherComponent = () => {
    setShowOtherComponent(prevState => !prevState);
  };

  return (
    <>
      <div>
         <DatabaseConfig />
      </div>
    </>
  );
}