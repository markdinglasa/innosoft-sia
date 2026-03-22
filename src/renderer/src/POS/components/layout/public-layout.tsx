import { Container } from "@mui/material";
import { memo, ReactNode } from "react";

function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Container sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {children}
            </Container>
        </>
    )
}

export default memo(PublicLayout)