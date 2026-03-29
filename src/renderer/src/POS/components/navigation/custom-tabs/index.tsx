import { Tab, Tabs } from '@mui/material';
import { memo, SyntheticEvent } from 'react';
import * as S from './Styles';
import { colors } from '@shared/styles';
import { SFC } from '@shared/types';

export function a11yProps(index: number): {
  id: string;
  "aria-controls": string;
} {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export interface CustomTabsProps {
  value: number;
  title: string;
  onChange: (event: SyntheticEvent, value: number) => void;
  tabs: string[];
}

function CustomTabs(props: CustomTabsProps){
  const  {
  title = 'NA',
  value,
  onChange,
  tabs = ['NA']
} = props
  return (
    <>
      <S.Container>
        <Tabs
          value={value}
          onChange={onChange}
          aria-label={title}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: colors.primary,
            },
          }}
        >
          {tabs.map((tab, index) => {
            return (
              <Tab
                key={index}
                label={tab}
                {...a11yProps(index)}
                sx={{
                  fontFamily: 'Montserrat',
                  textTransform: 'none',
                  color: 'gray',
                  '&.Mui-selected': {
                    color: colors.primary,
                  },
                }}
              />
            );
          })}
        </Tabs>
      </S.Container>
    </>
  );
};
export default memo(CustomTabs);
