import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { SupplierCatalogService } from '../../services/masterfile.services/supplier-catalog.service/supplier-catalog.service'
import {
  PurchaseOrderApprovalService,
  PurchaseOrderReceivingService,
  PurchaseOrderService
} from '../../services/transaction.services'

const purchaseOrderService = new PurchaseOrderService()
const approvalService = new PurchaseOrderApprovalService()
const receivingService = new PurchaseOrderReceivingService()
const catalogService = new SupplierCatalogService()

registerProtectedIpcHandler(
  TransactionIpcChannel.PURCHASE_ORDER_LIST,
  async (_event, options) => await purchaseOrderService.list(options)
)
registerProtectedIpcHandler(
  TransactionIpcChannel.PURCHASE_ORDER_GET,
  async (_event, id) => await purchaseOrderService.get(id)
)
registerProtectedIpcHandler(
  TransactionIpcChannel.PURCHASE_ORDER_CREATE,
  async (_event, { payload, userId }) => await purchaseOrderService.create(payload, userId)
)
registerProtectedIpcHandler(
  TransactionIpcChannel.PURCHASE_ORDER_UPDATE,
  async (_event, { id, payload, userId }) => await purchaseOrderService.update(id, payload, userId)
)
registerProtectedIpcHandler(
  TransactionIpcChannel.PURCHASE_ORDER_DELETE,
  async (_event, { id, userId }) => await purchaseOrderService.delete(id, userId)
)

registerProtectedIpcHandler(
  TransactionIpcChannel.PURCHASE_ORDER_SUBMIT_APPROVAL,
  async (_event, { id }) => await purchaseOrderService.submitForApproval(id)
)
registerProtectedIpcHandler(
  TransactionIpcChannel.PURCHASE_ORDER_APPROVE,
  async (_event, { id, userId, comments }) => await approvalService.approve(id, userId, comments)
)
registerProtectedIpcHandler(
  TransactionIpcChannel.PURCHASE_ORDER_REJECT,
  async (_event, { id, userId, reason }) => await approvalService.reject(id, userId, reason)
)
registerProtectedIpcHandler(
  TransactionIpcChannel.PURCHASE_ORDER_RECEIVE,
  async (_event, { id, userId, data }) => await receivingService.processReceiving(id, userId, data)
)

registerProtectedIpcHandler(
  TransactionIpcChannel.SUPPLIER_CATALOG_IMPORT,
  async (_event, { supplierId, csvContent }) =>
    await catalogService.importFromCsv(supplierId, csvContent)
)
registerProtectedIpcHandler(
  TransactionIpcChannel.SUPPLIER_CATALOG_LIST,
  async (_event, { supplierId }) => await catalogService.getSupplierItems(supplierId)
)

