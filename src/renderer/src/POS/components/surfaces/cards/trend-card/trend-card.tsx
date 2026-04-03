
import { CardContent } from "@mui/material";
import { ReactNode } from 'react';
import TrendIcon from "../../../../components/utils/trend-icon";
import { Card, Content, Label, LeftPanel, RightPanel, Value } from './Styles';

interface TrendCardProps {
  className?:string
  value: string;
  trend: number; // percentage
  isUp: boolean;
  icon: ReactNode;
  isCurrency: boolean;
  label: string;
}

function TrendCard(props:TrendCardProps) {
  const { className, value = '0', trend = 0, isCurrency = false,
    isUp = true,
    icon,
    label = 'NA',
  } = props
    return (
      <Card className={className}>
        <CardContent>
          <Content>
            <LeftPanel>
              <Label>{label}</Label>
              <Value>
                {isCurrency && <>&#8369;</>}
                {parseFloat(value)}
              </Value>
              <TrendIcon trend={trend} up={isUp}/>
            </LeftPanel>
            <RightPanel>{icon}</RightPanel>
          </Content>
        </CardContent>
      </Card>
    );
  }

export default TrendCard;
