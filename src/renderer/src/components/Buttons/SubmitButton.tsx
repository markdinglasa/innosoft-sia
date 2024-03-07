import { FaFloppyDisk } from "react-icons/fa6";

export const SubmitButton = ({Action, Data}) => {
    
    const handleSubmit= () => {
        window.api.post(Action, Data);
    };

  return (
    <>
      <button onClick={handleSubmit} className="bg-zinc-400 rounded-md flex justify-center items-center px-3 py-2"> <FaFloppyDisk /> Save </button>
    </>
  )
}
