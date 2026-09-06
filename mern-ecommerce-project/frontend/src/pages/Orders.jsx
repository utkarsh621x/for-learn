import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Orders() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [destination, setDestination] = useState('Dwarka Hub - New Delhi');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const [pRes, oRes] = await Promise.all([api.get('/products'), api.get('/orders')]);
    setProducts(pRes.data);
    setOrders(oRes.data);
    if (!productId && pRes.data[0]) setProductId(pRes.data[0]._id);
  };

  useEffect(() => {
    loadData().catch((err) => setError(err.response?.data?.message || 'Failed to load data'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const res = await api.post('/orders', {
        productId,
        quantity: Number(quantity),
        destination,
      });
      setMessage(`Order ${res.data.orderId} created successfully`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
        <h2 className="mb-4 text-lg font-semibold">Dispatch New Order</h2>

        {message && <p className="mb-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            >
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} (₹{p.price}) — stock {p.stock}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !productId}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Order'}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <h2 className="mb-4 text-lg font-semibold">All Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-slate-500">
              <tr>
                <th className="pb-2">Order ID</th>
                <th className="pb-2">Product</th>
                <th className="pb-2">Qty</th>
                <th className="pb-2">Destination</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-slate-100">
                  <td className="py-3 font-mono text-blue-700">{o.orderId}</td>
                  <td className="py-3">{o.productName}</td>
                  <td className="py-3">{o.quantity}</td>
                  <td className="py-3">{o.destination}</td>
                  <td className="py-3">₹{o.totalAmount}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
