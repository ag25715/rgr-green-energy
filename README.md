# RGR Green Energy — Full-Stack Platform

Production-ready Solar EPC platform: premium corporate website + Solar Savings Calculator + Admin CMS/CRM.

## Stack
- **Framework**: Next.js 15 (App Router) + JavaScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MongoDB (schema uses UUID `_id` — Prisma/PostgreSQL-migratable)
- **Auth**: PBKDF2 + HMAC-SHA256 JWT (7-day)
- **Rich Text**: react-quill-new
- **Email**: nodemailer (SMTP; graceful fallback logs to DB)

## Modules
- Public: Home, About, Solutions, Projects (list + detail), Solar Savings Calculator, Blog (list + detail), Contact, Career, Privacy, Terms, custom 404
- Admin (`/admin/login`): Dashboard, Lead CRM (with status workflow + notes), Projects, Blogs (rich editor), Testimonials, FAQs, Media Library (drag-and-drop uploads), Notifications, Calculator Settings (every parameter editable), Website Settings (9 tabs incl. per-page SEO)
- SEO: dynamic `sitemap.xml`, `robots.txt`, OpenGraph metadata

## Local Setup

```bash
yarn install
# Configure .env — see below
yarn dev              # http://localhost:3000
```

## Environment Variables (`.env`)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=rgr_green_energy
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=change_me_in_production
ADMIN_EMAIL=admin@rgrgreenenergy.com
ADMIN_PASSWORD=RgrAdmin@2025

# Optional email delivery (SMTP)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=RGR Green Energy <no-reply@rgrgreenenergy.com>
NOTIFY_EMAILS=
```

## Default Admin (auto-seeded on first API call)
- Email: `admin@rgrgreenenergy.com`
- Password: `RgrAdmin@2025`
- **Change immediately after first login.**

## Deployment
Any Node.js host (Vercel, Railway, VPS). MongoDB Atlas recommended for production. Ensure `public/uploads/` is on persistent storage or configure S3-compatible storage.

## Migration to PostgreSQL/Prisma
All entities use UUID `_id`, ISO-8601 `createdAt/updatedAt`, and simple JSON documents — ready for direct mapping to Prisma models. See `lib/defaults.js` for the canonical shape of every collection.
