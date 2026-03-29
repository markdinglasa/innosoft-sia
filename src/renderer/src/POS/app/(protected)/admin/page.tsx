import { Box, Typography } from "@mui/material";
import { memo } from "react";

function AdminDashboardPage(){
    return (
      <Box className="flex h-full w-full flex-col border-red-500 border">
      <Typography variant="h2" className="pb-6 mb-6 border border-red-100">
        Admin Dashboard & Management
      </Typography>
      
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Daily Sales</Typography>
          <Typography variant="h3" color="primary">₱0.00</Typography>
        </Box>
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Total Transactions</Typography>
          <Typography variant="h3" color="primary">0</Typography>
        </Box>
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Active Tills</Typography>
          <Typography variant="h3" color="primary">1</Typography>
        </Box>
      </Box>

      {/* Advanced data tables for masterfiles will go here */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, minHeight: '300px' }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Recent Activity & Quick Links</Typography>
          <Typography color="text.secondary">Masterfile controls and detailed reports will be loaded here.</Typography>
      </Box>
    </Box>
    )
}

export default memo(AdminDashboardPage)