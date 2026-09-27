export const shopifyDocsContent = [
  {
    id: 'account-setup',
    title: 'Account Setup',
    description: '',
    content: `
# Shopify Integration - Part 1: Account Setup

Welcome! This guide will walk you through integrating Vizzle Virtual Try-On with your Shopify store. We'll break this into simple steps so you can't get lost.

---

## What We'll Do in This Part
Create your Vizzle account and get started for free.

---

## Step 1: Create Your Vizzle Account

1. Go to **Vizzle** at [vizzle.in](https://www.vizzle.in)
2. Click **Sign Up** or **Get Started**
3. Enter your email address and create a password
4. Verify your email (check your inbox for a confirmation email)

> **Important:** Keep your **Vizzle Dashboard** and **Shopify Admin** open side by side in separate browser tabs throughout this setup process. You'll need to switch between them.

> **Tip:** Use an email you check regularly - you'll receive important updates and notifications here.

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
# Shopify Integration - Part 2: Configure Your Store

> **Important:** This step happens in the **Vizzle Dashboard** at [vizzle.in/dashboard](https://www.vizzle.in/dashboard). Keep both Vizzle Dashboard and Shopify Admin open side by side.

---

## What We'll Do in This Part
Add your store to Vizzle and create API credentials that connect your Shopify store to Vizzle.

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
| **Store URL** | Your Shopify website address | "https://myfashionstore.myshopify.com" |
| **Platform** | Select **Shopify** | Shopify |
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

> **Tip:** Keep this browser tab open. You'll paste this value into Shopify in Part 3.

---

## What's Next?

Your store is now configured in Vizzle with API credentials ready. Let's move to **Part 3: Install & Connect App** where you'll connect everything together.
    `
  },
  {
    id: 'install-connect',
    title: 'Install & Connect App',
    description: '',
    content: `
# Shopify Integration - Part 3: Install & Connect App

> **Important:** This step happens in **Shopify Admin** (your Shopify dashboard). You should have two tabs open: one for Vizzle Dashboard, one for Shopify.

---

## What We'll Do in This Part
Install the custom Vizzle app extension on your Shopify store, connect it using your API Key, and export your products.

---

## Step 1: Request the Custom Installation Link

With a **Custom Distribution**, the Vizzle app does not appear in the public Shopify App Store.

Instead, you must use a unique, single-use installation link generated specifically for your store.
1. Contact the Vizzle support team or your account manager.
2. Provide them with your exact Shopify store URL (e.g., \`https://[store-name].myshopify.com\`).
3. They will generate and send you a secure Custom Installation Link.

---

## Step 2: Install the Vizzle App

1. Click the custom installation link provided to you.
2. You will be redirected to your Shopify Admin.
3. Review the permissions the app requires.
4. Click **Install app** to confirm.
5. Wait for the installation to complete.

---

## Step 3: Find the Vizzle Settings Page

After installation, you'll be redirected to the Vizzle app in your Shopify admin:

1. In Shopify sidebar, go to **Apps** section
2. Find **vizzle-try-on-widget**
3. Click to open the app settings

---

## Step 4: Configure API Settings

> **Where to find this?** Go to **Vizzle Dashboard** → **Integration** → **API Keys**

1. Paste your **Vizzle API Key** into the input field.
2. Ensure the **API Endpoint** is set to \`https://dashboard.vizzle.in/api/v1\`
3. Click **Save Settings**.

---

## Step 5: Export Your Products

Vizzle needs to know your Shopify products to work.

1. In the Vizzle app settings, scroll down to **Export Products to Vizzle**.
2. Click **Generate Product JSON**.
3. A file containing your catalog will be downloaded. You will need this for Part 4.

---

## Step 6: Add the Widget to Your Store

To display the virtual try-on button, you must add the widget block to your product template:

1. Go to your **Online Store** > **Themes**.
2. Click **Customize** on your current theme.
3. At the top, switch the page template to **Products** > **Default product**.
4. On the left sidebar, under **Product Information**, click **Add block**.
5. Select the **Virtual Try-On** block and hit **Save**!

---

## What's Next?

Your Shopify store is now connected to Vizzle, and you have exported your products. Let's move to **Part 4: Import Products & Start**.
    `
  },
  {
    id: 'select-products',
    title: 'Import Products & Start',
    description: '',
    content: `
# Shopify Integration - Part 4: Import Products & Start

> **Important:** This step happens in the **Vizzle Dashboard**. Go to [vizzle.in/dashboard](https://www.vizzle.in/dashboard) to access your products.

---

## What We'll Do in This Part
Import the products you exported from Shopify into your Vizzle catalog so they can be enabled for virtual try-on.

---

## Step 1: Go to Products in Vizzle Dashboard

1. Log in to the **Vizzle Dashboard**.
2. Click on **Products** in the left sidebar menu.

---

## Step 2: Import Your Bulk JSON File

1. Click the blue **+ Add Product** button in the top right corner.
2. In the Add Product window, select the **Bulk JSON** tab.
3. Upload the JSON file you downloaded from Shopify in Part 3.
4. Click **Save Product** or **Upload**.

Your Shopify products will now appear in your Vizzle catalog!

---

## Step 3: Select Products for Virtual Try-On

1. Browse through your imported product list.
2. Ensure the products you want to feature are correctly set up and active.

---

## Step 4: Test the Integration

1. Visit an enabled product page on your live Shopify store.
2. You should now see the Vizzle Virtual Try-On button.
3. Click it and test the feature by uploading a photo.

---

## You're All Set!

Your Shopify store now has Virtual Try-On powered by Vizzle. Here's a quick recap:

| Done | What Was Completed |
|------|-------------------|
| 1 | Created Vizzle account |
| 2 | Added store & generated API key |
| 3 | Installed Shopify custom app, connected API key, & exported products |
| 4 | Imported products into Vizzle via Bulk JSON |

---

## Need Help?

- **Documentation:** Check our Help Center for FAQs
- **Issues?** Contact support via Vizzle Dashboard
- **Custom Integration?** See our [Custom API Guide](/docs?tab=custom)
    `
  }
];
