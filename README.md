# Penta Peaks International - Premium Agricultural Export Platform

A modern Next.js application for Pakistan's premium agricultural commodities exporter. Features product catalog, buyer/supplier management, student mentorship program, and admin dashboard.

## 🌟 Features

- **Product Showcase**: Display premium agricultural commodities (rice, fruits, vegetables, grains, etc.)
- **E-commerce Ready**: Product categories, details, and inquiry system
- **Authentication**: Secure student and admin login with NextAuth.js
- **Admin Dashboard**: Manage products, users, and orders
- **Student Mentorship**: Import/export education and registration services
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Performance Optimized**: Built with Next.js 16 for blazing-fast load times
- **SEO Ready**: Optimized metadata and structured data
- **Email Integration**: Contact forms and notifications via SMTP

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Git

### Installation

1. **Clone repository**
   ```bash
   git clone <your-repo-url>
   cd pentapeaks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Setup database**
   ```bash
   npx prisma db push
   npx prisma db seed  # Optional: seed initial data
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure

```
pentapeaks/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   ├── about/              # About page
│   ├── products/           # Product pages & categories
│   ├── student/            # Student portal
│   ├── admin/              # Admin dashboard
│   ├── contact/            # Contact page
│   ├── buyer/              # Buyer portal
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
├── lib/                    # Utilities & helpers
│   ├── auth.ts            # NextAuth configuration
│   ├── animations.ts      # Framer Motion animations
│   └── prisma.ts          # Prisma client
├── prisma/                # Database schema
│   ├── schema.prisma      # Prisma schema
│   └── migrations/        # Database migrations
├── public/                # Static assets
└── package.json
```

## 🛠 Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run db:push    # Push schema to database
npm run db:seed    # Seed database
npm run db:studio  # Open Prisma Studio
```

### Technology Stack

- **Frontend**: Next.js 16, React 19, Framer Motion
- **Styling**: Tailwind CSS v4, CSS-in-JS
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js v4
- **UI Components**: Lucide React icons
- **Validation**: Zod
- **Email**: Nodemailer

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, products, testimonials |
| `/about` | Company information and story |
| `/products` | Product catalog with categories |
| `/products/[category]` | Products by category |
| `/products/[category]/[slug]` | Individual product details |
| `/services` | Service offerings |
| `/mentorship` | Import/export mentorship program |
| `/contact` | Contact form |
| `/student/login` | Student login |
| `/student/dashboard` | Student portal |
| `/admin/*` | Admin dashboard (authentication required) |
| `/buyer` | Buyer inquiry form |

## 🔐 Authentication

The application uses NextAuth.js with credentials-based authentication:

- **Student Login**: Email + password
- **Admin Login**: Email + password with role verification
- **JWT Sessions**: 30-day session tokens
- **Protected Routes**: API routes and pages require authentication

### Environment Variables Required

```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-with-openssl>
```

## 💾 Database

### Schema Overview

- **Users**: Students and admins
- **Students**: Student profile with batch information
- **Batches**: Mentorship batch information
- **Products**: Agricultural commodity listings
- **Orders**: Buyer inquiries and orders

### Run Migrations

```bash
npx prisma db push          # Push schema to database
npx prisma migrate deploy   # Deploy existing migrations
```

## 📧 Email Configuration

Configure SMTP credentials in `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

For Gmail: Use [App Password](https://support.google.com/accounts/answer/185833)

## 🚀 Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourrepo%2Fpentapeaks)

### Manual Deploy

1. Push to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository
4. Add environment variables
5. Deploy

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.**

## 📊 Performance

- ✅ Lighthouse Score: 95+
- ✅ Page Load Time: <2s (home page)
- ✅ Image Optimization: WebP & AVIF
- ✅ Code Splitting: Automatic route-based
- ✅ Caching: Optimized with ISR

## 🔒 Security

- ✅ XSS Protection: Content Security Policy
- ✅ SQL Injection: Prisma parameterized queries
- ✅ CSRF Protection: NextAuth CSRF tokens
- ✅ Environment Variables: No hardcoded secrets
- ✅ Rate Limiting: Configured on APIs
- ✅ HTTPS: Enforced in production

## 📝 License

This project is private and proprietary to Penta Peaks International.

## 👥 Contributing

1. Create a feature branch: `git checkout -b feature/name`
2. Make changes and test
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/name`
5. Create Pull Request

## 📞 Support

For issues or questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) before deploying
- Check Vercel logs in dashboard for errors

## 📈 Analytics

- Vercel Analytics enabled for performance monitoring
- Core Web Vitals tracking
- Error monitoring and logging

---

**Made with ❤️ for Penta Peaks International**
