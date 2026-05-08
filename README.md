# Parallax FramesThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



![Parallax Frames Banner](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge) ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css) ![Sanity.io](https://img.shields.io/badge/Sanity-v3-F03E2F?style=for-the-badge&logo=sanity)## Getting Started



An interactive archive of nightlife culture. Immersive EDM event photography capturing the chaos and energy of the dancefloor. Hosted seamlessly on **Vercel** and powered by **Sanity CMS**.First, run the development server:



🌍 **Live Domain**: [parallaxframes.com](https://parallaxframes.com)```bash

npm run dev

---# or

yarn dev

## 📸 Overview# or

pnpm dev

Parallax Frames is an interactive, visually immersive portfolio for event photography. Featuring high-performance parallax animations, smooth scrolling, and an artistic typographic approach, this project showcases deep integration of dynamic animations utilizing **Framer Motion** and high-res event galleries managed through a **Sanity.io** backend and stored in performant S3/Clouldflare R2 buckets.# or

bun dev

## ✨ Key Features```



- **Interactive Animations**: Advanced layout animations and scrolling logic powered by Framer Motion.Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- **Headless CMS integration**: Deeply integrated with Sanity.io so photographers can update the gallery, events, and backstage info instantly.

- **S3 / R2 Bucket Media**: Supports uploading and managing high-resolution assets remotely using S3, averting standard storage limitations.You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- **Dark Mode Native**: Tailored black-and-zinc interface designed specifically to highlight concert/nightlife visuals.

- **Fully Responsive**: Highly optimized structural scaling handling desktop canvas views alongside refined mobile layouts.This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



---## Learn More



## 🛠 Tech StackTo learn more about Next.js, take a look at the following resources:



- **Framework**: Next.js (App Router Base)- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- **Language**: TypeScript- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- **Styling**: Tailwind CSS

- **Animations**: Framer MotionYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- **Headless CMS**: Sanity.io Studio v3

- **Media Hosting**: AWS S3 / Cloudflare R2## Deploy on Vercel

- **Deployment**: Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

---

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🚀 Getting Started

To run this project locally, you will need Node.js (v18+) and your package manager of choice (`npm`, `yarn`, `pnpm`, or `bun`).

### 1. Clone the repository

```bash
git clone https://github.com/your-username/parallax-frames-portfolio.git
cd parallax-frames-portfolio
```

### 2. Install dependencies

```bash
npm install
# or yarn install
# or pnpm install
```

### 3. Setup Environment Variables

Create a `.env.local` file at the root of the project and populate it with your Sanity.io project keys and configured S3 environments:

```env
# Sanity Config
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"

# (Optional) S3 / R2 Bucket Config for Media Plugin
# S3_BUCKET_NAME="parallax-assets"
# AWS_ACCESS_KEY_ID="xxx"
# AWS_SECRET_ACCESS_KEY="xxx"
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `3002` if previously configured) to view the application in the browser. 

The Sanity Studio panel runs locally under `http://localhost:3000/studio`.

---

## 📦 Deployment (Vercel)

This application is built exactly for **Vercel** infrastructure.

1. Push your code to your GitHub repository.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import the `parallax-frames-portfolio` repository.
4. Inject your Environment Variables (`.env.local`) during the import process.
5. Click **Deploy**.
6. Navigate to your project settings under **Domains** and input `parallaxframes.com`. Make sure to align the correct `A` / `CNAME` records at your domain registrar.

*Note: Ensure you add `https://parallaxframes.com` safely into the [Sanity API CORS Origins list](https://manage.sanity.io/) to enable asset fetching.*

---

## 📄 License

Made by [Your Name]. All event photography assets belong to their respective operators and Parallax Frames.
