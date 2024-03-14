// DraggableTopBar.tsx
import { twMerge } from 'tailwind-merge';
import { CloseAppButton } from './Buttons';

export const DraggableTopBar = ({className}) => {
  return (
    <header className={twMerge('"absolute inset-0 h-8', className)} style={{ borderBottom:'1px solid rgba(240,240,240,0.5)'}}>
      <div className=" flex justify-between w-full">
        <div className="flex items-center justify-start text-white border-1 px-2 py-1">
          Innosoft
        </div>
        <div className="flex items-center justify-end">
          <CloseAppButton />
        </div>
      </div>
    </header>
  );
};


