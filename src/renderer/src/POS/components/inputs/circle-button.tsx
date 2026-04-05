import { Badge, IconButton, Tooltip } from '@mui/material'
import { colors } from '@shared/styles'
import { ButtonColor, ButtonType } from '@shared/types'
import { memo, ReactNode } from 'react'

export enum TooltipPlacement {
  topStart = 'top-start',
  top = 'top',
  topEnd = 'top-end',
  left = 'left',
  leftStart = 'left-start',
  leftEnd = 'left-end',
  right = 'right',
  rightStart = 'right-start',
  rightEnd = 'right-end',
  bottom = 'bottom',
  bottomStart = 'bottom-start',
  bottomEnd = 'bottom-end'
}
export interface CircleButtonProps {
  onClick: (e?: unknown) => void
  isNotification?: boolean
  icon: ReactNode
  type: ButtonType
  color?: ButtonColor
  title?: string
  disabled?: boolean
  placement?: TooltipPlacement
  badgeContent?: number
}

const MAX_NOTIFICATION = 999
function CircleButton(props: CircleButtonProps) {
  const {
    isNotification = false,
    onClick,
    icon,
    type,
    color,
    title = '',
    badgeContent,
    disabled = false,
    placement = TooltipPlacement.bottom
  } = props

  const renderColor = () => {
    switch (color) {
      case ButtonColor.default:
        return { bg: '', hover: '' }
      case ButtonColor.white:
        return { bg: colors.white, hover: colors.palette.neutral['100'] }
      case ButtonColor.dark:
        return { bg: '', hover: colors.palette.black['100'] }
      case ButtonColor.blue:
        return { bg: colors.primary, hover: colors.palette.neutral['600'] }
      default:
        return {
          bg: colors.palette.neutral['200'],
          hover: colors.palette.neutral['300']
        }
    }
  }

  return (
    <Tooltip title={disabled ? '' : title} placement={placement}>
      <IconButton
        onClick={onClick}
        sx={{
          backgroundColor: renderColor().bg,
          '&:hover': { backgroundColor: renderColor().hover },
          transition: 'all 0.3s ease-in-out',
          opacity: disabled ? 0.6 : 1,
          border: disabled ? 1 : 'none',
          height: '2.5rem',
          width: '2.5rem'
        }}
        type={type}
        disabled={disabled}
      >
        <Badge
          color={isNotification ? 'error' : 'default'}
          //overlap="circular"
          //variant={isNotification ? 'standard' : 'standard'}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={badgeContent}
          max={MAX_NOTIFICATION}
          className="text-primary"
        >
          {icon}
        </Badge>
      </IconButton>
    </Tooltip>
  )
}

export default memo(CircleButton)

