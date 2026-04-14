# CareerAI 🚀

> **AI-powered full-stack job platform** connecting talent with top companies.  
> Dark glassmorphism UI · JWT auth · Role-based dashboards · AI job generation

---

## ✨ Features

### Job Seekers
- Browse & search jobs with filters (type, level, location, skills)
- One-click apply with cover letter
- Application tracking with status updates
- Profile with skills, experience, education, resume upload
- AI-powered profile bio & skill suggestions
- Match score per job (based on skill overlap)

### Recruiters
- Post jobs with AI-generated descriptions, requirements & skills
- Manage listings (activate/close/delete)
- View applicants with match scores
- Accept / reject / shortlist applicants
- Leave notes visible to applicants
- Company profile

### Platform
- Email/password authentication
- Google OAuth login
- JWT-based protected routes
- Role-based routing (job_seeker → /dashboard, recruiter → /recruiter)
- Real-time notifications (in-app)
- Responsive dark glassmorphism UI

---

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + custom glassmorphism |
| Routing | React Router v6 |
| State | Context API |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs + Google OAuth |
| File Upload | Multer |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |

---

## 📁 Project Structure

```
careerai/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/Navbar.tsx
│   │   │   ├── jobs/JobCard.tsx
│   │   │   └── ui/LoadingScreen.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── lib/api.ts
│   │   ├── pages/
│   │   │   ├── auth/LoginPage.tsx
│   │   │   ├── auth/SignupPage.tsx
│   │   │   ├── jobs/JobsPage.tsx
│   │   │   ├── jobs/JobDetailPage.tsx
│   │   │   ├── seeker/Dashboard.tsx
│   │   │   ├── seeker/Applications.tsx
│   │   │   ├── seeker/Profile.tsx
│   │   │   ├── recruiter/Dashboard.tsx
│   │   │   ├── recruiter/PostJob.tsx
│   │   │   ├── recruiter/Jobs.tsx
│   │   │   ├── recruiter/Applicants.tsx
│   │   │   └── recruiter/Profile.tsx
│   │   ├── types/index.ts
│   │   ├── App.tsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── vercel.json
│
└── server/                    # Express backend
    └── src/
        ├── models/
        │   ├── User.js
        │   ├── Profile.js
        │   ├── Job.js
        │   └── Application.js
        ├── routes/
        │   ├── auth.js
        │   ├── jobs.js
        │   ├── applications.js
        │   ├── profiles.js
        │   └── notifications.js
        ├── middleware/auth.js
        └── index.js
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Cloud Console project (for OAuth)

### 1. Clone & Install

```bash
git clone https://github.com/yourname/careerai.git
cd careerai

# Install root dev tools
npm install

# Install all dependencies
npm run install:all
```

### 2. Configure Environment Variables

**Server** — copy and edit `server/.env.example` → `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/careerai
JWT_SECRET=your_very_long_random_secret_key_here
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
CLIENT_URL=http://localhost:5173
```

**Client** — copy and edit `client/.env.example` → `client/.env`:

```env
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

### 3. Run Development Servers

```bash
# Both concurrently (recommended)
npm run dev

# Or individually:
npm run dev:server   # http://localhost:5000
npm run dev:client   # http://localhost:5173
```

---

## 🗃️ MongoDB Setup

1. Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Add a database user
3. Whitelist your IP (or use 0.0.0.0/0 for dev)
4. Copy the connection string into `MONGO_URI`

Collections created automatically on first run:
- `users`
- `profiles`
- `jobs`
- `applications`

---

## 🔐 Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable "Google+ API"
3. Credentials → Create OAuth 2.0 Client ID
4. Add authorized origins:
   - `http://localhost:5173` (dev)
   - `https://your-app.vercel.app` (prod)
5. Copy client ID to both `.env` files

---

## 🌐 API Reference

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register with email/password |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/auth/google` | Public | Google OAuth login |
| GET | `/api/auth/me` | Auth | Get current user + profile |

### Jobs
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/jobs` | Public | List jobs (search, filter, paginate) |
| GET | `/api/jobs/:id` | Public | Job detail |
| POST | `/api/jobs` | Recruiter | Create job |
| PUT | `/api/jobs/:id` | Recruiter | Update job |
| DELETE | `/api/jobs/:id` | Recruiter | Delete job |
| GET | `/api/jobs/recruiter/mine` | Recruiter | Own job listings |
| GET | `/api/jobs/:id/applications` | Recruiter | Applicants for a job |

### Applications
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/applications/apply` | Job Seeker | Apply to job |
| GET | `/api/applications` | Job Seeker | My applications |
| PUT | `/api/applications/:id/status` | Recruiter | Update status |

### Profiles
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/profiles/me` | Auth | My profile |
| PUT | `/api/profiles/me` | Auth | Update profile |
| GET | `/api/profiles/:userId` | Public | View profile |
| POST | `/api/profiles/resume` | Auth | Upload resume |

### Notifications
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/notifications` | Auth | Get notifications |
| PUT | `/api/notifications/read-all` | Auth | Mark all read |

---

## ☁️ Deployment

### Frontend → Vercel

```bash
cd client
npm run build

# Deploy via Vercel CLI:
npx vercel --prod

# Or connect your GitHub repo in Vercel dashboard:
# - Root directory: client
# - Build command: npm run build
# - Output directory: dist
# - Add env vars: VITE_GOOGLE_CLIENT_ID
```

### Backend → Render

1. Push code to GitHub
2. Create new "Web Service" on [render.com](https://render.com)
3. Settings:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `node src/index.js`
4. Environment variables:
   ```
   MONGO_URI=...
   JWT_SECRET=...
   GOOGLE_CLIENT_ID=...
   CLIENT_URL=https://your-app.vercel.app
   PORT=10000
   ```

### After Deploy
Update the Vite proxy in `client/vite.config.ts` to point to your Render URL:
```ts
proxy: {
  '/api': {
    target: 'https://careerai-api.onrender.com',
    ...
  }
}
```
Or set `VITE_API_URL` as an env var and use it in `src/lib/api.ts`.

---

## 🤖 AI Features (Anthropic Claude)

The app uses Claude API client-side for two features:

1. **Profile Bio Enhancer** — Job seekers can click "AI Enhance" on their profile to improve their bio and get skill suggestions
2. **Job Description Generator** — Recruiters click "Generate with AI" when posting a job to auto-fill description, requirements, skills, and benefits

> **Note:** The AI calls are made directly from the browser. For production, move these to the backend and store your Anthropic API key server-side for security.

---

## 🔧 Customisation Tips

- **Colours** — Edit `tailwind.config.js` color tokens and `src/index.css` CSS variables
- **Add experience/education** — Profile model already has these fields; add form UI in `SeekerProfile.tsx`
- **Email notifications** — Integrate Nodemailer or Resend in the applications route
- **Job bookmarks** — Add a `savedJobs` array to the User model

---

## 📄 License

MIT — use freely for personal or commercial projects.
