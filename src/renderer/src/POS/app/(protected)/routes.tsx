import { SystemPermissions } from '@shared/constants/permissions'
import { POSPages } from '../../types/pages'
import * as Admin from './admin'
import POSCatalog from './pos-catalog/page'

/**
 * Configuration for all protected routes
 */
export const ROUTE_CONFIG: Record<string, { content: React.ReactNode; permissions: string }> = {
  [POSPages.ADMIN_DASHBOARD]: {
    content: <Admin.AdminDashboardPage />,
    permissions: SystemPermissions.USER_VIEW
  },
  [POSPages.POS_CATALOG]: {
    content: <POSCatalog />,
    permissions: SystemPermissions.POS_RETAIL_VIEW
  },

  // Masterfiles
  [POSPages.BRANCH]: { content: <Admin.BranchPage />, permissions: SystemPermissions.BRANCH_VIEW },
  [POSPages.CUSTOMER]: {
    content: <Admin.CustomersPage />,
    permissions: SystemPermissions.CUSTOMER_VIEW
  },
  [POSPages.SUPPLIER]: {
    content: <Admin.SuppliersPage />,
    permissions: SystemPermissions.SUPPLIER_VIEW
  },
  [POSPages.ITEM]: { content: <Admin.ItemsPage />, permissions: SystemPermissions.ITEM_VIEW },
  [POSPages.ITEM_GROUP]: {
    content: <Admin.ItemGroupsPage />,
    permissions: SystemPermissions.ITEM_GROUP_VIEW
  },
  [POSPages.ITEM_COMPONENT]: {
    content: <Admin.ItemComponentsPage />,
    permissions: SystemPermissions.ITEM_COMPONENT_VIEW
  },
  [POSPages.DISCOUNT]: {
    content: <Admin.DiscountsPage />,
    permissions: SystemPermissions.DISCOUNT_VIEW
  },
  [POSPages.TABLE_GROUP]: {
    content: <Admin.TableGroupPage />,
    permissions: SystemPermissions.TABLE_GROUP_VIEW
  },
  [POSPages.USER]: { content: <Admin.UsersPage />, permissions: SystemPermissions.USER_VIEW },
  [POSPages.ROLE]: { content: <Admin.RolesPage />, permissions: SystemPermissions.ROLE_VIEW },
  [POSPages.SETTINGS]: {
    content: <Admin.SettingsPage />,
    permissions: SystemPermissions.OTHER_VIEW
  },
  [POSPages.UNIT]: { content: <Admin.UnitPage />, permissions: SystemPermissions.UNIT_VIEW },
  [POSPages.TERM]: { content: <Admin.TermPage />, permissions: SystemPermissions.TERM_VIEW },
  [POSPages.PERIOD]: { content: <Admin.PeriodPage />, permissions: SystemPermissions.PERIOD_VIEW },
  [POSPages.TERMINAL]: {
    content: <Admin.TerminalPage />,
    permissions: SystemPermissions.TERMINAL_VIEW
  },
  [POSPages.CHART_OF_ACCOUNT]: {
    content: <Admin.ChartOfAccountPage />,
    permissions: SystemPermissions.CHART_OF_ACCOUNT_VIEW
  },
  [POSPages.TAX]: { content: <Admin.TaxPage />, permissions: SystemPermissions.TAX_VIEW },
  [POSPages.PAY_TYPE]: {
    content: <Admin.PayTypePage />,
    permissions: SystemPermissions.PAY_TYPE_VIEW
  },
  [POSPages.PROFILE]: { content: <Admin.ProfilePage />, permissions: SystemPermissions.USER_VIEW },

  // Transactionals
  [POSPages.POS_RETAIL]: {
    content: <Admin.POSRetailPage />,
    permissions: SystemPermissions.POS_RETAIL_VIEW
  },
  [POSPages.POS_TOUCH]: {
    content: <Admin.POSTouchPage />,
    permissions: SystemPermissions.POS_TOUCH_VIEW
  },
  [POSPages.POS_HOTEL]: {
    content: <Admin.POSHotelPage />,
    permissions: SystemPermissions.RESTAURANT_VIEW
  },
  [POSPages.COLLECTION]: {
    content: <Admin.CollectionsPage />,
    permissions: SystemPermissions.COLLECTION_VIEW
  },
  [POSPages.DISBURSEMENT]: {
    content: <Admin.DisbursementPage />,
    permissions: SystemPermissions.DISBURSEMENT_VIEW
  },
  [POSPages.PURCHASE_ORDER]: {
    content: <Admin.PurchaseOrderPage />,
    permissions: SystemPermissions.PURCHASE_ORDER_VIEW
  },
  [POSPages.DEBIT_CREDIT_CARD_MEMO]: {
    content: <Admin.DebitCreditCardMemoPage />,
    permissions: SystemPermissions.DEBIT_CREDIT_MEMO_VIEW
  },
  [POSPages.STOCKS]: {
    content: <Admin.StocksPage />,
    permissions: SystemPermissions.INVENTORY_VIEW
  },
  [POSPages.STOCK_IN]: {
    content: <Admin.StockInPage />,
    permissions: SystemPermissions.STOCK_IN_VIEW
  },
  [POSPages.STOCK_OUT]: {
    content: <Admin.StockOutPage />,
    permissions: SystemPermissions.STOCK_OUT_VIEW
  },
  [POSPages.STOCK_COUNT]: {
    content: <Admin.StockCountPage />,
    permissions: SystemPermissions.STOCK_COUNT_VIEW
  },

  // Reports
  [POSPages.REPORTS_HUB]: {
    content: <Admin.ReportsHubPage />,
    permissions: SystemPermissions.SUMMARY_SALES_GENERATE_REPORT
  },

  // Utilities
  [POSPages.NOTIFICATIONS]: {
    content: <Admin.NotificationsPage />,
    permissions: SystemPermissions.USER_VIEW
  }
}

