// TestButton.tsx
import { useState } from "react";
export const TestButton = () => {
    const [something, setSomething] = useState('test')

    const handleTestBtnClick = async () => {
        try {
            const result = await window.api.get('do-something');
            setSomething(result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

  return (
    <>
      <button onClick={handleTestBtnClick} className="border-red flex justify-center items-center px-2 py-2"> TestBtn </button>
      <span className='text-red'>{something}</span>
    </>
  );
};
