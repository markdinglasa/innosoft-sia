export enum TransactionIpcChannel {
  // Order
  ORDER_LIST = 'transactions:order:list',
  ORDER_GET = 'transactions:order:get',
  ORDER_CREATE = 'transactions:order:create',
  ORDER_UPDATE = 'transactions:order:update',
  ORDER_DELETE = 'transactions:order:delete',

  // Order Line
  ORDER_LINE_LIST = 'transactions:order-line:list',
  ORDER_LINE_GET = 'transactions:order-line:get',
  ORDER_LINE_CREATE = 'transactions:order-line:create',
  ORDER_LINE_UPDATE = 'transactions:order-line:update',
  ORDER_LINE_DELETE = 'transactions:order-line:delete',

  // Collection
  COLLECTION_LIST = 'transactions:collection:list',
  COLLECTION_GET = 'transactions:collection:get',
  COLLECTION_CREATE = 'transactions:collection:create',
  COLLECTION_UPDATE = 'transactions:collection:update',
  COLLECTION_DELETE = 'transactions:collection:delete',

  // Collection Line
  COLLECTION_LINE_LIST = 'transactions:collection-line:list',
  COLLECTION_LINE_GET = 'transactions:collection-line:get',
  COLLECTION_LINE_CREATE = 'transactions:collection-line:create',
  COLLECTION_LINE_UPDATE = 'transactions:collection-line:update',
  COLLECTION_LINE_DELETE = 'transactions:collection-line:delete',

  // Stock In
  STOCK_IN_LIST = 'transactions:stock-in:list',
  STOCK_IN_GET = 'transactions:stock-in:get',
  STOCK_IN_CREATE = 'transactions:stock-in:create',
  STOCK_IN_UPDATE = 'transactions:stock-in:update',
  STOCK_IN_DELETE = 'transactions:stock-in:delete',

  // Stock In Line
  STOCK_IN_LINE_LIST = 'transactions:stock-in-line:list',
  STOCK_IN_LINE_GET = 'transactions:stock-in-line:get',
  STOCK_IN_LINE_CREATE = 'transactions:stock-in-line:create',
  STOCK_IN_LINE_UPDATE = 'transactions:stock-in-line:update',
  STOCK_IN_LINE_DELETE = 'transactions:stock-in-line:delete',

  // Stock Out
  STOCK_OUT_LIST = 'transactions:stock-out:list',
  STOCK_OUT_GET = 'transactions:stock-out:get',
  STOCK_OUT_CREATE = 'transactions:stock-out:create',
  STOCK_OUT_UPDATE = 'transactions:stock-out:update',
  STOCK_OUT_DELETE = 'transactions:stock-out:delete',

  // Stock Out Line
  STOCK_OUT_LINE_LIST = 'transactions:stock-out-line:list',
  STOCK_OUT_LINE_GET = 'transactions:stock-out-line:get',
  STOCK_OUT_LINE_CREATE = 'transactions:stock-out-line:create',
  STOCK_OUT_LINE_UPDATE = 'transactions:stock-out-line:update',
  STOCK_OUT_LINE_DELETE = 'transactions:stock-out-line:delete',

  // Stock Count
  STOCK_COUNT_LIST = 'transactions:stock-count:list',
  STOCK_COUNT_GET = 'transactions:stock-count:get',
  STOCK_COUNT_CREATE = 'transactions:stock-count:create',
  STOCK_COUNT_UPDATE = 'transactions:stock-count:update',
  STOCK_COUNT_DELETE = 'transactions:stock-count:delete',

  // Stock Count Line
  STOCK_COUNT_LINE_LIST = 'transactions:stock-count-line:list',
  STOCK_COUNT_LINE_GET = 'transactions:stock-count-line:get',
  STOCK_COUNT_LINE_CREATE = 'transactions:stock-count-line:create',
  STOCK_COUNT_LINE_UPDATE = 'transactions:stock-count-line:update',
  STOCK_COUNT_LINE_DELETE = 'transactions:stock-count-line:delete',

  // Purchase Order
  PURCHASE_ORDER_LIST = 'transactions:purchase-order:list',
  PURCHASE_ORDER_GET = 'transactions:purchase-order:get',
  PURCHASE_ORDER_CREATE = 'transactions:purchase-order:create',
  PURCHASE_ORDER_UPDATE = 'transactions:purchase-order:update',
  PURCHASE_ORDER_DELETE = 'transactions:purchase-order:delete',

  // Purchase Order Line
  PURCHASE_ORDER_LINE_LIST = 'transactions:purchase-order-line:list',
  PURCHASE_ORDER_LINE_GET = 'transactions:purchase-order-line:get',
  PURCHASE_ORDER_LINE_CREATE = 'transactions:purchase-order-line:create',
  PURCHASE_ORDER_LINE_UPDATE = 'transactions:purchase-order-line:update',
  PURCHASE_ORDER_LINE_DELETE = 'transactions:purchase-order-line:delete',

  // Disbursement
  DISBURSEMENT_LIST = 'transactions:disbursement:list',
  DISBURSEMENT_GET = 'transactions:disbursement:get',
  DISBURSEMENT_CREATE = 'transactions:disbursement:create',
  DISBURSEMENT_UPDATE = 'transactions:disbursement:update',
  DISBURSEMENT_DELETE = 'transactions:disbursement:delete',

  // Journal
  JOURNAL_LIST = 'transactions:journal:list',
  JOURNAL_GET = 'transactions:journal:get',
  JOURNAL_CREATE = 'transactions:journal:create',
  JOURNAL_UPDATE = 'transactions:journal:update',
  JOURNAL_DELETE = 'transactions:journal:delete',

  // Debit Credit Memo
  DEBIT_CREDIT_MEMO_LIST = 'transactions:debit-credit-memo:list',
  DEBIT_CREDIT_MEMO_GET = 'transactions:debit-credit-memo:get',
  DEBIT_CREDIT_MEMO_CREATE = 'transactions:debit-credit-memo:create',
  DEBIT_CREDIT_MEMO_UPDATE = 'transactions:debit-credit-memo:update',
  DEBIT_CREDIT_MEMO_DELETE = 'transactions:debit-credit-memo:delete',

  // Debit Credit Memo Line
  DEBIT_CREDIT_MEMO_LINE_LIST = 'transactions:debit-credit-memo-line:list',
  DEBIT_CREDIT_MEMO_LINE_GET = 'transactions:debit-credit-memo-line:get',
  DEBIT_CREDIT_MEMO_LINE_CREATE = 'transactions:debit-credit-memo-line:create',
  DEBIT_CREDIT_MEMO_LINE_UPDATE = 'transactions:debit-credit-memo-line:update',
  DEBIT_CREDIT_MEMO_LINE_DELETE = 'transactions:debit-credit-memo-line:delete',

  // Pax Table
  PAX_TABLE_LIST = 'transactions:pax-table:list',
  PAX_TABLE_GET = 'transactions:pax-table:get',
  PAX_TABLE_CREATE = 'transactions:pax-table:create',
  PAX_TABLE_UPDATE = 'transactions:pax-table:update',
  PAX_TABLE_DELETE = 'transactions:pax-table:delete'
}
