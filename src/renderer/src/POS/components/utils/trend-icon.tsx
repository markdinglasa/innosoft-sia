import { memo } from "react";
import { Down, IconArrowDownward, IconArrowUpward, Up } from './styles';

interface TrendIconProps {
  trend: number;
  up: boolean;
}

function TrendIcon(props:TrendIconProps) {
  const {trend, up} = props
  if (up) {
    return (
      <Up>
        <IconArrowUpward sx={{fontSize:20}}/>
        {trend}%
      </Up>
    );
  } else {
    return (
      <Down>
        <IconArrowDownward sx={{fontSize:20}} />
        {trend}%
      </Down>
    );
  }
};

export default memo(TrendIcon)
