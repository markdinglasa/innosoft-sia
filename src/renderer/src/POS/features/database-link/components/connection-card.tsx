import {
  Delete as DeleteIcon,
  PowerSettingsNew as PowerIcon
} from '@mui/icons-material'
import { Box, Button, Card, CardActions, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material"
import { colors } from "@shared/styles"
import { DBConfig } from "@shared/types"
import { memo } from "react"

interface ConnectionCardProps {
    connection:DBConfig
    isLoading:boolean
    onDelete: (id: string) => void
    onActivate: (id: string) => void
}

function ConnectionCard(props: ConnectionCardProps) {
    const {connection , isLoading, onDelete, onActivate} = props

    return (
       <Card
              key={connection.id}
              variant="outlined"
              sx={{
                borderColor: connection.isActive ? 'primary.main' : 'divider',
                borderWidth: connection.isActive ? 2 : 1,
                bgcolor: colors.palette.neutral['050']
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6">
                      {connection.server} ({connection.name})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      User: {connection.user} | Port: {connection.port}
                    </Typography>
                  </Box>
                  <Box>
                    {connection.isActive ? (
                      <Chip label="Active" color="success" variant="filled" />
                    ) : (
                      <Chip label="Inactive" variant="outlined" color="error" />
                    )}
                  </Box>
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                <IconButton
                  color="error"
                  onClick={() => onDelete(connection.id)}
                  disabled={isLoading || connection.isActive}
                >
                  <DeleteIcon sx={{ fontSize: 25 }} />
                </IconButton>
                {!connection.isActive && (
                  <Button
                    variant="outlined"
                    startIcon={<PowerIcon sx={{ fontSize: 25 }} />}
                    onClick={() => onActivate(connection.id)}
                    disabled={isLoading}
                  >
                    Activate
                  </Button>
                )}
              </CardActions>
            </Card>
    )
}

export default memo(ConnectionCard)