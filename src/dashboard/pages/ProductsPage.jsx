import { Package, Plus, Search, Filter } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">Browse and manage your uploaded product catalogue.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">
          <Plus size={15} /> Add Product
        </button>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
          <Search size={15} className="text-gray-400" />
          <input className="flex-1 text-sm outline-none placeholder-gray-400" placeholder="Search products..." />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter size={15} /> Filter
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <Package size={24} className="text-blue-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">No products yet</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-5">Add your first product to start creating virtual try-on experiences for your customers.</p>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
