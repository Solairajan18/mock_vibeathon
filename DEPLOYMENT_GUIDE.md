# Deployment Guide (Vercel + Neon Postgres)

Your application is now configured to use **Neon PostgreSQL**. Follow these steps to deploy it to Vercel for your hackathon submission.

## Step 1: Push to GitHub
Ensure all your changes are committed and pushed to your GitHub repository.

## Step 2: Import Project to Vercel
1. Log into [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Framework Preset: **Next.js**.

## Step 3: Configure Environment Variables
In the Vercel **Settings** -> **Environment Variables** tab, add the following from your `.env` file:

| Key | Value |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://neondb_owner:YOUR_PASSWORD@your-host-pooler.neon.tech/neondb?sslmode=require&pgbouncer=true` |
| `DIRECT_URL` | `postgresql://neondb_owner:YOUR_PASSWORD@your-host.neon.tech/neondb?sslmode=require` |
| `OPENROUTER_URL` | `https://openrouter.ai/api/v1/chat/completions` |
| `MODEL` | `liquid/lfm-2.5-1.2b-instruct:free` |
| `OPENROUTER_API_KEY` | `your_openrouter_api_key_here` |

## Step 4: Verify Build Settings
Vercel should automatically detect your Next.js setup. Ensure the install command is `npm install` and the build command is `npm run build`.

## Step 5: Final Deploy
1. Click **Deploy**.
2. Vercel will build the app and host it on a public `.vercel.app` domain.

---

### Pro-Tip for Hackathon Presentation:
If you want to quickly deploy from your terminal without going to the website, you can run:
```bash
npx vercel --prod
```
It will ask you to log in and then guide you through the deployment. Since your `package.json` build script includes `prisma generate`, it will work seamlessly.
