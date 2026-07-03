import { FormControlLabel, Switch } from '@mui/material'
import { colors } from '@shared/styles'
import { SFC } from '@shared/types'

export interface SwitchButtonProps {
  OnChange?: any
  Values?: any
  Name: string
  Label: string
  Disabled?: boolean
  Touched?: { [field: string]: boolean }
  Errors?: { [field: string]: string }
}

export const SwitchButton: SFC<SwitchButtonProps> = ({
  className,
  OnChange,
  Values,
  Name,
  Label = 'NA',
  Disabled = false,
  Errors,
  Touched
}) => {
  return (
    <div className={className}>
      <FormControlLabel
        control={
          <Switch
            disabled={Disabled}
            name={Name}
            onChange={OnChange}
            checked={Values}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: colors.secondary
              }
            }}
          />
        }
        label={Label}
        sx={{
          '& .MuiFormControlLabel-label': {
            fontSize: '1.2rem',
            color: colors.white,
            alignItems: 'center',
            display: 'flex'
          }
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {' '}
        {Errors && Touched && Touched[Name] && Touched[Name] ? (
          <span style={{ color: colors.palette.red['300'] }}>{Errors[Name]}</span>
        ) : null}
      </div>
    </div>
  )
}
