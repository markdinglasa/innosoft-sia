import React, { FC, ReactNode } from 'react'
import { useSelector } from 'react-redux'

export const useHasPermission = (requiredPermissions: string | string[], requireAll: boolean = false): boolean => {
    const { activePermissions } = useSelector((state: any) => state.POS.manager)

    if (!activePermissions || activePermissions.length === 0) {
        return false
    }

    const perms = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]

    if (requireAll) {
        return perms.every((p) => activePermissions.includes(p))
    } else {
        return perms.some((p) => activePermissions.includes(p))
    }
}

interface RequirePermissionProps {
    permissions: string | string[]
    requireAll?: boolean
    children: ReactNode
    fallback?: ReactNode
}

export const RequirePermission: FC<RequirePermissionProps> = ({ 
    permissions, 
    requireAll = false, 
    children, 
    fallback = null 
}) => {
    const hasPermission = useHasPermission(permissions, requireAll)

    if (!hasPermission) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
