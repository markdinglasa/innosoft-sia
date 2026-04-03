import { Box, Typography } from "@mui/material";
import { memo } from "react";

interface PageLayoutProps {
    title: string;
    children: React.ReactNode;
}

function PageLayout(props: PageLayoutProps) {
    const { title, children } = props
return (
    <Box className="flex h-full w-full flex-col min-h-screen relative">
        <Typography variant="h4" className="pb-6 mb-6">
            {title}
        </Typography>
        <Box>
            {children}
        </Box>
    </Box>
)
}

export default memo(PageLayout)