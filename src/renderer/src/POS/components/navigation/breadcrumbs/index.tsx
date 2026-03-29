// import { Link, Typography } from '@mui/material';
// import { Crumbs, GenericFunction, SFC } from '@shared/types';
// import { memo, useMemo } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import * as S from './Styles';
// import { getActivePage } from '../../../selectors';
// import { POSPages } from '@renderer/POS/types/pages';

// export interface PageBreadCrumbsProps {
//   links?: Array<Crumbs>;
//   active?: string;
// }

// export interface Crumbs {
//   text: string;
//   onClick?: GenericFunction; // Change to anchor element
// }


// const PageBreadCrumbs: SFC<PageBreadCrumbsProps> = memo(
//   ({ className, active }) => {
//     const navigate = useNavigate();
  
//     const location = useLocation();

//     const paths: string[] = location.pathname
//       .replace('/d/', '/')
//       .substring(1, location.pathname.length)
//       .split('/');
//     const tmpActive = active ?? paths[paths.length - 1];

//     const crumbs: Crumbs[] = paths.slice(0, -1).map((path: string) => {
//       switch (getActivePage) {
//         case POSPages.DASHBOARD:
//           return {
//             text: 'Dashboard',
//             onClick: () => {
//               navigate(Path.PAGE_DASHBOARD);
//               setActiveMenu(Path.PAGE_DASHBOARD);
//             },
//           };
//         case PAGES.SUBSCRIPTION:
//           return {
//             text: PAGES.SUBSCRIPTION,
//             onClick: () => {
//               navigate(Path.PAGE_SUBSCRIPTION);
//               setActiveMenu(Path.PAGE_SUBSCRIPTION);
//             },
//           };
//         case PAGES.CONFIG:
//           return {
//             text: PAGES.CONFIG,
//             onClick: () => navigate('#'),
//           };
//         case PAGES.TENANT:
//           return {
//             text: PAGES.TENANT,
//             onClick: () => {
//               navigate(Path.PAGE_TENANT);
//               setActiveMenu(Path.PAGE_TENANT);
//             },
//           };
//         case PAGES.FEEDBACK:
//           return {
//             text: PAGES.FEEDBACK,
//             onClick: () => {
//               navigate(Path.PAGE_FEEDBACK);
//               setActiveMenu(Path.PAGE_FEEDBACK);
//             },
//           };
//         case PAGES.REQUEST:
//           return {
//             text: PAGES.REQUEST,
//             onClick: () => {
//               navigate(Path.PAGE_REQUEST);
//               setActiveMenu(Path.PAGE_REQUEST);
//             },
//           };
//         case PAGES.BRANCH:
//           return {
//             text: PAGES.BRANCH,
//             onClick: () => {
//               navigate(Path.PAGE_BRANCH);
//               setActiveMenu(Path.PAGE_BRANCH);
//             },
//           };
//         case PAGES.CUSTOMER:
//           return {
//             text: PAGES.CUSTOMER,
//             onClick: () => {
//               navigate(Path.PAGE_CUSTOMER);
//               setActiveMenu(Path.PAGE_CUSTOMER);
//             },
//           };
//         case PAGES.DISCOUNT:
//           return {
//             text: PAGES.DISCOUNT,
//             onClick: () => {
//               navigate(Path.PAGE_DISCOUNT);
//               setActiveMenu(Path.PAGE_DISCOUNT);
//             },
//           };
//         case PAGES.PERSONEL:
//           return {
//             text: PAGES.PERSONEL,
//             onClick: () => navigate('#'),
//           };
//         case PAGES.CATALOG:
//           return {
//             text: PAGES.CATALOG,
//             onClick: () => navigate('#'),
//           };
//         case PAGES.SUPPLIER:
//           return {
//             text: PAGES.SUPPLIER,
//             onClick: () => {
//               navigate(Path.PAGE_SUPPLIER);
//               setActiveMenu(Path.PAGE_SUPPLIER);
//             },
//           };
//         case PAGES.TABLE_GROUP:
//           return {
//             text: PAGES.TABLE_GROUP,
//             onClick: () => {
//               navigate(Path.PAGE_TABLE_GROUP);
//               setActiveMenu(Path.PAGE_TABLE_GROUP);
//             },
//           };
//         case PAGES.CARD_MEMO:
//           return {
//             text: PAGES.CARD_MEMO,
//             onClick: () => {
//               navigate(Path.PAGE_CARD_MEMO);
//               setActiveMenu(Path.PAGE_CARD_MEMO);
//             },
//           };
//         case PAGES.COLLECTION:
//           return {
//             text: PAGES.COLLECTION,
//             onClick: () => {
//               navigate(Path.PAGE_COLLECTION);
//               setActiveMenu(Path.PAGE_COLLECTION);
//             },
//           };
//         case PAGES.DISBURSEMENT:
//           return {
//             text: PAGES.DISBURSEMENT,
//             onClick: () => {
//               navigate(Path.PAGE_DISBURSMENT);
//               setActiveMenu(Path.PAGE_DISBURSMENT);
//             },
//           };
//         case PAGES.PURCHASE_ORDER:
//           return {
//             text: PAGES.PURCHASE_ORDER,
//             onClick: () => {
//               navigate(Path.PAGE_PURCHASE_ORDER);
//               setActiveMenu(Path.PAGE_PURCHASE_ORDER);
//             },
//           };
//         case PAGES.RETAIL_POS:
//           return {
//             text: PAGES.RETAIL_POS,
//             onClick: () => {
//               navigate(Path.PAGE_RETAIL_POS);
//               setActiveMenu(Path.PAGE_RETAIL_POS);
//             },
//           };
//         case PAGES.TOUCH_POS:
//           return {
//             text: PAGES.TOUCH_POS,
//             onClick: () => {
//               navigate(Path.PAGE_TOUCH_POS);
//               setActiveMenu(Path.PAGE_TOUCH_POS);
//             },
//           };
//         case PAGES.STOCK_COUNT:
//           return {
//             text: PAGES.STOCK_COUNT,
//             onClick: () => {
//               navigate(Path.PAGE_STOCK_COUNT);
//               setActiveMenu(Path.PAGE_STOCK_COUNT);
//             },
//           };
//         case PAGES.STOCK_IN:
//           return {
//             text: PAGES.STOCK_IN,
//             onClick: () => {
//               navigate(Path.PAGE_STOCK_IN);
//               setActiveMenu(Path.PAGE_STOCK_IN);
//             },
//           };
//         case PAGES.STOCK_OUT:
//           return {
//             text: PAGES.STOCK_OUT,
//             onClick: () => {
//               navigate(Path.PAGE_STOCK_OUT);
//               setActiveMenu(Path.PAGE_STOCK_OUT);
//             },
//           };
//         case PAGES.SETTINGS:
//           return {
//             text: PAGES.SETTINGS,
//             onClick: () => navigate('#'),
//           };
//         case PAGES.UTILITY:
//           return {
//             text: PAGES.UTILITY,
//             onClick: () => navigate('#'),
//           };
//         case PAGES.BILLING:
//           return {
//             text: PAGES.BILLING,
//             onClick: () => {
//               navigate(Path.PAGE_BILLING);
//               setActiveMenu(Path.PAGE_BILLING);
//             },
//           };
//         default:
//           return { text: 'Error', onClick: () => {} };
//       }
//     });

//     const renderLinks = useMemo(() => {
//       return crumbs.map((link: Crumbs, index: number) => (
//         <Link
//           key={index}
//           underline="hover"
//           color="inherit"
//           onClick={() => link?.onClick && link.onClick()}
//           sx={{
//             cursor: link.onClick ? 'pointer' : 'default',
//             fontFamily: 'Montserrat',
//           }}
//         >
//           <S.InactivePage className="capitalize ">{link.text}</S.InactivePage>
//         </Link>
//       ));
//     }, [crumbs]);

//     return (
//       <S.Container className={className}>
//         <S.Breadcrumbs aria-label="breadcrumb">
//           {renderLinks}
//           <Typography
//             sx={{
//               fontFamily: 'Montserrat',
//             }}
//           >
//             <S.ActivePage>{tmpActive}</S.ActivePage>
//           </Typography>
//         </S.Breadcrumbs>
//       </S.Container>
//     );
//   }
// );

// export default PageBreadCrumbs;
