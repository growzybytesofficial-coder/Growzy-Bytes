# 🚀 GROWZYBYTES - Hostinger MySQL & Deployment Guide

This guide walks you through migrating and deploying **GROWZYBYTES** on **Hostinger** (hPanel or cPanel) with **MySQL 8** and **Prisma ORM**.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: Create MySQL Database on Hostinger](#step-1-create-mysql-database-on-hostinger)
3. [Step 2: Environment Configuration](#step-2-environment-configuration)
4. [Step 3: Upload Application Files](#step-3-upload-application-files)
5. [Step 4: Set Up Node.js App in Hostinger hPanel](#step-4-set-up-nodejs-app-in-hostinger-hpanel)
6. [Step 5: Run Database Migrations & Seed Data](#step-5-run-database-migrations--seed-data)
7. [Step 6: Build & Launch Production App](#step-6-build--launch-production-app)
8. [Prisma Commands Reference](#prisma-commands-reference)
9. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## 1. Prerequisites
- **Hostinger Account** (Business Web Hosting or VPS with Node.js support).
- **MySQL Database** access in Hostinger hPanel.
- **SSH Access** or **Terminal Access** enabled in Hostinger hPanel -> Advanced -> SSH Access.
- Node.js **v18.x or v20.x** installed on your server environment.

---

## Step 1: Create MySQL Database on Hostinger

1. Log into your **Hostinger hPanel**.
2. Navigate to **Databases** -> **Management** (or **MySQL Databases**).
3. Create a new MySQL Database (or use your existing database as shown in hPanel):
   - **Database Name:** `u168528234_Jagat_2011`
   - **MySQL Username:** `u168528234_Jagat_2011`
   - **Website:** `growzybytes.com`
   - **Password:** The password you assigned during creation in Hostinger hPanel
4. Note down your Database Name, Username, Host (`localhost` or `127.0.0.1`), Port (`3306`), and Password.

---

## Step 2: Environment Configuration

Create a `.env` file in the root directory of your application on the server (or copy from `.env.example`):

```env
# ==========================================
# HOSTINGER DATABASE CONFIGURATION
# ==========================================
# Format: mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="mysql://u168528234_Jagat_2011:YOUR_DATABASE_PASSWORD@localhost:3306/u168528234_Jagat_2011"

# ==========================================
# APPLICATION & SECURITY
# ==========================================
PORT=3000
NODE_ENV=production
JWT_SECRET="growzybytes_super_secret_jwt_key_2026"

# ==========================================
# DEFAULT ADMIN CREDENTIALS
# ==========================================
ADMIN_NAME="Bhupendra"
ADMIN_EMAIL="Bhupendra8171121943@gmail.com"
ADMIN_PASSWORD="Druhi@2011"

# ==========================================
# FRONTEND API BASE URL
# ==========================================
VITE_API_URL="/api"

# ==========================================
# MEDIA & EMAIL INTEGRATIONS (OPTIONAL)
# ==========================================
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

EMAIL_USER="growzybytesofficial@gmail.com"
EMAIL_APP_PASSWORD=""
CONTACT_RECEIVER="growzybytesofficial@gmail.com"
```

---

## Step 3: Upload Application Files

You can upload files using **Git**, **Hostinger File Manager**, or **FTP/SFTP**:

### Option A: Via SSH & Git (Recommended)
```bash
ssh u123456789@yourdomain.com
cd public_html
git clone https://github.com/your-username/growzybytes.git .
npm install
```

### Option B: Via Hostinger File Manager
1. ZIP your project directory (excluding `node_modules` and `dist`).
2. Go to **Hostinger hPanel** -> **File Manager**.
3. Upload the ZIP file into `public_html` or your designated subfolder.
4. Extract the ZIP file and ensure hidden files like `.env` and `.prisma` are included.

---

## Step 4: Set Up Node.js App in Hostinger hPanel

1. Go to **Hostinger hPanel** -> **Advanced** -> **Setup Node.js App** (or **Setup Python/Node.js App**).
2. Click **Create Application**:
   - **Node.js Version:** `20.x` or `18.x`
   - **Application Mode:** `Production`
   - **Application Root:** `public_html` (or your project path)
   - **Application URL:** `https://yourdomain.com`
   - **Application Startup File:** `dist/server.cjs`
3. Click **Create**.

---

## Step 5: Run Database Migrations & Seed Data

Open the SSH terminal or Hostinger web terminal in your app directory and execute:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Push Schema to MySQL Database
npx prisma db push

# OR execute full migration history:
# npx prisma migrate deploy

# 3. Seed Default Admin, Settings, Services, Projects, Blogs, Testimonials & FAQs
npm run seed
```

Expected output:
```text
🌱 Starting Prisma database seed...
✅ Admin created/updated: Bhupendra8171121943@gmail.com
✅ Site settings seeded
✅ Services seeded
✅ Projects seeded
✅ Blogs seeded
✅ Testimonials seeded
✅ Team members seeded
✅ FAQs seeded
🎉 Seed completed successfully!
```

---

## Step 6: Build & Launch Production App

1. Run the production build command:
```bash
npm run build
```

2. Start or restart the application:
   - In Hostinger **Node.js App Dashboard**, click **Restart App**.
   - Or manually start in terminal:
```bash
npm start
```

---

## Prisma Commands Reference

| Action | Command |
| :--- | :--- |
| **Generate Client** | `npx prisma generate` |
| **Apply Schema Changes** | `npx prisma db push` |
| **Run Migrations** | `npx prisma migrate deploy` |
| **Seed Database** | `npm run seed` or `npx prisma db seed` |
| **Inspect DB via UI** | `npx prisma studio` |

---

## Troubleshooting & FAQs

### 1. `Can't reach database server at localhost:3306`
- **Fix:** Verify host in `DATABASE_URL`. On Hostinger shared hosting, `localhost` or `127.0.0.1` works. Ensure database username and password in hPanel match `.env`.

### 2. `Access denied for user 'u123456789_growzyuser'@'localhost'`
- **Fix:** Ensure the database user has been granted full permissions on the database in Hostinger hPanel -> MySQL Databases.

### 3. Images not uploading
- **Fix:** Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env`. If using local storage, ensure the upload directory has write permissions.

### 4. Admin Login Issues
- Default Admin Email: `Bhupendra8171121943@gmail.com`
- Default Admin Password: `Druhi@2011`
- If you change credentials, re-run `npm run seed` or update via `/api/admin/settings`.

---

### Support
For any questions or custom setup queries, reach out to **GROWZYBYTES** at [contact@growzybytes.com](mailto:contact@growzybytes.com).
