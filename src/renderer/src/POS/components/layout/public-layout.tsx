import { Container } from "@mui/material";
import { memo, ReactNode } from "react";

interface PublicLayoutProps {
    children: ReactNode;
    className?: string;
}

function PublicLayout({ children, className }: PublicLayoutProps) {
    return (
        <>
            <Container className={className} sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {children}
            </Container>
        </>
    )
}

export default memo(PublicLayout)