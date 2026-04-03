import { Skeleton } from '@mui/material';
import { memo } from 'react';
import { cn } from "../../utils/cn";

interface LineChartSkeletonProps {
  className?: string;
}

function LineChartSkeleton(props: LineChartSkeletonProps) {
  const { className } = props;
  return (
    <>
      <div
        className={cn(
          'w-full rounded-lg bg-white p-[1rem] cursor-pointer hover:bg-slate-100 hover:shadow-md transition-all duration-300 ease-in-out',
          className
        )}
      >
        <Skeleton animation="wave" height={'2rem'} width="30%" />
        <Skeleton
          animation="wave"
          height={'15rem'}
          width="100%"
          style={{ marginTop: '-3rem' }}
        />
        <div>
          <Skeleton animation="wave" height={'1rem'} width="100%" />
        </div>
      </div>
    </>
  );
};
export default memo(LineChartSkeleton);
