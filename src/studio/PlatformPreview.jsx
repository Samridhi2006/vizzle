import React, { useState } from "react";
import {
  Monitor,
  Smartphone,
  Star,
  ShieldCheck,
  ShoppingBag,
  Heart,
  Share2,
  Sparkles,
  Check,
  ChevronRight,
  ChevronDown,
  Truck,
  RotateCcw,
  Search,
  ShoppingCart,
  Maximize2,
  Minimize2,
  ArrowLeft,
  MapPin,
  Menu,
  Lock,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlatformPreview({
  platform = "amazon",
  previewImage = null,
  garmentLabel = "Garment",
  modelName = "Studio Model",
  generating = false,
  generated = false,
  ratio = "3:4",
  resolution = "2K",
}) {
  const [viewMode, setViewMode] = useState("desktop"); // "desktop" | "mobile"
  const [isExpanded, setIsExpanded] = useState(false);

  // Fallback image if previewImage is empty
  const activeImage =
    previewImage ||
    (generated ? "/catalogue/brand_main.jpg" : "/images/poses/women/front_view.jpg");

  // Platform metadata tailored to authentic e-commerce specifications
  const platformMeta = {
    amazon: {
      name: "Amazon",
      domain: "amazon.in",
      navBg: "#131921",
      accent: "#FF9900",
      btnPrimary: "bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900",
      btnSecondary: "bg-[#FFA41C] hover:bg-[#FA8900] text-slate-900",
      price: "₹999",
      priceNum: "999.00",
      mrp: "₹1,999",
      discount: "-50%",
      badge: "Amazon's Choice",
      rating: "3.9",
      ratingsCount: "44 ratings",
      boughtPastMonth: "1,204 bought in past month",
      delivery: "FREE delivery Saturday, 31 May",
      fastestDelivery: "Or fastest delivery Thu, 29 May",
      seller: "Furbo Fashion",
      shipsFrom: "Amazon",
      prime: true,
      location: "Hyderabad 500032",
    },
    flipkart: {
      name: "Flipkart",
      domain: "flipkart.com",
      navBg: "#2874F0",
      accent: "#2874F0",
      btnPrimary: "bg-[#FF9F00] hover:bg-[#F39000] text-white",
      btnSecondary: "bg-[#FB641B] hover:bg-[#E8530B] text-white",
      price: "₹1,299",
      priceNum: "1,299",
      mrp: "₹3,499",
      discount: "63% off",
      badge: "Flipkart Assured",
      rating: "4.3",
      ratingsCount: "5,820 ratings",
      boughtPastMonth: "2,410 bought in past week",
      delivery: "FREE delivery by Tomorrow",
      fastestDelivery: "Express delivery in 2 hours",
      seller: "Vizzle Retail India",
      shipsFrom: "Flipkart",
      prime: false,
      location: "Bengaluru 560001",
    },
    myntra: {
      name: "Myntra",
      domain: "myntra.com",
      navBg: "#FFFFFF",
      accent: "#FF3F6C",
      btnPrimary: "bg-[#FF3F6C] hover:bg-[#E02E58] text-white",
      btnSecondary: "border border-slate-300 bg-white text-slate-800 hover:border-slate-800",
      price: "₹1,799",
      priceNum: "1,799",
      mrp: "₹4,299",
      discount: "58% OFF",
      badge: "TRENDING",
      rating: "4.6",
      ratingsCount: "1,940 ratings",
      boughtPastMonth: "890 bought recently",
      delivery: "Get it by Tomorrow",
      fastestDelivery: "Express shipping available",
      seller: "Vizzle Lifestyle",
      shipsFrom: "Myntra Warehouse",
      prime: false,
      location: "Mumbai 400001",
    },
    ajio: {
      name: "AJIO",
      domain: "ajio.com",
      navBg: "#2C4152",
      accent: "#2C4152",
      btnPrimary: "bg-[#2C4152] hover:bg-[#1D2C38] text-white",
      btnSecondary: "border border-[#2C4152] bg-white text-[#2C4152] hover:bg-slate-50",
      price: "₹1,899",
      priceNum: "1,899",
      mrp: "₹4,999",
      discount: "62% OFF",
      badge: "AJIO EXCLUSIVE",
      rating: "4.5",
      ratingsCount: "890 ratings",
      boughtPastMonth: "Trending in Western Wear",
      delivery: "Standard Delivery in 2-3 Days",
      fastestDelivery: "Priority delivery available",
      seller: "Trends Collection",
      shipsFrom: "Reliance Retail",
      prime: false,
      location: "Delhi 110001",
    },
    meesho: {
      name: "Meesho",
      domain: "meesho.com",
      navBg: "#FFFFFF",
      accent: "#9B1FE8",
      btnPrimary: "bg-[#9B1FE8] hover:bg-[#8515CB] text-white",
      btnSecondary: "bg-[#F7EEFC] text-[#9B1FE8] hover:bg-[#F0DEFA]",
      price: "₹899",
      priceNum: "899",
      mrp: "₹1,999",
      discount: "55% off",
      badge: "Top Rated Seller",
      rating: "4.2",
      ratingsCount: "12,450 ratings",
      boughtPastMonth: "5,300+ orders completed",
      delivery: "Free Delivery",
      fastestDelivery: "Dispatches in 1 day",
      seller: "Vizzle Direct",
      shipsFrom: "Meesho Logistics",
      prime: false,
      location: "Jaipur 302001",
    },
    nykaa: {
      name: "Nykaa",
      domain: "nykaafashion.com",
      navBg: "#FC2779",
      accent: "#FC2779",
      btnPrimary: "bg-[#FC2779] hover:bg-[#E51767] text-white",
      btnSecondary: "border border-slate-300 bg-white text-slate-800",
      price: "₹2,199",
      priceNum: "2,199",
      mrp: "₹4,500",
      discount: "51% OFF",
      badge: "PRO ENHANCED",
      rating: "4.7",
      ratingsCount: "730 ratings",
      boughtPastMonth: "Luxe Bestseller",
      delivery: "Express Delivery in 24h",
      fastestDelivery: "Same day dispatch",
      seller: "Nykaa Verified",
      shipsFrom: "Nykaa Luxe Hub",
      prime: false,
      location: "Gurugram 122001",
    },
    shopify: {
      name: "Shopify",
      domain: "mystore.myshopify.com",
      navBg: "#1F2937",
      accent: "#5C6AC4",
      btnPrimary: "bg-slate-900 hover:bg-black text-white",
      btnSecondary: "bg-[#5C6AC4] hover:bg-[#4D5AB0] text-white",
      price: "₹2,499",
      priceNum: "2,499.00",
      mrp: "₹4,999",
      discount: "Save 50%",
      badge: "Shop Pay Ready",
      rating: "4.9",
      ratingsCount: "312 reviews",
      boughtPastMonth: "Direct Brand Store",
      delivery: "Ships within 24 hours worldwide",
      fastestDelivery: "Express DHL / Fedex",
      seller: "Official D2C Store",
      shipsFrom: "Flagship Studio",
      prime: false,
      location: "Worldwide",
    },
  };

  const meta = platformMeta[platform] || platformMeta.amazon;

  // Render the core mockup content (shared between inline card and full-screen modal)
  const renderMockup = () => (
    <div className="p-3 sm:p-5 bg-[#EBECEF] flex items-center justify-center min-h-[460px] overflow-hidden rounded-b-2xl">
      <AnimatePresence mode="wait">
        {viewMode === "desktop" ? (
          /* ── WEB VIEW MOCKUP FRAME (Photo 1 reference) ── */
          <motion.div
            key="web-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-white rounded-xl border border-slate-300 shadow-md overflow-hidden flex flex-col"
          >
            {/* macOS Browser Window Titlebar with URL Bar */}
            <div className="bg-[#FAFAFA] px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ED6A5E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5BF4F]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#62C554]" />
              </div>
              <div className="bg-white border border-slate-200/90 rounded-md px-3.5 py-0.5 text-[11px] text-slate-600 font-mono flex items-center gap-1.5 shadow-2xs">
                <Lock size={10} className="text-slate-400" />
                <span>{meta.domain}</span>
              </div>
              <div className="w-8" />
            </div>

            {/* Platform Main Header Bar */}
            {platform === "amazon" ? (
              <>
                {/* Amazon Top Navigation */}
                <div className="bg-[#131921] px-4 py-2 text-white flex items-center justify-between gap-3 text-xs">
                  {/* Amazon Logo */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-0.5 font-black text-lg tracking-tight text-white relative pt-0.5">
                      <span>amazon</span>
                      <span className="text-[10px] text-[#FEBD69] font-normal -ml-0.5">.in</span>
                    </div>

                    <div className="hidden sm:flex flex-col leading-tight text-[11px]">
                      <span className="text-slate-400 text-[10px] flex items-center gap-0.5">
                        <MapPin size={9} /> Deliver to
                      </span>
                      <span className="font-bold text-white leading-none">{meta.location}</span>
                    </div>
                  </div>

                  {/* Amazon Search Bar */}
                  <div className="flex-1 max-w-xl mx-2 flex">
                    <div className="bg-[#E6E6E6] text-slate-700 px-2 py-1 rounded-l text-[11px] font-medium hidden sm:flex items-center gap-0.5 border-r border-slate-300">
                      <span>All</span>
                      <ChevronDown size={11} />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={`Search Amazon.in`}
                      className="w-full bg-white text-slate-800 text-xs px-2.5 py-1 outline-none"
                    />
                    <button className="bg-[#FEBD69] hover:bg-[#F3A847] px-3.5 py-1 rounded-r text-slate-900 flex items-center justify-center">
                      <Search size={14} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Account, Orders, Cart */}
                  <div className="flex items-center gap-3 text-[11px] shrink-0">
                    <div className="hidden md:flex flex-col leading-tight">
                      <span className="text-[10px] text-slate-300">Hello, sign in</span>
                      <span className="font-bold">Account &amp; Lists</span>
                    </div>
                    <div className="hidden md:flex flex-col leading-tight">
                      <span className="text-[10px] text-slate-300">Returns</span>
                      <span className="font-bold">&amp; Orders</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold">
                      <div className="relative">
                        <ShoppingCart size={18} />
                        <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-[#FEBD69] text-black font-extrabold px-1 rounded-full">0</span>
                      </div>
                      <span className="hidden sm:inline">Cart</span>
                    </div>
                  </div>
                </div>

                {/* Amazon Sub-navigation Bar */}
                <div className="bg-[#232F3E] text-white px-4 py-1.5 flex items-center gap-3 text-[11px] font-medium overflow-x-auto whitespace-nowrap">
                  <span className="flex items-center gap-1 font-bold"><Menu size={13} /> All</span>
                  <span>Fresh</span>
                  <span>Sell</span>
                  <span>Bestsellers</span>
                  <span>Mobiles</span>
                  <span>Today's Deals</span>
                  <span>Prime ▾</span>
                  <span>Customer Service</span>
                  <span>Fashion</span>
                  <span>Electronics</span>
                  <span>Home &amp; Kitchen</span>
                </div>

                {/* Amazon Breadcrumb */}
                <div className="px-4 py-1.5 bg-white border-b border-slate-100 text-[10px] text-slate-500 flex items-center gap-1.5 overflow-x-auto">
                  <span>Home &amp; Kitchen</span>
                  <span>›</span>
                  <span>Fashion</span>
                  <span>›</span>
                  <span>Women</span>
                  <span>›</span>
                  <span>Tops, T-Shirts &amp; Shirts</span>
                  <span>›</span>
                  <span>{garmentLabel}</span>
                </div>
              </>
            ) : (
              /* Non-Amazon platform branded header (Flipkart, Myntra, etc.) */
              <div
                className="px-4 py-2.5 flex items-center justify-between text-white"
                style={{ backgroundColor: meta.navBg, color: meta.navBg === "#FFFFFF" ? "#111827" : "#FFFFFF" }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm tracking-tight">{meta.name}</span>
                  <div className="hidden sm:flex items-center gap-1 text-[10px] opacity-80">
                    <MapPin size={10} />
                    <span>Deliver to {meta.location}</span>
                  </div>
                </div>
                <div className="flex-1 max-w-xs mx-4 hidden sm:block">
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      placeholder={`Search on ${meta.name}`}
                      className="w-full bg-white text-slate-800 text-[11px] rounded-lg px-2.5 py-1 pl-7 border border-slate-200 outline-none"
                    />
                    <Search size={11} className="absolute left-2 top-2 text-slate-400" />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold">
                  <span className="hidden sm:inline">Orders</span>
                  <div className="flex items-center gap-1">
                    <ShoppingCart size={14} />
                    <span>Cart</span>
                  </div>
                </div>
              </div>
            )}

            {/* Product Page 3-Column Layout */}
            <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start bg-white">
              {/* Column 1: Thumbnails Strip + Main Image (5 cols) */}
              <div className="lg:col-span-5 flex gap-2.5">
                {/* Vertical Thumbnails */}
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="w-10 h-12 rounded border-2 border-[#E77600] overflow-hidden bg-slate-50 p-0.5 shadow-2xs">
                    <img src={activeImage} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                  {["/catalogue/brand_main.jpg", "/catalogue/lookbook_main.jpg", "/catalogue/social_main.jpg"].map((src, i) => (
                    <div key={i} className="w-10 h-12 rounded border border-slate-200 overflow-hidden bg-slate-50 p-0.5 opacity-70 hover:opacity-100 transition-opacity">
                      <img
                        src={src}
                        alt="thumb"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = activeImage; }}
                      />
                    </div>
                  ))}
                </div>

                {/* Main Product Image Container */}
                <div className="flex-1 aspect-[3/4] rounded-lg overflow-hidden bg-slate-50 border border-slate-200/80 relative flex items-center justify-center group shadow-xs">
                  <img
                    src={activeImage}
                    alt={garmentLabel}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/hero_model_1.jpg";
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded shadow-sm text-slate-500 opacity-80 group-hover:opacity-100">
                    <Maximize2 size={13} />
                  </div>

                  {generating && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                      <Sparkles size={20} className="animate-spin text-blue-400 mb-1" />
                      <span className="text-xs font-bold">Rendering Asset...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Product Title, Rating, Price Block (4 cols) */}
              <div className="lg:col-span-4 flex flex-col">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 bg-[#232F3E] text-white text-[10px] font-bold px-2 py-0.5 rounded self-start mb-1.5">
                  <span className="text-[#FEBD69]">{meta.name === "Amazon" ? "Amazon's" : meta.badge}</span>
                  {meta.name === "Amazon" && <span>Choice</span>}
                  <span className="text-slate-400 font-normal text-[9px] border-l border-slate-600 pl-1.5">in {garmentLabel}</span>
                </div>

                {/* Product Title (Exactly formatted like Photo 1) */}
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  Women Solid Puff Sleeve Peplum Top - Stylish Ruched Square Neck Casual Top for Women
                </h4>

                {/* Brand Store Link */}
                <p className="text-[11px] text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer mt-1">
                  Visit the {meta.seller} Store
                </p>

                {/* Rating Stars & Count */}
                <div className="flex items-center gap-1.5 text-xs mt-1 mb-1">
                  <span className="font-bold text-slate-800">{meta.rating}</span>
                  <div className="flex text-amber-500">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                    <Star size={12} className="text-slate-300" fill="currentColor" />
                  </div>
                  <span className="text-[11px] text-[#007185]">({meta.ratingsCount})</span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-[#007185] mb-2">
                  <span className="flex items-center gap-1 cursor-pointer"><Share2 size={10} /> Share</span>
                  <span className="flex items-center gap-1 cursor-pointer"><Heart size={10} /> Add to Wish List</span>
                </div>

                <p className="text-[11px] text-slate-600 font-medium mb-2 pb-2 border-b border-slate-100">
                  {meta.boughtPastMonth}
                </p>

                {/* Price block */}
                <div className="mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-rose-600 font-light text-lg">{meta.discount}</span>
                    <span className="text-2xl font-bold text-slate-900">
                      ₹{meta.priceNum.split(".")[0]}
                      <span className="text-xs align-super">00</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    M.R.P.: <span className="line-through">{meta.mrp}</span> · <span className="text-slate-400">Inclusive of all taxes</span>
                  </p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    EMI starts at <strong>₹167</strong>. No Cost EMI available. <span className="text-[#007185] cursor-pointer">EMI options</span>
                  </p>
                </div>

                {/* Applicable Offers Box */}
                <div className="bg-[#F8F9FA] border border-slate-200/80 rounded-lg p-2 text-[10px] text-slate-700 mt-1">
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <Sparkles size={11} className="text-[#E77600]" /> Applicable Offers
                  </p>
                  <p className="text-slate-500 mt-0.5">Bank Offer: Flat ₹100 instant discount on HDFC Cards</p>
                </div>
              </div>

              {/* Column 3: Buy Box (3 cols) */}
              <div className="lg:col-span-3 border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs flex flex-col gap-2">
                <div className="text-xl font-bold text-slate-900">{meta.price}</div>
                <div className="text-[11px] text-slate-700 leading-tight">
                  <span className="text-[#007185] font-semibold">FREE delivery</span> <strong>{meta.delivery}</strong>
                  <p className="text-[10px] text-slate-500 mt-0.5">{meta.fastestDelivery}</p>
                </div>

                <div className="text-xs font-bold text-emerald-700">
                  In stock
                </div>

                {/* Quantity Dropdown */}
                <div className="flex items-center gap-2 text-[11px] bg-slate-50 border border-slate-300 rounded-lg px-2 py-1">
                  <span className="text-slate-500">Quantity:</span>
                  <select className="bg-transparent font-bold outline-none cursor-pointer">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  className={`w-full py-2 px-3 font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer ${meta.btnPrimary}`}
                >
                  Add to Cart
                </button>

                {/* Buy Now Button */}
                <button
                  type="button"
                  className={`w-full py-2 px-3 font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer ${meta.btnSecondary}`}
                >
                  Buy Now
                </button>

                {/* Add to List Button */}
                <button
                  type="button"
                  className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  Add to List
                </button>

                <div className="text-[10px] text-slate-500 border-t border-slate-100 pt-2 space-y-0.5">
                  <p className="flex justify-between"><span>Sold by</span> <strong className="text-slate-700">{meta.seller}</strong></p>
                  <p className="flex justify-between"><span>Ships from</span> <strong className="text-slate-700">{meta.shipsFrom}</strong></p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── MOBILE VIEW MOCKUP FRAME (Photo 2 reference) ── */
          <motion.div
            key="mobile-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[340px] bg-black rounded-[42px] p-2.5 shadow-2xl border-4 border-slate-800 flex flex-col"
          >
            {/* Phone Speaker Slit */}
            <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-1.5" />

            {/* Inner Phone Screen Container */}
            <div className="relative bg-white rounded-[32px] overflow-hidden flex flex-col">
              {/* Phone Status Bar */}
              <div className="bg-black px-6 py-1 flex items-center justify-between text-white text-[10px] font-bold">
                <span>9:41</span>
                <div className="w-14 h-3 bg-slate-900 rounded-full" />
                <span>5G 100%</span>
              </div>

              {platform === "amazon" ? (
                /* Authentic Amazon Mobile Header (from Photo 2) */
                <div className="flex flex-col bg-[#131921] text-white">
                  {/* Top Bar: Hamburger, Logo, Sign in, Cart */}
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Menu size={18} className="cursor-pointer" />
                      <div className="font-black text-sm tracking-tight text-white flex items-center">
                        <span>amazon</span>
                        <span className="text-[9px] text-[#FEBD69] font-normal">.in</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-300 font-medium">Sign in &gt;</span>
                      <ShoppingCart size={17} />
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="px-3 pb-2">
                    <div className="flex bg-white rounded-md overflow-hidden">
                      <input
                        type="text"
                        readOnly
                        placeholder="Search Amazon.in"
                        className="w-full text-slate-800 text-xs px-3 py-1.5 outline-none"
                      />
                      <button className="bg-[#FEBD69] px-3.5 flex items-center justify-center text-slate-900">
                        <Search size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Delivering Location Bar */}
                  <div className="bg-[#232F3E] px-3.5 py-1.5 flex items-center gap-1.5 text-[11px] text-slate-300 border-t border-slate-700/60">
                    <MapPin size={11} className="text-slate-400" />
                    <span>Delivering to {meta.location} - </span>
                    <span className="text-[#00a8ca] font-semibold cursor-pointer">Update location</span>
                  </div>
                </div>
              ) : (
                /* Non-Amazon platform mobile header */
                <div
                  className="px-3.5 py-2.5 flex items-center justify-between"
                  style={{ backgroundColor: meta.navBg, color: meta.navBg === "#FFFFFF" ? "#111827" : "#FFFFFF" }}
                >
                  <span className="font-extrabold text-xs">{meta.name}</span>
                  <div className="flex items-center gap-2.5">
                    <Share2 size={14} />
                    <Heart size={14} />
                    <ShoppingBag size={14} />
                  </div>
                </div>
              )}

              {/* Mobile Full-width Model Photo (Photo 2) */}
              <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden">
                <img
                  src={activeImage}
                  alt={garmentLabel}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/hero_model_1.jpg";
                  }}
                />

                {/* Floating Wishlist Button */}
                <button className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-slate-700">
                  <Heart size={13} />
                </button>

                {/* Floating Badge */}
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  {meta.badge}
                </div>
              </div>

              {/* Mobile Product Summary & Buy Box */}
              <div className="p-3 bg-white flex flex-col">
                <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  Women Solid {garmentLabel} - Stylish Ruched Square Neck Casual Top for Women
                </h5>

                <div className="flex items-center gap-1.5 my-1">
                  <span className="text-sm font-bold text-rose-600">{meta.discount}</span>
                  <span className="text-base font-black text-slate-900">{meta.price}</span>
                  <span className="text-[11px] text-slate-400 line-through">{meta.mrp}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-600 mb-2">
                  <Truck size={11} className="text-blue-600" />
                  <span>{meta.delivery}</span>
                </div>

                {/* Mobile Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <button className={`py-2 rounded-lg font-bold text-[11px] shadow-xs ${meta.btnPrimary}`}>
                    Add to Cart
                  </button>
                  <button className={`py-2 rounded-lg font-bold text-[11px] shadow-xs ${meta.btnSecondary}`}>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* ── Main Inline Container (Beside Publishing Platform) ── */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden flex flex-col">
        {/* Top Header & Viewport Mode Toggles (Photo 1 & 2 match) */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer">
              <ArrowLeft size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Live Platform Preview
              </h3>
              <p className="text-xs text-slate-500">
                Framed {meta.name} marketplace preview for your generated catalogue output.
              </p>
            </div>
          </div>

          {/* Mode Toggles: Web View and Mobile View */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("desktop")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "desktop"
                  ? "bg-[#E5484D] text-white shadow-xs"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Monitor size={14} />
              <span>Web View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "mobile"
                  ? "bg-[#E5484D] text-white shadow-xs"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Smartphone size={14} />
              <span>Mobile View</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              title="Expand Preview"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* Mockup Canvas */}
        {renderMockup()}
      </div>

      {/* ── Fullscreen Overlay Modal (matches full preview on app.aivastra.com) ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm p-4 sm:p-8 flex flex-col items-center justify-center overflow-y-auto"
          >
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
              {/* Fullscreen Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Live Platform Preview
                    </h3>
                    <p className="text-xs text-slate-500">
                      Framed {meta.name} marketplace preview for your generated catalogue output.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("desktop")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === "desktop"
                        ? "bg-[#E5484D] text-white shadow-xs"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Monitor size={14} />
                    <span>Web View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("mobile")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === "mobile"
                        ? "bg-[#E5484D] text-white shadow-xs"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Smartphone size={14} />
                    <span>Mobile View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Fullscreen Body */}
              <div className="overflow-y-auto flex-1">
                {renderMockup()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
