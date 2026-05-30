# Loan Management System

Full-stack Loan Management System assignment using a MERN-style stack with Next.js, Express, TypeScript, MongoDB, JWT auth, and role-based access control.

## Project Structure

```txt
LMS/
  Backend/   Express + TypeScript + MongoDB API
  Frontend/  Next.js frontend
```

## Backend Setup

```bash
cd Backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Set these values in `Backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lms
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000,http://localhost:3001
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Frontend Setup

```bash
cd Frontend
npm install
copy .env.example .env.local
npm run dev
```

Set this value in `Frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Open the app at:

```txt
http://localhost:3000/auth/login
```

## Seed Credentials

```txt
ADMIN: admin@lms.com / Admin@123
SALES: sales@lms.com / Sales@123
SANCTION: sanction@lms.com / Sanction@123
DISBURSEMENT: disbursement@lms.com / Disbursement@123
COLLECTION: collection@lms.com / Collection@123
BORROWER: borrower@lms.com / Borrower@123
```

## Backend API Flow

- Borrower registers/logs in.
- Borrower submits personal details; backend runs BRE.
- Borrower uploads salary slip to Cloudinary.
- Borrower applies for a loan.
- Sanction role approves or rejects applied loans.
- Disbursement role marks sanctioned loans as disbursed.
- Collection role records payments and the loan auto-closes when fully paid.

## Frontend RBAC

- Borrowers are redirected to the borrower portal.
- Sales, Sanction, Disbursement, and Collection users only see their own dashboard module.
- Admin sees every dashboard module.
- Backend RBAC still protects every API route, so frontend hiding is not the only security layer.

## Deployment Notes

- Deploy `Frontend/` to Vercel.
- Deploy `Backend/` to Render.
- Use MongoDB Atlas for `MONGO_URI`.
- Set `CLIENT_URL` in Render to the deployed Vercel URL.
- Set `NEXT_PUBLIC_API_URL` in Vercel to the deployed Render backend URL plus `/api`.
- Salary slips are stored in Cloudinary; MongoDB stores only the uploaded file URL and metadata.
