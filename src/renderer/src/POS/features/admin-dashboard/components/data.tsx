import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Chip } from "@mui/material";


// Sample data for the dashboard
export const kpiData = {
  totalSales: { value: '8,459.21', trend: 12.5, up: true },
  transactions: { value: '247', trend: 8.2, up: true },
  avgValue: { value: '34.25', trend: 3.6, up: true },
  grossProfit: { value: '2,893.45', trend: 2.1, up: false },
};

export const renderTrendIcon = (trend: number, up: boolean) => {
  if (up) {
    return (
      <span className="text-green-500 flex items-center text-xs font-medium">
        <ArrowUpward className="w-3 h-3 mr-0.5" />
        {trend}%
      </span>
    );
  } else {
    return (
      <span className="text-red-500 flex items-center text-xs font-medium">
        <ArrowDownward className="w-3 h-3 mr-0.5" />
        {trend}%
      </span>
    );
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'critical':
    case 'out':
      return 'bg-red-500';
    case 'low':
      return 'bg-amber-500';
    case 'fast-moving':
      return 'bg-blue-500';
    default:
      return 'bg-gray-300';
  }
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'critical':
      return (
        <Chip variant="outlined" label="Critical" className="border-red-500 text-red-500" />
      );
    case 'out':
      return (
        <Chip variant="outlined" label="Out of Stock" className="border-red-500 text-red-500" />
      );
    case 'low':
      return (
        <Chip variant="outlined" label="Low Stock" className="border-amber-500 text-amber-500" />
      );
    case 'fast-moving':
      return (
        <Chip variant="outlined" label="Fast Moving" className="border-blue-500 text-blue-500" />
      );
    default:
      return <Chip variant="outlined" label="Normal" className="border-gray-500 text-gray-500" />;
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-amber-500';
    case 'low':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};
export const topSusbcriptions = [
  {
    name: 'Basic',
    quantity: 87,
    revenue: 'P348.00',
    margin: '68%',
  },
  {
    name: 'Pro',
    quantity: 65,
    revenue: 'P325.00',
    margin: '52%',
  },
  {
    name: 'Enterprise',
    quantity: 58,
    revenue: 'P174.00',
    margin: '72%',
  },
];

export const topProducts = [
  {
    name: 'Espresso Coffee',
    quantity: 87,
    revenue: 'P348.00',
    margin: '68%',
  },
  {
    name: 'Chicken Sandwich',
    quantity: 65,
    revenue: 'P325.00',
    margin: '52%',
  },
  {
    name: 'Blueberry Muffin',
    quantity: 58,
    revenue: 'P174.00',
    margin: '72%',
  },
  { name: 'Caesar Salad', quantity: 45, revenue: 'P315.00', margin: '63%' },
  {
    name: 'Fresh Orange Juice',
    quantity: 43,
    revenue: 'P129.00',
    margin: '75%',
  },
];

export const topCategories = [
  { name: 'Beverages', quantity: 245, revenue: 'P1,225.00', margin: '71%' },
  { name: 'Sandwiches', quantity: 186, revenue: 'P1,116.00', margin: '54%' },
  { name: 'Desserts', quantity: 124, revenue: 'P620.00', margin: '68%' },
  { name: 'Salads', quantity: 98, revenue: 'P686.00', margin: '62%' },
  {
    name: 'Breakfast Items',
    quantity: 87,
    revenue: 'P435.00',
    margin: '58%',
  },
];

export const topSusbcribers = [
  {
    name: 'Nutect Marketing',
    quantity: 245,
    revenue: 'P1,225.00',
    margin: '71%',
  },
  { name: 'Zen POS', quantity: 186, revenue: 'P1,116.00', margin: '54%' },
  { name: 'Innosoft', quantity: 124, revenue: 'P620.00', margin: '68%' },
  { name: 'Dannie Nuggets', quantity: 98, revenue: 'P686.00', margin: '62%' },
  {
    name: 'Rica Cake&Pastries',
    quantity: 87,
    revenue: 'P435.00',
    margin: '58%',
  },
];
export const inventoryAlerts = [
  {
    item: 'Coffee Beans (Dark Roast)',
    status: 'low',
    stock: '3 kg',
    reorder: '15 kg',
  },
  {
    item: 'To-Go Cups (16oz)',
    status: 'critical',
    stock: '25 units',
    reorder: '200 units',
  },
  {
    item: 'Chicken Breast',
    status: 'low',
    stock: '2.5 kg',
    reorder: '10 kg',
  },
  { item: 'Avocados', status: 'out', stock: '0 units', reorder: '20 units' },
  {
    item: 'Napkins',
    status: 'fast-moving',
    stock: '450 units',
    reorder: '1000 units',
  },
];

export const staffPerformance = [
  {
    name: 'Emma Watson',
    role: 'Barista',
    sales: 'P1,856.42',
    items: 246,
    upsells: 58,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'John Smith',
    role: 'Cashier',
    sales: 'P1,721.36',
    items: 218,
    upsells: 42,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Sarah Johnson',
    role: 'Server',
    sales: 'P1,635.18',
    items: 204,
    upsells: 37,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'Michael Brown',
    role: 'Barista',
    sales: 'P1,542.25',
    items: 189,
    upsells: 31,
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

export const customerInsights = {
  newVsReturning: { new: 35, returning: 65 },
  loyaltyProgram: { active: 128, totalMembers: 450, redeemed: 42 },
  averageSpend: { value: 'P28.75', trend: 5.2, up: true },
};

export const branchPerformance = [
  { name: 'Downtown', sales: 'P4,586.42', transactions: 142, icon: '🏙️' },
  {
    name: 'Westfield Mall',
    sales: 'P3,872.58',
    transactions: 124,
    icon: '🛍️',
  },
  {
    name: 'University Campus',
    sales: 'P2,945.75',
    transactions: 98,
    icon: '🎓',
  },
  {
    name: 'Business District',
    sales: 'P2,782.32',
    transactions: 87,
    icon: '🏢',
  },
];

export const realtimeAlerts = [
  {
    type: 'stock',
    message: 'Avocados are out of stock',
    time: '12 min ago',
    severity: 'high',
  },
  {
    type: 'sales',
    message: 'Unusual sales spike in Beverages',
    time: '28 min ago',
    severity: 'medium',
  },
  {
    type: 'refund',
    message: 'High refund rate detected',
    time: '54 min ago',
    severity: 'high',
  },
];
