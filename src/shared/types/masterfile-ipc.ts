export enum MasterfileIpcChannel {
  // Account
  ACCOUNT_LIST = 'masterfiles:account:list',
  ACCOUNT_GET = 'masterfiles:account:get',
  ACCOUNT_CREATE = 'masterfiles:account:create',
  ACCOUNT_UPDATE = 'masterfiles:account:update',
  ACCOUNT_DELETE = 'masterfiles:account:delete',

  // Branch Access
  BRANCH_ACCESS_LIST = 'masterfiles:branch-access:list',
  BRANCH_ACCESS_GET = 'masterfiles:branch-access:get',
  BRANCH_ACCESS_CREATE = 'masterfiles:branch-access:create',
  BRANCH_ACCESS_UPDATE = 'masterfiles:branch-access:update',
  BRANCH_ACCESS_DELETE = 'masterfiles:branch-access:delete',

  // Branch
  BRANCH_LIST = 'masterfiles:branch:list',
  BRANCH_GET = 'masterfiles:branch:get',
  BRANCH_CREATE = 'masterfiles:branch:create',
  BRANCH_UPDATE = 'masterfiles:branch:update',
  BRANCH_DELETE = 'masterfiles:branch:delete',

  // Customer
  CUSTOMER_LIST = 'masterfiles:customer:list',
  CUSTOMER_GET = 'masterfiles:customer:get',
  CUSTOMER_CREATE = 'masterfiles:customer:create',
  CUSTOMER_UPDATE = 'masterfiles:customer:update',
  CUSTOMER_DELETE = 'masterfiles:customer:delete',

  // Discount Item
  DISCOUNT_ITEM_LIST = 'masterfiles:discount-item:list',
  DISCOUNT_ITEM_GET = 'masterfiles:discount-item:get',
  DISCOUNT_ITEM_CREATE = 'masterfiles:discount-item:create',
  DISCOUNT_ITEM_UPDATE = 'masterfiles:discount-item:update',
  DISCOUNT_ITEM_DELETE = 'masterfiles:discount-item:delete',

  // Discount
  DISCOUNT_LIST = 'masterfiles:discount:list',
  DISCOUNT_GET = 'masterfiles:discount:get',
  DISCOUNT_CREATE = 'masterfiles:discount:create',
  DISCOUNT_UPDATE = 'masterfiles:discount:update',
  DISCOUNT_DELETE = 'masterfiles:discount:delete',

  // Item Component
  ITEM_COMPONENT_LIST = 'masterfiles:item-component:list',
  ITEM_COMPONENT_GET = 'masterfiles:item-component:get',
  ITEM_COMPONENT_CREATE = 'masterfiles:item-component:create',
  ITEM_COMPONENT_UPDATE = 'masterfiles:item-component:update',
  ITEM_COMPONENT_DELETE = 'masterfiles:item-component:delete',

  // Item Group Item
  ITEM_GROUP_ITEM_LIST = 'masterfiles:item-group-item:list',
  ITEM_GROUP_ITEM_GET = 'masterfiles:item-group-item:get',
  ITEM_GROUP_ITEM_CREATE = 'masterfiles:item-group-item:create',
  ITEM_GROUP_ITEM_UPDATE = 'masterfiles:item-group-item:update',
  ITEM_GROUP_ITEM_DELETE = 'masterfiles:item-group-item:delete',

  // Item Group
  ITEM_GROUP_LIST = 'masterfiles:item-group:list',
  ITEM_GROUP_GET = 'masterfiles:item-group:get',
  ITEM_GROUP_CREATE = 'masterfiles:item-group:create',
  ITEM_GROUP_UPDATE = 'masterfiles:item-group:update',
  ITEM_GROUP_DELETE = 'masterfiles:item-group:delete',

  // Item Package
  ITEM_PACKAGE_LIST = 'masterfiles:item-package:list',
  ITEM_PACKAGE_GET = 'masterfiles:item-package:get',
  ITEM_PACKAGE_CREATE = 'masterfiles:item-package:create',
  ITEM_PACKAGE_UPDATE = 'masterfiles:item-package:update',
  ITEM_PACKAGE_DELETE = 'masterfiles:item-package:delete',

  // Item Price
  ITEM_PRICE_LIST = 'masterfiles:item-price:list',
  ITEM_PRICE_GET = 'masterfiles:item-price:get',
  ITEM_PRICE_CREATE = 'masterfiles:item-price:create',
  ITEM_PRICE_UPDATE = 'masterfiles:item-price:update',
  ITEM_PRICE_DELETE = 'masterfiles:item-price:delete',

  // Item
  ITEM_LIST = 'masterfiles:item:list',
  ITEM_GET = 'masterfiles:item:get',
  ITEM_CREATE = 'masterfiles:item:create',
  ITEM_UPDATE = 'masterfiles:item:update',
  ITEM_DELETE = 'masterfiles:item:delete',

  // Pay Type
  PAY_TYPE_LIST = 'masterfiles:pay-type:list',
  PAY_TYPE_GET = 'masterfiles:pay-type:get',
  PAY_TYPE_CREATE = 'masterfiles:pay-type:create',
  PAY_TYPE_UPDATE = 'masterfiles:pay-type:update',
  PAY_TYPE_DELETE = 'masterfiles:pay-type:delete',

  // Permission
  PERMISSION_LIST = 'masterfiles:permission:list',
  PERMISSION_GET = 'masterfiles:permission:get',
  PERMISSION_CREATE = 'masterfiles:permission:create',
  PERMISSION_UPDATE = 'masterfiles:permission:update',
  PERMISSION_DELETE = 'masterfiles:permission:delete',

  // Role
  ROLE_LIST = 'masterfiles:role:list',
  ROLE_GET = 'masterfiles:role:get',
  ROLE_CREATE = 'masterfiles:role:create',
  ROLE_UPDATE = 'masterfiles:role:update',
  ROLE_DELETE = 'masterfiles:role:delete',

  // Supplier
  SUPPLIER_LIST = 'masterfiles:supplier:list',
  SUPPLIER_GET = 'masterfiles:supplier:get',
  SUPPLIER_CREATE = 'masterfiles:supplier:create',
  SUPPLIER_UPDATE = 'masterfiles:supplier:update',
  SUPPLIER_DELETE = 'masterfiles:supplier:delete',

  // Table Group
  TABLE_GROUP_LIST = 'masterfiles:table-group:list',
  TABLE_GROUP_GET = 'masterfiles:table-group:get',
  TABLE_GROUP_CREATE = 'masterfiles:table-group:create',
  TABLE_GROUP_UPDATE = 'masterfiles:table-group:update',
  TABLE_GROUP_DELETE = 'masterfiles:table-group:delete',

  // Table
  TABLE_LIST = 'masterfiles:table:list',
  TABLE_GET = 'masterfiles:table:get',
  TABLE_CREATE = 'masterfiles:table:create',
  TABLE_UPDATE = 'masterfiles:table:update',
  TABLE_DELETE = 'masterfiles:table:delete',

  // Tax
  TAX_LIST = 'masterfiles:tax:list',
  TAX_GET = 'masterfiles:tax:get',
  TAX_CREATE = 'masterfiles:tax:create',
  TAX_UPDATE = 'masterfiles:tax:update',
  TAX_DELETE = 'masterfiles:tax:delete',

  // Term
  TERM_LIST = 'masterfiles:term:list',
  TERM_GET = 'masterfiles:term:get',
  TERM_CREATE = 'masterfiles:term:create',
  TERM_UPDATE = 'masterfiles:term:update',
  TERM_DELETE = 'masterfiles:term:delete',

  // Terminal
  TERMINAL_LIST = 'masterfiles:terminal:list',
  TERMINAL_GET = 'masterfiles:terminal:get',
  TERMINAL_CREATE = 'masterfiles:terminal:create',
  TERMINAL_UPDATE = 'masterfiles:terminal:update',
  TERMINAL_DELETE = 'masterfiles:terminal:delete',

  // Unit
  UNIT_LIST = 'masterfiles:unit:list',
  UNIT_GET = 'masterfiles:unit:get',
  UNIT_CREATE = 'masterfiles:unit:create',
  UNIT_UPDATE = 'masterfiles:unit:update',
  UNIT_DELETE = 'masterfiles:unit:delete',

  // User
  USER_LIST = 'masterfiles:user:list',
  USER_GET = 'masterfiles:user:get',
  USER_CREATE = 'masterfiles:user:create',
  USER_UPDATE = 'masterfiles:user:update',
  USER_DELETE = 'masterfiles:user:delete'
}
