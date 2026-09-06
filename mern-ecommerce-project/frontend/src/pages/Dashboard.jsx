import { useEffect, useState } from 'react';
import { Package, Truck, IndianRupee, AlertTriangle } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'));
  }, []);

  if (error) {
    return <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>;
  }

  if (!stats) {
    return <p className="text-slate-500">Loading dashboard...</p>;
  }

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: Truck },
    { label: 'Delivered', value: stats.deliveredOrders, icon: Package },
    { label: 'Revenue (INR)', value: stats.revenue, icon: IndianRupee },
    { label: 'Low Stock Items', value: stats.lowStockItems, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Operations Dashboard</h2>
        <p className="text-slate-500">Live inventory and dispatch overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-slate-500">{label}</span>
              <Icon size={18} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Recent Orders</h3>
        {stats.recentOrders.length === 0 ? (
          <p className="text-slate-500">No orders yet. Create one from the Orders page.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o._id} className="border-b border-slate-100">
                    <td className="py-3 font-mono text-blue-700">{o.orderId}</td>
                    <td className="py-3">{o.productName}</td>
                    <td className="py-3">{o.quantity}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
