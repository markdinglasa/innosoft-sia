import { Box, Typography } from "@mui/material";
import { memo } from "react";
import PageLayout from "../layout/page-layout";

function NotFound(){
    return <PageLayout>
        <Box className="flex flex-col items-center justify-center py-20 ">
            <Typography variant="h1" sx={{fontSize: '5rem', fontWeight: 'bold', color: 'gray'}}>
                404
            </Typography>
            <Typography variant="h5" sx={{color: 'gray'}}>
                Oops! The page you are looking for does not exist.
            </Typography>
        </Box>
    </PageLayout>
}

export default memo(NotFound)
