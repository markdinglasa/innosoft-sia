import { mdiLockOffOutline } from "@mdi/js";
import MdiReactIcon from "@mdi/react";
import { Box, Typography } from "@mui/material";
import { colors } from "@shared/styles";
import { memo } from "react";
import PageLayout from "../layout/page-layout";

function AccessDenied(){
    return <PageLayout title="Access Denied">
        <Box className="flex flex-col items-center justify-center py-20">
            <MdiReactIcon path={mdiLockOffOutline} size={4} color={colors.palette.neutral[400]} />
            <Typography variant="h1" sx={{fontSize: '3rem', fontWeight: 'bold', color: colors.palette.neutral[400]}}>
                403
            </Typography>
            <Typography variant="h5" sx={{color: colors.palette.neutral[500]}}>
                You don't have permission to access this page.
            </Typography>
            <Typography variant="body1" sx={{mt: 2, color: colors.palette.neutral[600]}}>
                Please contact your administrator if you believe this is an error.
            </Typography>
        </Box>
    </PageLayout>
}

export default memo(AccessDenied)
