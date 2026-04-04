import { memo } from "react";
import { Box, Typography } from "@mui/material";
import PageLayout from "../../../../components/layout/page-layout";

function ProfilePage(){
    return (
        <PageLayout title="My Profile">
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    User profile settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Account info and preferences will be managed here.
                </Typography>
            </Box>
        </PageLayout>
    )
}

export default memo(ProfilePage)