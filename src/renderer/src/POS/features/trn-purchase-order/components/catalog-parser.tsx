import {
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  UploadFile as UploadIcon
} from '@mui/icons-material'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import { memo, useRef, useState } from 'react'
import { useImportSupplierCatalog } from '../hooks/use-purchase-order'

interface CatalogParserProps {
  supplierId: number
  onSuccess?: () => void
}

function CatalogParser({ supplierId, onSuccess }: Readonly<CatalogParserProps>) {
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importMutation = useImportSupplierCatalog()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      setError(null)
      setResult(null)

      const content = await file.text()
      const response = await importMutation.mutateAsync({
        supplierId,
        csvContent: content
      })

      setResult(response)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to import catalog.')
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Supplier Catalog Import
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Upload a CSV file with the following columns: <br />
          <strong>
            SupplierItemCode, SupplierItemName, InternalItemCode, UnitCost, LeadTime, MOQ
          </strong>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Alert severity="success" sx={{ mb: 2 }} icon={<SuccessIcon fontSize="inherit" />}>
            Import complete: {result.imported} items imported, {result.skipped} skipped.
          </Alert>
        )}

        <input type="file" accept=".csv" hidden ref={fileInputRef} onChange={handleFileUpload} />

        <Button
          variant="outlined"
          startIcon={isImporting ? <CircularProgress size={20} /> : <UploadIcon />}
          disabled={isImporting}
          onClick={() => fileInputRef.current?.click()}
          fullWidth
        >
          {isImporting ? 'Processing CSV...' : 'Choose CSV File'}
        </Button>

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <InfoIcon color="primary" fontSize="small" sx={{ mt: 0.2 }} />
          <Typography variant="caption" color="textSecondary">
            If an item code exists, it will be updated with the new pricing and metadata.
            InternalItemCode should match the product code in the system.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default memo(CatalogParser)

