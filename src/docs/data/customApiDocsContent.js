export const customApiDocsContent = [
  {
    id: 'account-setup',
    title: 'Account Setup',
    description: '',
    content: `
# Custom API Integration - Part 1: Account Setup

Welcome! This guide walks you through integrating Vizzle Virtual Try-On into any custom storefront using our REST API. We'll break this into simple steps so you can't get lost.

---

## What We'll Do in This Part
Create your Vizzle account and get your API key.

---

## Step 1: Create Your Vizzle Account

1. Go to **Vizzle** at [dashboard.vizzle.in](https://dashboard.vizzle.in/dashboard)
2. Click **Sign Up** or **Get Started**
3. Enter your email address and create a password
4. Verify your email (check your inbox for a confirmation email)

> **Important:** Keep your **Vizzle Dashboard** open in a browser tab throughout this setup. You'll need your API key for every request.

> **Tip:** Use an email you check regularly — you'll receive important updates and notifications here.

---

## Step 2: Top Up with a Credit Pack

To start running Virtual Try-Ons, top up your store wallet with a prepaid credit pack. Credits are deducted only for successful Try-Ons.

| Pack | Price | Try-Ons | Rate per Try-On |
|------|-------|---------|----------------|
| **Starter** | ₹1,000 | 160 Try-Ons | ₹6.25 |
| **Growth** ⭐ Best Value | ₹2,500 | 450 Try-Ons | ₹5.56 |
| **Pro** | ₹5,000 | 960 Try-Ons | ₹5.21 |
| **Enterprise** | ₹10,000 | 2,000 Try-Ons | ₹5.00 |

1. Log in to your **Vizzle Dashboard** at [dashboard.vizzle.in](https://dashboard.vizzle.in).
2. Go to **Billing** and select a prepaid credit pack that suits your volume.
3. Pay via Razorpay (UPI, cards, net banking). Packs never expire.

> **Tip:** Photo uploads and AI safety moderation rejections are completely free of charge!

---

## What's Next?

Now that your account is ready, let's move to **Part 2: Get Your API Key** where you'll create a store and copy your credentials.
    `
  },
  {
    id: 'get-api-key',
    title: 'Get Your API Key',
    description: '',
    content: `
# Custom API Integration - Part 2: Get Your API Key

> **Important:** This step happens in the **Vizzle Dashboard** at [dashboard.vizzle.in](https://dashboard.vizzle.in). Keep your dashboard open while you build your integration.

---

## What We'll Do in This Part
Create a store in Vizzle and copy the \`vzk_…\` API key shown once.

---

## Step 1: Access the Store Dashboard

1. Log in to your **Vizzle account** at [dashboard.vizzle.in](https://dashboard.vizzle.in)
2. Look for **Dashboard** or **My Stores** in the navigation menu
3. Click on **Add Store** or **Create Store**

---

## Step 2: Add Your Store Details

Fill in your store information:

| Field | What to Enter | Example |
|-------|--------------|---------|
| **Store Name** | Your brand/store name | "My Fashion Store" |
| **Store URL** | Your website address | "https://myfashionstore.com" |
| **Platform** | Select **Custom** or **Other** | Custom |
| **Description** | Brief description (optional) | "Headless storefront" |

Click **Save** or **Create Store** to proceed.

---

## Step 3: Copy Your API Key

1. After creating your store, go to **Integration** in the sidebar
2. Your **API Key** is shown once — copy it immediately

\`\`\`
x-api-key: vzk_YOUR_KEY
\`\`\`

> **Important:** Keep your API Key secure and do not share it publicly. You'll send it as the \`x-api-key\` header on every API request.

> **Tip:** All API requests use the base URL \`https://dashboard.vizzle.in\`.

---

## What's Next?

Your store is configured and your API key is ready. Let's move to **Part 3: Upload Garments** where you'll add products to your Vizzle catalog.
    `
  },
  {
    id: 'upload-garments',
    title: 'Upload Garments',
    description: '',
    content: `
# Custom API Integration - Part 3: Upload Garments

> **Important:** This step happens in the **Vizzle Dashboard** at [dashboard.vizzle.in](https://dashboard.vizzle.in).

---

## What We'll Do in This Part
Add products to Vizzle and note each \`product_id\` (your SKU) for use in try-on requests.

---

## Step 1: Go to Products in Vizzle Dashboard

1. Log in to the **Vizzle Dashboard**
2. Click on **Products** in the left sidebar menu

---

## Step 2: Add Your Garments

1. Click the blue **+ Add Product** button in the top right corner
2. Upload product images and fill in the product details
3. Set the **Product ID / SKU** — this is the value you'll pass as \`product_id\` in API calls

| Field | What to Enter | Example |
|-------|--------------|---------|
| **Product ID / SKU** | Your unique product identifier | \`SUMMER-DRESS-001\` |
| **Product Name** | Display name | "Floral Summer Dress" |
| **Image** | Garment photo for try-on | High-quality front-facing photo |

---

## Step 3: Note Your Product IDs

Keep a list of SKUs you'll use in your widget:

\`\`\`
product_id: PRODUCT_SKU
\`\`\`

> **Tip:** The \`product_id\` in your try-on request must match a product you've uploaded in the Vizzle Dashboard.

---

## What's Next?

Your garments are in Vizzle. Let's move to **Part 4: Integrate the API** where you'll wire up the two API calls in your storefront widget.
    `
  },
  {
    id: 'integrate-api',
    title: 'Integrate the API',
    description: '',
    content: `
# Custom API Integration - Part 4: Integrate the API

Drop the try-on widget into any site in minutes with **2 API calls**.

---

## What We'll Do in This Part
Call \`POST /api/v1/upload\` with the shopper photo, then \`POST /api/v1/tryon\` with the URL + SKU, and show the returned \`output_url\` in an \`<img>\`.

---

## API Flow at a Glance

| Step | Endpoint | What It Does | Response |
|------|----------|--------------|----------|
| ① | \`POST /api/v1/upload\` | Upload shopper photo (multipart) | \`{ "url": "https://..." }\` |
| ② | \`POST /api/v1/tryon\` | Run virtual try-on (waits 30–90 s) | \`{ "output_url": "https://..." }\` |

**Auth header (both calls):** \`x-api-key: vzk_YOUR_KEY\`

> **Note:** The server waits for the ML model (30–90 s typical). Shopper photos and results are auto-deleted after 1 hour.

---

## cURL Example

\`\`\`bash
# 1. Upload shopper photo → get a URL
curl -X POST https://dashboard.vizzle.in/api/v1/upload \\
  -H "x-api-key: vzk_YOUR_KEY" \\
  -F "photo=@shopper.jpg"
# → { "url": "https://cdn.vizzle.in/vizzle/..." }

# 2. Run try-on → get result image URL (waits 30–90 s)
curl -X POST https://dashboard.vizzle.in/api/v1/tryon \\
  -H "x-api-key: vzk_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"product_id":"PRODUCT_SKU","user_photo_url":"<url from step 1>"}'
# → { "output_url": "https://cdn.vizzle.in/vizzle/...", "prediction_id": "abc123" }
\`\`\`

---

## JavaScript Example

\`\`\`javascript
async function tryon(file) {
  // 1. Upload shopper photo
  const form = new FormData();
  form.append("photo", file);
  const { url } = await fetch("https://dashboard.vizzle.in/api/v1/upload", {
    method: "POST",
    headers: { "x-api-key": "vzk_YOUR_KEY" },
    body: form,
  }).then(r => r.json());

  // 2. Run try-on (server waits for the model, ~30–90 s)
  const { output_url } = await fetch("https://dashboard.vizzle.in/api/v1/tryon", {
    method: "POST",
    headers: {
      "x-api-key": "vzk_YOUR_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: "PRODUCT_SKU",
      user_photo_url: url,
    }),
  }).then(r => r.json());

  return output_url; // set as <img src={output_url} />
}
\`\`\`

---

## Step 1: Upload the Shopper Photo

1. Collect a photo from the shopper (file input or camera)
2. Send it as multipart form data to \`/api/v1/upload\`
3. Save the returned \`url\` for the next call

---

## Step 2: Run Virtual Try-On

1. Send a JSON body with \`product_id\` and \`user_photo_url\` to \`/api/v1/tryon\`
2. Wait for the response (30–90 seconds)
3. Display \`output_url\` as your result image

---

## Step 3: Show the Result

Set the returned URL on an image element in your UI:

\`\`\`html
<img src="https://cdn.vizzle.in/vizzle/..." alt="Virtual try-on result" />
\`\`\`

---

## You're All Set!

Your custom storefront can now offer Virtual Try-On powered by Vizzle. Here's a quick recap:

| Done | What Was Completed |
|------|-------------------|
| 1 | Created Vizzle account |
| 2 | Created store & copied API key (\`vzk_…\`) |
| 3 | Uploaded garments & noted \`product_id\` SKUs |
| 4 | Wired up upload + try-on API calls in your widget |

---

## Need Help?

- **Full API Reference:** Open the Vizzle Dashboard integration guide for live snippets with your store's API key
- **Issues?** Contact support via Vizzle Dashboard
- **WordPress or Shopify?** See our [WordPress](/docs?tab=wordpress) or [Shopify](/docs?tab=shopify) guides
    `
  }
];
