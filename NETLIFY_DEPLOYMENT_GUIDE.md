# Hunter App - Netlify Deployment Guide

This guide describes how to deploy the **Hunter Web Application** to Netlify and ensure that Google Firebase, WhatsApp order routing, and the database operate flawlessly.

---

## 🚀 Part 1: Quick Netlify Setup (2 Minutes)

1. **Log in to Netlify:**
   Connect to your [Netlify Dashboard](https://app.netlify.com/).

2. **Add New Site:**
   - Click **Add new site** -> **Import an existing project**.
   - Choose your Git provider (GitHub, GitLab, or Bitbucket) and authorize it.
   - Select your project repository (`hunter` or your custom repository name).

3. **Configure Build Settings:**
   Netlify will automatically detect the `netlify.toml` file we provided!
   Just double-check that the settings match:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. **Deploy Site:**
   Click **Deploy [Your Repository]**.

---

## 🔑 Part 2: Automating Firebase Connection on Netlify

To ensure authentication, database, and loyalty systems load correctly, you must supply your Firebase credentials to Netlify. 

We have automated this process. Copy the block of pre-populated environment variables below and paste them into Netlify.

### Option A: Bulk Paste (Recommended / Fastest)
1. Go to your site dashboard on Netlify.
2. Select **Site configuration** -> **Environment variables**.
3. Under **Environment variables**, click the **Import from .env** or **Bulk Edit** button (usually select "Import from .env" or paste multiple variables).
4. Copy and paste the entire block below:

```text
VITE_FIREBASE_API_KEY=AIzaSyDdc04SZni0_5ky3uCq6iRotgwW3entl10
VITE_FIREBASE_AUTH_DOMAIN=summer-artifact-7h7sp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=summer-artifact-7h7sp
VITE_FIREBASE_STORAGE_BUCKET=summer-artifact-7h7sp.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=268770079984
VITE_FIREBASE_APP_ID=1:268770079984:web:cfcd63d3fe2f019fb0be35
VITE_FIREBASE_FIRESTORE_DATABASE_ID=ai-studio-8b470f7b-4cd7-464f-a400-7881dc49bb72
VITE_FIREBASE_MEASUREMENT_ID=
```

---

### Option B: Adding Variables Individually
If you prefer adding them one by one, click **Add variable** for each of the following keys:

| Variable Name | Value |
| :--- | :--- |
| **`VITE_FIREBASE_API_KEY`** | `AIzaSyDdc04SZni0_5ky3uCq6iRotgwW3entl10` |
| **`VITE_FIREBASE_AUTH_DOMAIN`** | `summer-artifact-7h7sp.firebaseapp.com` |
| **`VITE_FIREBASE_PROJECT_ID`** | `summer-artifact-7h7sp` |
| **`VITE_FIREBASE_STORAGE_BUCKET`** | `summer-artifact-7h7sp.firebasestorage.app` |
| **`VITE_FIREBASE_MESSAGING_SENDER_ID`** | `268770079984` |
| **`VITE_FIREBASE_APP_ID`** | `1:268770079984:web:cfcd63d3fe2f019fb0be35` |
| **`VITE_FIREBASE_FIRESTORE_DATABASE_ID`** | `ai-studio-8b470f7b-4cd7-464f-a400-7881dc49bb72` |
| **`VITE_FIREBASE_MEASUREMENT_ID`** | *(Leave blank if empty)* |

---

## 🔒 Part 3: Allowlist Netlify URL in Google Firebase (IMPORTANT)

For user Authentication/Login with Google to work correctly on Netlify, you must allowlist your live Netlify URL inside your Firebase Console:

1. Copy your live Netlify site URL (e.g., `https://your-site-name.netlify.app`).
2. Open your [Firebase Console](https://console.firebase.google.com/).
3. Select your project **`summer-artifact-7h7sp`**.
4. Go to **Authentication** (in the left-hand menu) -> **Settings** tab.
5. In the authorized domains list, click **Add Domain**.
6. Paste your Netlify URL (excluding the leading `https://` and trailing `/`, for example: `your-site-name.netlify.app`).
7. Click **Save**.

Your application is now fully automated, secured, and ready for global production on Netlify! 🚀
