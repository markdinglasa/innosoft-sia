import { Box, Typography } from "@mui/material";
import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";

function NotificationsPage(){
    return (
        <PageLayout title="Notifications">
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No new notifications
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    System alerts and messages will appear here.
                </Typography>
            </Box>
        </PageLayout>
    )
}

export default memo(NotificationsPage)