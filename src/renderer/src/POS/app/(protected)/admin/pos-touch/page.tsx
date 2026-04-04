import { Box, Typography } from "@mui/material";
import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";

function PosTouchPage(){
    return (
        <PageLayout title="POS Touch">
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Touch POS module
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Touch-optimized ordering interface will be available here.
                </Typography>
            </Box>
        </PageLayout>
    )
}

export default memo(PosTouchPage)