import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load products'));
  }, []);

  if (error) return <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Product Catalog</h2>
        <p className="text-slate-500">Warehouse inventory available for dispatch</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-mono text-slate-400">{p.sku}</p>
            <h3 className="mt-1 text-lg font-semibold">{p.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{p.category}</p>
            <p className="mt-3 text-sm text-slate-600">{p.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-bold text-blue-700">₹{p.price}</span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  p.stock < 20
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                Stock: {p.stock}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
