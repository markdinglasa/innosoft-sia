import React, { memo } from 'react';
import { useAuth } from '../../features/authentication/hooks/use-auth';

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that only renders its children if the current user has the required permission.
 */
export const PermissionGate: React.FC<PermissionGateProps> = memo(({ permission, children, fallback = null }) => {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
});

PermissionGate.displayName = 'PermissionGate';
