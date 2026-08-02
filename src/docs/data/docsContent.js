export const docsContent = [
  {
    id: 'account-setup',
    title: 'Account Setup',
    description: '',
    content: `
# WordPress Integration - Part 1: Account Setup

Welcome! This guide will walk you through integrating Vizzle Virtual Try-On with your WordPress store. We'll break this into simple steps so you can't get lost.

---

## What We'll Do in This Part
Create your Vizzle account and get started for free.

---

## Step 1: Create Your Vizzle Account

1. Go to **Vizzle** at [vizzle.in](https://www.vizzle.in)
2. Click **Sign Up** or **Get Started**
3. Enter your email address and create a password
4. Verify your email (check your inbox for a confirmation email)

> **Important:** Keep your **Vizzle Dashboard** and **WordPress Admin** open side by side in separate browser tabs throughout this setup process. You'll need to switch between them.

> **Tip:** Use an email you check regularly - you'll receive important updates and notifications here.

---

## Step 2: One-Time Setup & Store Activation

To start using Vizzle Virtual Try-On, stores must first complete a **One-Time Setup Plan** to activate their storefront and set API rate limits.

1. Log in to your **Vizzle Dashboard** at [dashboard.vizzle.in](https://dashboard.vizzle.in).
2. Go to **Billing** and select your store's One-Time Setup Plan (**Basic ₹2,000** for 100 req/hr up to **Premium ₹15,000** for 1,500 req/hr).
3. Once activated, top up your store wallet with prepaid credits to start generating (**₹2.50 per Try-On** and **₹5.00 per AI Video**).

> **Tip:** Photo uploads and AI safety moderation checks are completely free!

---

## What's Next?

Now that your account is ready, let's move to **Part 2: Configure Your Store** where you'll add your store to Vizzle and get your API credentials.
    `
  },
  {
    id: 'configure-store',
    title: 'Configure Your Store',
    description: '',
    content: `
# WordPress Integration - Part 2: Configure Your Store

> **Important:** This step happens in the **Vizzle Dashboard** at [vizzle.in/dashboard](https://www.vizzle.in/dashboard). Keep both Vizzle Dashboard and WordPress Admin open side by side.

---

## What We'll Do in This Part
Add your store to Vizzle and create API credentials that connect your WordPress site to Vizzle.

---

## Step 1: Access the Store Dashboard

1. Log in to your **Vizzle account** at [vizzle.in/dashboard](https://www.vizzle.in/dashboard)
2. Look for **Dashboard** or **My Stores** in the navigation menu
3. Click on **Add Store** or **Create Store**

---

## Step 2: Add Your Store Details

Fill in your store information:

| Field | What to Enter | Example |
|-------|--------------|---------|
| **Store Name** | Your brand/store name | "My Fashion Store" |
| **Store URL** | Your website address | "https://myfashionstore.com" |
| **Platform** | Select **WordPress** | WordPress |
| **Description** | Brief description (optional) | "Online clothing boutique" |

Click **Save** or **Create Store** to proceed.

---

## Step 3: Go to Integration Section

1. In the **Vizzle Dashboard**, look for **Integration** in the sidebar navigation
2. Click on **API Keys** to access your credentials

---

## Step 4: Access Your API Key

1. Click **Generate API Key** or **Create New Key** (if you don't have one)
2. You'll see your **API Key**.

> **Important:** Keep your API Key secure and do not share it publicly.

---

## Step 5: Copy Your API Key

You'll need this value for the next part:

\`\`\`
API Key:    vizl_live_xxxxxxxxxxxxxxxxxxxx
\`\`\`

> **Tip:** Keep this browser tab open. You'll paste this value into WordPress in Part 3.

---

## What's Next?

Your store is now configured in Vizzle with API credentials ready. Let's move to **Part 3: Install the WordPress Plugin** where you'll connect everything together.
    `
  },
  {
    id: 'install-plugin',
    title: 'Install & Connect Plugin',
    description: '',
    content: `
# WordPress Integration - Part 3: Install & Connect Plugin

> **Important:** This step happens in **WordPress Admin** (your website dashboard). You should have two tabs open: one for Vizzle Dashboard, one for WordPress.

---

## What We'll Do in This Part
Install the Vizzle plugin on your WordPress site, connect it using your API Key, and export your products.

---

## Step 1: Install the Vizzle Plugin

### Option A: From WordPress Plugin Directory (Recommended)

1. Log in to your **WordPress Admin** (yourwebsite.com/wp-admin)
2. Go to **Plugins** → **Add New**
3. In the search box, type **"Vizzle"**
4. Find the plugin in results and click **Install Now**
5. After installation, click **Activate**

### Option B: Manual Upload (If not in directory)

1. Download the [Vizzle plugin ZIP file](/vizzle-woocommerce.zip)
2. Go to **Plugins** → **Add New** → **Upload Plugin**
3. Click **Choose File** and select the ZIP file
4. Click **Install Now**
5. After installation, click **Activate**

---

## Step 2: Find the Vizzle Settings Page

After activation, you can find the settings page here:

1. In WordPress sidebar, look for **Vizzle Try-On**
2. Click on it to open the **Vizzle Virtual Try-On Configuration**

---

## Step 3: Enter Your API Credentials

> **Where to find this?** Go to **Vizzle Dashboard** → **Integration** → **API Keys**

1. In the API Configuration section, paste your **API Key**.
2. Make sure the **API Endpoint URL** is set correctly (e.g., \`https://dashboard.vizzle.in/api/v1/products\`).
3. (Optional) Customize the **Button Color** to match your store's theme.
4. Click **Save Changes**.

---

## Step 4: Export Your Products

Vizzle needs to know your WooCommerce products to enable virtual try-on.

1. Scroll down to the **Bulk JSON Export** section on the same settings page.
2. Click **Download Products JSON**.
3. A JSON file containing your product catalog will be downloaded to your computer. Keep this file handy!

---

## What's Next?

Your WordPress site is now connected to Vizzle, and you have exported your products. Let's move to **Part 4: Import Products & Start**.
    `
  },
  {
    id: 'sync-products',
    title: 'Import Products & Start',
    description: '',
    content: `
# WordPress Integration - Part 4: Import Products & Start

> **Important:** This step happens in the **Vizzle Dashboard** at [vizzle.in/dashboard](https://www.vizzle.in/dashboard).

---

## What We'll Do in This Part
Import the products you exported from WooCommerce into your Vizzle catalog so they can be enabled for virtual try-on.

---

## Step 1: Go to Products in Vizzle Dashboard

1. Log in to the **Vizzle Dashboard**.
2. Click on **Products** in the left sidebar menu.

---

## Step 2: Import Your Bulk JSON File

1. Click the blue **+ Add Product** button in the top right corner.
2. In the Add Product window, select the **Bulk JSON** tab.
3. Upload the JSON file you downloaded from WordPress in Part 3.
4. Click **Save Product** or **Upload**.

Your WooCommerce products will now appear in your Vizzle catalog!

---

## Step 3: Select Products for Virtual Try-On

1. Browse through your imported product list.
2. Ensure the products you want to feature are correctly set up and active.

---

## Step 4: Test the Integration

1. Visit an enabled product page on your live WooCommerce store.
2. You should now see the Vizzle Virtual Try-On button.
3. Click it and test the feature by uploading a photo.

---

## You're All Set!

Your WordPress store now has Virtual Try-On powered by Vizzle. Here's a quick recap:

| Done | What Was Completed |
|------|-------------------|
| 1 | Created Vizzle account |
| 2 | Added store & generated API key |
| 3 | Installed WordPress plugin, entered API key, & exported products |
| 4 | Imported products into Vizzle via Bulk JSON |

---

## Need Help?

- **Documentation:** Check our Help Center for FAQs
- **Issues?** Contact support via Vizzle Dashboard
- **Custom Integration?** See our [Custom API Guide](/docs?tab=custom)
    `
  }
];
