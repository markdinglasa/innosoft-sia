import {
  CheckCircle as ApproveIcon,
  Info as InfoIcon,
  Cancel as RejectIcon
} from '@mui/icons-material'
import { Box, Button, Card, CardContent, Chip, Divider, TextField, Typography } from '@mui/material'
import { ApprovalStatus, PurchaseOrderStatus } from '@shared/types/purchase-order.types'
import { memo, useState } from 'react'
import { useApprovePurchaseOrder, useRejectPurchaseOrder } from '../hooks/use-purchase-order'

interface ApprovalWorkflowProps {
  purchaseOrder: any
}

function ApprovalWorkflow({ purchaseOrder }: Readonly<ApprovalWorkflowProps>) {
  const [comment, setComment] = useState('')
  const approveMutation = useApprovePurchaseOrder()
  const rejectMutation = useRejectPurchaseOrder()

  const handleApprove = async () => {
    await approveMutation.mutateAsync({
      id: purchaseOrder.id,
      userId: 1, // Placeholder
      comments: comment
    })
    setComment('')
  }

  const handleReject = async () => {
    if (!comment) return alert('Please provide a reason for rejection.')
    await rejectMutation.mutateAsync({
      id: purchaseOrder.id,
      userId: 1, // Placeholder
      reason: comment
    })
    setComment('')
  }

  const isPending = purchaseOrder.status === PurchaseOrderStatus.PENDING_APPROVAL

  const chipColor = (status: PurchaseOrderStatus) => {
    switch (status) {
      case PurchaseOrderStatus.DRAFT:
        return 'default'
      case PurchaseOrderStatus.PENDING_APPROVAL:
        return 'warning'
      case PurchaseOrderStatus.APPROVED:
        return 'success'
      case PurchaseOrderStatus.PARTIALLY_RECEIVED:
        return 'primary'
      case PurchaseOrderStatus.COMPLETED:
        return 'success'
      case PurchaseOrderStatus.REJECTED:
        return 'error'
      case PurchaseOrderStatus.CANCELLED:
        return 'error'
      default:
        return 'default'
    }
  }
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Approval Workflow
          </Typography>
          <Chip
            label={purchaseOrder.status.replace('_', ' ')}
            color={chipColor(purchaseOrder.status)}
            size="small"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {isPending ? (
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              This order requires your review.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Add a comment or rejection reason..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 2 }}
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={handleApprove}
                disabled={approveMutation.isPending}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<RejectIcon />}
                onClick={handleReject}
                disabled={rejectMutation.isPending}
              >
                Reject
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon color="primary" fontSize="small" />
            <Typography variant="body2">
              Workflow completed or order is not in a state requiring approval.
            </Typography>
          </Box>
        )}

        {purchaseOrder.approvals && purchaseOrder.approvals.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
              Approval History
            </Typography>
            {purchaseOrder.approvals.map((approval: any, idx: number) => (
              <Box
                key={approval.id + '' + idx}
                sx={{
                  py: 1,
                  borderBottom: idx < purchaseOrder.approvals.length - 1 ? 1 : 0,
                  borderColor: 'divider'
                }}
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {approval.approver?.fullName || 'System User'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(approval.approvalDate || approval.entryDateTime).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color={
                    approval.status === ApprovalStatus.APPROVED ? 'success.main' : 'error.main'
                  }
                >
                  {approval.status}
                </Typography>
                {approval.comments && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                    "{approval.comments}"
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default memo(ApprovalWorkflow)

