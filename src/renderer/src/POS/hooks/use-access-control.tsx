import { SystemPermissions } from '@shared/constants/permissions'
import { useSelector } from 'react-redux'

// this hooks would validate the user if has permission
export const useAccessControl = () => {
  const { activePermissions } = useSelector((state: any) => state.POS.manager)

  const hasPermission = (permission: SystemPermissions): boolean => {
    return activePermissions.includes(permission)
  }

  return { hasPermission }
}

