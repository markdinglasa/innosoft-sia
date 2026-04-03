import { Skeleton } from '@mui/material';
import { memo } from 'react';
import { cn } from '../../../utils/cn';

function TrendCardSkeleton({ className }: { className?: string }) {
  return (
    <>
      <div
        className={cn(
          'w-full rounded-lg bg-white p-[1rem] cursor-pointer hover:bg-slate-100 hover:shadow-md transition-all duration-300 ease-in-out',
          className
        )}
      >
        <div className="flex flex-row items-center justify-between gap-[1rem] mb-2">
          <div className="flex w-full flex-col">
            <Skeleton animation="wave" height={'1rem'} width="100%" />
            <Skeleton animation="wave" height={'2rem'} width="100%" />
          </div>
          <div>
            <Skeleton
              variant="circular"
              animation="wave"
              height={60}
              width={60}
            />
          </div>
        </div>
        <div>
          <Skeleton animation="wave" height={'1rem'} width="100%" />
        </div>
      </div>
    </>
  );
};
export default memo(TrendCardSkeleton);
