
import { Money } from "@mui/icons-material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Card, CardContent, CardHeader, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
import { lazy, memo, Suspense, useState } from 'react';
import LineChartSkeleton from "../../../components/data-display/line-chart/line-chart-skeleton";
import PageLayout from "../../../components/layout/page-layout";
import TrendCardSkeleton from "../../../components/surfaces/cards/trend-card/trend-card-skeleton";
import { getSeverityColor, kpiData, realtimeAlerts, topSusbcribers, topSusbcriptions } from "./data";

const LineChart = lazy(() => import("../../../components/data-display/line-chart/line-chart"));
const TrendCard = lazy(() => import("../../../components/surfaces/cards/trend-card/trend-card"));

function AdminDashboard() {
  //const [isSetting, toggleSetting] = useToggle(false);
  const [salesTimeRange, setSalesTimeRange] = useState('today');
  const [salesDataType, setSalesDataType] = useState('revenue');

const handleSalesTimeRangeChange = (_: React.SyntheticEvent, newValue: string) => {
    setSalesTimeRange(newValue);
  };

  const handleSalesDataTypeChange = (_: React.SyntheticEvent, newValue: string) => {
    setSalesDataType(newValue);
  };

  return (
    <>
      <PageLayout
        title={'Dashboard'}

        // actions={
        //   <CircleButton
        //     onClick={() => toggleSetting()}
        //     icon={<IconSettings className="text-primary" />}
        //     type={ButtonType.button}
        //     title="Dashboard Settings"
        //   />
        // }
      >
        {/* Top KPI Bar */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Suspense fallback={<TrendCardSkeleton />}>
              <TrendCard
                value={kpiData.totalSales.value}
                trend={kpiData.totalSales.trend}
                isUp={kpiData.totalSales.up}
                icon={<Money sx={{fontSize:25}}/>}
                isCurrency={true}
                label={"Today's Sales"}
              />
            </Suspense>
            <Suspense fallback={<TrendCardSkeleton />}>
              <TrendCard
                value={kpiData.transactions.value}
                trend={kpiData.transactions.trend}
                isUp={kpiData.transactions.up}
                icon={<ShoppingCartIcon sx={{fontSize:25}}/>}
                isCurrency={false}
                label="Transactions"
              />
            </Suspense>
            <Suspense fallback={<TrendCardSkeleton />}>
              <TrendCard
                value={kpiData.avgValue.value}
                trend={kpiData.avgValue.trend}
                isUp={kpiData.avgValue.up}
                icon={<CreditCardIcon sx={{fontSize:25}}/>}
                isCurrency={false}
                label="Avg. Transaction"
              />
            </Suspense>
            <Suspense fallback={<TrendCardSkeleton />}>
              <TrendCard
                value={kpiData.grossProfit.value}
                trend={kpiData.grossProfit.trend}
                isUp={kpiData.grossProfit.up}
                icon={<AccountBalanceWalletIcon sx={{fontSize:25}}/>}
                isCurrency={true}
                label="Gross Profit"
              />
            </Suspense>
          </div>
        </div>

        {/* Sales Trends Chart */}
        <div className="w-full bg-white rounded-md ">
          <Card className="mb-4 w-full">
            <CardHeader 
              title={
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                 <Typography variant="h6" className="font-bold">Sales Trends</Typography>
              <div className="flex my-2 sm:mt-0 md:flex-row flex-col gap-2">
                <Tabs
                  value={salesTimeRange}
                  onChange={handleSalesTimeRangeChange}
                  className="mr-4"
                >
                  <Tab label="Today" value="today" />
                  <Tab label="Week" value="week" />
                  <Tab label="Month" value="month" />
                </Tabs>
                <Tabs value={salesDataType} onChange={handleSalesDataTypeChange}>
                  <Tab label="Revenue" value="revenue" />
                  <Tab label="Transactions" value="transactions" />
                </Tabs>
              </div>
              </Stack>}
              className="py-2"
            />
            {/* <CardHeader className="flex flex-col sm:flex-row justify-between items-start mb-0 sm:items-center py-[1rem] shadow-sm">
             
            </CardHeader> */}
            <CardContent>
              <Suspense fallback={<LineChartSkeleton className={undefined} />}>
                <LineChart
                  data={[
                    { month: 'January', amount: 1237 },
                    { month: 'February', amount: 8899 },
                    { month: 'March', amount: 6798 },
                    { month: 'April', amount: 2779 },
                    { month: 'May', amount: 97555 },
                    { month: 'June', amount: 7555 },
                    { month: 'June', amount: 5555 },
                    { month: 'August', amount: 8555 },
                  ]}
                  category="Sales"
                  title={`${salesDataType} (${salesTimeRange})`}
                />
              </Suspense>
            </CardContent>
          </Card>
        </div>
        {/* Middle Section - Top Products & Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardHeader 
              title={<Typography variant="h6">Top Packages</Typography>}
              className="py-2"
            />
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2 font-medium text-gray-500 text-sm">
                        Packages
                      </th>
                      <th className="pb-2 font-medium text-gray-500 text-sm text-right">
                        Qty Sold
                      </th>
                      <th className="pb-2 font-medium text-gray-500 text-sm text-right">
                        Revenue
                      </th>
                      <th className="pb-2 font-medium text-gray-500 text-sm text-right">
                        Margin
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSusbcriptions.map((product, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3 text-sm font-medium">
                          {product.name}
                        </td>
                        <td className="py-3 text-sm text-right">
                          {product.quantity}
                        </td>
                        <td className="py-3 text-sm text-right">
                          {product.revenue}
                        </td>
                        <td className="py-3 text-sm text-right font-medium text-green-600">
                          {product.margin}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader 
               title={<Typography variant="h6" className="text-lg font-bold">Top Subscribers</Typography>}
               className="py-2"
            />
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2 font-medium text-gray-500 text-sm">
                        Subscriber
                      </th>
                      <th className="pb-2 font-medium text-gray-500 text-sm text-right">
                        Qty Sold
                      </th>
                      <th className="pb-2 font-medium text-gray-500 text-sm text-right">
                        Revenue
                      </th>
                      <th className="pb-2 font-medium text-gray-500 text-sm text-right">
                        Margin
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSusbcribers.map((category, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3 text-sm font-medium">
                          {category.name}
                        </td>
                        <td className="py-3 text-sm text-right">
                          {category.quantity}
                        </td>
                        <td className="py-3 text-sm text-right">
                          {category.revenue}
                        </td>
                        <td className="py-3 text-sm text-right font-medium text-green-600">
                          {category.margin}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Real-Time Alerts */}
          <Card className="bg-white">
            <CardHeader 
              title={<Typography variant="h6" className="text-lg font-bold">Real-Time Alerts</Typography>}
              action={
                <Chip
                  label={`${realtimeAlerts.length} Alerts`}
                  variant="filled"
                  color="warning"
                  className="border-red-500 text-red-500"
                />
              }
              className="py-2"
            />
            <CardContent className="pt-0">
              <div className="space-y-3">
                {realtimeAlerts.map((alert, index) => (
                  <div key={index} className="p-3 bg-slate-100 rounded-md">
                    <div className="flex items-start">
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${getSeverityColor(alert.severity)}`}
                      ></span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">{alert.time}</p>
                          <Chip label={
                            alert.type === 'stock' && 'Inventory' ||
                            alert.type === 'sales' && 'Sales' ||
                            alert.type === 'refund' && 'Refunds'
                          } variant="outlined" className="text-xs" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
      {/* <CustomModal
        close={toggleSetting}
        title={'Dashboard Setting'}
        open={isSetting}
      >
        admin dashboard setting
      </CustomModal> */}
    </>
  );
};

export default memo(AdminDashboard);
