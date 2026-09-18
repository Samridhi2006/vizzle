import { Store, Plus, Key, Globe } from "lucide-react";

export default function StoresPage() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Stores</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your connected stores and API keys.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">
          <Plus size={15} /> New Store
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <Store size={24} className="text-blue-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">No stores yet</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-5">Create your first store to get an API key and start integrating Vizzle into your platform.</p>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">
            <Plus size={15} /> Create Store
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
            <Key size={18} className="text-yellow-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">API Key</p>
            <p className="text-xs text-gray-400">Generated per store instantly</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Globe size={18} className="text-blue-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Domain</p>
            <p className="text-xs text-gray-400">Whitelist your store domain</p>
          </div>
        </div>
      </div>
    </div>
  );
}
