import { memo } from "react";
import { Box, Typography } from "@mui/material";
import PageLayout from "../../../../../components/layout/page-layout";

function StocksPage(){
    return (
        <PageLayout title="Current Inventory">
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Inventory status view — coming soon
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    This page will display current stock levels across all items and branches.
                </Typography>
            </Box>
        </PageLayout>
    )
}

export default memo(StocksPage)