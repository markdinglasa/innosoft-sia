// CloseButton.tsx

import { MdClose } from "react-icons/md";
export const CloseAppButton = () => {

  const handleCloseClick = () => {
    window.action.send('close-app');
  };

  return (
    <>
      <button onClick={handleCloseClick} className="text-white close-app flex justify-center items-center" style={{width:'40px', height:'29px'}}> <MdClose /> </button>
    </>
  );
};

