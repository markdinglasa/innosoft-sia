import { Box, Typography } from "@mui/material";
import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";

function PosHotelPage(){
    return (
        <PageLayout title="POS Hotel">
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Hotel POS module
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Room service and hotel billing will be available here.
                </Typography>
            </Box>
        </PageLayout>
    )
}

export default memo(PosHotelPage)