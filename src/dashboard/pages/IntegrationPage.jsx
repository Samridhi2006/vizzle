import { Code2, Copy, ExternalLink, CheckCircle, Zap } from "lucide-react";
import { useState } from "react";

const CODE_SNIPPET = `<!-- Add to your product page -->
<script src="https://cdn.vizzle.in/tryon.js"></script>
<div
  id="vizzle-tryon"
  data-store-key="YOUR_API_KEY"
  data-product-id="{{ product.id }}"
></div>`;

export default function IntegrationPage() {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Integration</h1>
        <p className="text-sm text-gray-400 mt-0.5">Connect Vizzle to your e-commerce platform via API.</p>
      </div>

      {/* Steps */}
      {[
        { num: 1, title: "Create a Store", sub: "Go to Stores and create your first store to get an API key.", done: false },
        { num: 2, title: "Embed the Widget", sub: "Add our JavaScript snippet to your product pages.", done: false },
        { num: 3, title: "Upload Products", sub: "Upload your garment images from the Products section.", done: false },
        { num: 4, title: "Go Live", sub: "Your customers can now try on clothes virtually!", done: false },
      ].map(({ num, title, sub, done }) => (
        <div key={num} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${done ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
            {done ? <CheckCircle size={18} className="text-emerald-500" /> : num}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">{title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        </div>
      ))}

      {/* Code snippet */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Code2 size={15} className="text-gray-500" />
            <p className="text-sm font-bold text-gray-800">Embed Code</p>
          </div>
          <button onClick={copyCode} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            {copied ? <CheckCircle size={13} className="text-emerald-500" /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="p-5 text-xs text-gray-600 font-mono overflow-x-auto bg-gray-50 leading-relaxed">
          {CODE_SNIPPET}
        </pre>
      </div>

      {/* Docs link */}
      <a
        href="#"
        className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:border-blue-200 transition-colors group"
      >
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <ExternalLink size={17} className="text-blue-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">View Full API Documentation</p>
          <p className="text-xs text-gray-400">REST endpoints, webhooks, and SDK reference</p>
        </div>
        <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
      </a>
    </div>
  );
}
