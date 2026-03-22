import { memo, ReactNode } from "react";

interface AccessControlProps {
    condition: boolean
 children: ReactNode   
}

function AccessControl(props: AccessControlProps) {
    const {condition, children} = props
    return <>{condition && children}</>
}

export default memo(AccessControl)