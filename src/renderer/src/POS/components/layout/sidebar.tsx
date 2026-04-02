
import { mdiAccountGroupOutline, mdiAccountSupervisorOutline, mdiApplicationCogOutline, mdiCartOutline, mdiCash, mdiCashRefund, mdiCreditCardEditOutline, mdiFileDocumentMultipleOutline, mdiGestureTap, mdiLiquor, mdiOfficeBuildingCogOutline, mdiOfficeBuildingOutline, mdiPercentCircleOutline, mdiTableChair, mdiTruckOutline, mdiViewDashboard, mdiViewList, mdiWalk } from "@mdi/js";
import { Typography } from "@mui/material";
import { SFC } from "@shared/types";
import { memo } from "react";
import { POSPages } from "../../types/pages";
import Menu, { MenuProps } from '../navigation/menu';
import * as S from './styles';

const MENU_ITEMS : MenuProps[]= [
  {
    label:"Dashboard", 
    icon:mdiViewDashboard, 
    page:POSPages.DASHBOARD,
    isParent:false,
    category:"Masterfile"
  },
  {
    label:"Branch", 
    icon:mdiOfficeBuildingCogOutline, 
    page: POSPages.BRANCH,
    isParent:false,
    category:"Masterfile"
  },
  {
    label:"Catalog", 
    icon:mdiLiquor, 
    isParent:true,
    category:"Masterfile",
    children:[
      {
        label:"Items", 
        page: POSPages.ITEM
      },
       {
        label:"Item Groups",
         page: POSPages.ITEM_GROUP
      },
      {
        label:"Item Components",
         page: POSPages.ITEM_COMPONENT
      },
    ]
  },
  {
    label:"Personel", 
    icon:mdiAccountSupervisorOutline, 
    isParent:true,
    category:"Masterfile",
    children: [
      {
        label:"Users",
        page: POSPages.USER
      },
      {
        label:"Roles",
        page: POSPages.ROLE
      }
    ]
  },
    {
    label:"Discounts", 
    icon:mdiPercentCircleOutline, 
    page: POSPages.DISCOUNT,
    isParent:false,
    category:"Masterfile"
  },
  {
    label:"Table Group", 
    icon:mdiTableChair, 
    page: POSPages.TABLE_GROUP,
    isParent:false,
    category:"Masterfile"
  },
  {
    label:"Customers", 
    icon:mdiAccountGroupOutline, 
    page: POSPages.CUSTOMER,
    isParent:false,
    category:"Masterfile"
  },
  {
    label:"Suppliers", 
    icon:mdiTruckOutline, 
    page: POSPages.SUPPLIER,
    isParent:false,
    category:"Masterfile"
  },
  {
    label:"Configuration", 
    icon:mdiApplicationCogOutline, 
    isParent:true,
    category:"Masterfile",
    children:[
      {
        label:"Chart of Accounts",
        page: POSPages.CHART_OF_ACCOUNT,
      },
      {
        label:"Pay Type",
        page: POSPages.PAY_TYPE,
      },
      {
        label:"Terminal",
        page: POSPages.TERMINAL,
      },
      {
        label:"Tax",
        page: POSPages.TAX,
      },
      {
        label:"Term",
        page: POSPages.TERM,
      },
      {
        label:"Unit",
        page: POSPages.UNIT,
      },
      {
        label:"Period",
        page: POSPages.PERIOD,
      },
    ]
  },
  {
    label:"POS Retail", 
    icon:mdiCartOutline, 
    page: POSPages.POS_RETAIL,
    isParent:false,
    category:"Transaction"
  },
  {
    label:"POS Touch", 
    icon:mdiGestureTap, 
    page: POSPages.POS_TOUCH,
    isParent:false,
    category:"Transaction"
  },
  {
    label:"POS Hotel", 
    icon:mdiOfficeBuildingOutline, 
    page: POSPages.POS_HOTEL,
    isParent:false,
    category:"Transaction"
  },
  {
    label:"Collections", 
    icon:mdiCash, 
    page: POSPages.COLLECTION,
    isParent:false,
    category:"Transaction"
  },
  {
    label:"Purchase Orders", 
    icon:mdiWalk, 
    page: POSPages.PURCHASE_ORDER,
    isParent:false,
    category:"Transaction"
  },
  {
    label:"Disbursements", 
    icon:mdiCashRefund, 
    page: POSPages.DISBURSEMENT,
    isParent:false,
    category:"Transaction"
  },
  {
    label:"Debit Credit Card Memo", 
    icon:mdiCreditCardEditOutline, 
    page: POSPages.DEBIT_CREDIT_CARD_MEMO,
    isParent:false,
    category:"Transaction"
  },
  {
    label:"Inventory", 
    icon:mdiViewList, 
    isParent:true,
    category:"Transaction",
    children:[
      {
        label:"Stocks",
        page: POSPages.STOCKS,
      },
      {
        label:"Stock In", 
        page: POSPages.STOCK_IN,
      },
      {
        label:"Stock Out", 
        page: POSPages.STOCK_OUT,
      },
      {
        label:"Stock Count", 
        page: POSPages.STOCK_COUNT,
      },
    ]
  },
  {
    label:"Reports Hub", 
    icon:mdiFileDocumentMultipleOutline, 
    page: POSPages.REPORTS_HUB,
    isParent:false,
    category:"Reports"
  },
  

]

export const SideNav: SFC = memo(
  () => {
    return (
      <>
        <S.Container>
          <S.Logo>
            <Typography variant="h3" sx={{ fontWeight: 'bold'}} className="text-white">
                NUTSHELL
            </Typography>
          </S.Logo>
          <S.MenuContainer>
          {
            Object.entries(
              MENU_ITEMS.reduce<Record<string, MenuProps[]>>((acc, item) => {
                (acc[item.category] ??= []).push(item);
                return acc;
              }, {})
            ).map(([category, items]) => (
              <div key={category}>
                <Typography
                  variant="caption"
                  className="uppercase text-white px-2 mt-3 block"
                  sx={{ opacity: 0.6, display: 'block', paddingX: '0.75rem', marginTop: '0.75rem' }}
                >
                  {category}
                </Typography>
                {items.map((item) => (
                  <Menu
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    category={item.category}
                    page={item.page}
                    isParent={item.isParent}
                    children={item.children}
                  />
                ))}
              </div>
            ))
          }
          </S.MenuContainer>
        </S.Container>
      </>
    );
  }
);
