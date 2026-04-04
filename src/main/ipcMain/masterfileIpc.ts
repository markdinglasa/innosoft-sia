import { IpcChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { BaseService } from '../services/base.service'
import {
  AccountService,
  BranchService,
  CustomerService,
  DiscountService,
  ItemComponentService,
  ItemGroupService,
  ItemService,
  PayTypeService,
  PeriodService,
  RoleService,
  SupplierService,
  TableGroupService,
  TableService,
  TaxService,
  TerminalService,
  TermService,
  UnitService,
  UserService,
} from '../services/masterfile.services'
import {
  CollectionService,
  DebitCreditMemoService,
  DisbursementService,
  PurchaseOrderService,
  StockCountService,
  StockInService,
  StockOutService,
} from '../services/transaction.services'
import { ParentChildService } from '../services/parent-child.service'
import { SysAuditTrailService } from '../services/utility.services'

/**
 * Registry of all available masterfile services to be wired to IPC.
 */
const services: Record<string, any> = {
  branch: new BranchService(),
  user: new UserService(),
  role: new RoleService(),
  account: new AccountService(),
  terminal: new TerminalService(),
  item: new ItemService(),
  unit: new UnitService(),
  tax: new TaxService(),
  customer: new CustomerService(),
  supplier: new SupplierService(),
  discount: new DiscountService(),
  table: new TableService(),
  term: new TermService(),
  payType: new PayTypeService(),
  period: new PeriodService(),
  itemGroup: new ItemGroupService(),
  itemComponent: new ItemComponentService(),
  tableGroup: new TableGroupService(),
  auditTrail: new SysAuditTrailService(),

  // Transaction Services
  collection: new CollectionService(),
  disbursement: new DisbursementService(),
  purchaseOrder: new PurchaseOrderService(),
  stockIn: new StockInService(),
  stockOut: new StockOutService(),
  stockCount: new StockCountService(),
  debitCreditMemo: new DebitCreditMemoService(),
}


/**
 * Registers centralized IPC handlers for all Masterfile Hub services.
 * This avoids duplicate IPC registration blocks for every entity.
 */
export function registerMasterfileHandlers() {
  // 1. Generic List Handler
  ipcMain.handle(IpcChannel.mstList, async (_event, { serviceName, options }) => {
    const service = services[serviceName]
    if (!service) return { success: false, message: `Service '${serviceName}' not found.` }
    
    try {
      const data = await service.list(options)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  })

  // 2. Generic Get Handler
  ipcMain.handle(IpcChannel.mstGet, async (_event, { serviceName, id, options }) => {
    const service = services[serviceName]
    if (!service) return { success: false, message: `Service '${serviceName}' not found.` }
    
    try {
      const data = await service.get(id, options)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  })

  // 3. Generic Save Handler (Supports standard CRUD + Parent-Child)
  ipcMain.handle(IpcChannel.mstSave, async (_event, { serviceName, payload, userId }) => {
    const service = services[serviceName] as BaseService<any>
    if (!service) return { success: false, message: `Service '${serviceName}' not found.` }
    
    try {
      // Check if it's a parent-child save
      if (service instanceof ParentChildService) {
        return await (service as ParentChildService<any>).saveWithChildren(payload, userId)
      }

      // Standard Create or Update
      if (payload.id) {
        const { id, ...data } = payload
        return await service.update(id, data, userId)
      } else {
        return await service.create(payload, userId)
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Save failed' }
    }
  })

  // 4. Generic Delete Handler
  ipcMain.handle(IpcChannel.mstDelete, async (_event, { serviceName, id, userId }) => {
    const service = services[serviceName]
    if (!service) return { success: false, message: `Service '${serviceName}' not found.` }
    
    try {
      return await service.delete(id, userId)
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  })
}
