# Interners

Every internship post, in one feed. Interners collects internship postings from job platforms into a single searchable list, and uses AI to tell you how well each offer matches your CV.

**Live demo:** https://interners.anesme05.workers.dev/

## Features

- **One feed of offers**: postings are fetched from [Arbeitnow](https://www.arbeitnow.com/api/job-board-api), cached in MongoDB and refreshed automatically, so pages load fast.
- **Accounts**: sign up, log in and stay logged in with JWT authentication.
- **CV upload**: upload a PDF; the text is extracted in the browser and saved to your profile.
- **AI match score**: click "Compare to my CV" on any offer to get a score out of 100 and a short explanation.
- **Daily limit**: 5 AI comparisons per user per day.
- **Admin tools**: admin-only routes (list users, refresh offers).

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB (Atlas) |
| Auth | JWT, bcryptjs |
| AI | Groq (OpenAI-compatible API) |
| Hosting | Cloudflare (frontend) |

## Project structure

```
interners/
├── client/                 # React app
│   └── src/ (Pages, components, context)
└── server/                 # Express API
    └── src/
        ├── config/         # AI client
        ├── controllers/    # HTTP layer
        ├── services/       # business logic (auth, CV, AI, offers, usage limit)
        ├── validators/     # input checks
        ├── middleware/     # auth, roles, error handler
        ├── integrations/   # one adapter per job source
        ├── Models/         # User, Offer, Usage
        └── routes/
```

Request flow: `route → middleware → controller → service → model`.

## Getting started

**Requirements:** Node.js 18+, a MongoDB database (Atlas free tier works), and a Groq API key.

```bash
git clone <your-repo-url>
cd interners
```

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/interners?retryWrites=true&w=majority
JWT_SECRET=a-long-random-string
CLIENT_URL=http://localhost:5173

GROQ_API_KEY=your-groq-key
GROQ_MODEL=openai/gpt-oss-20b

AI_DAILY_LIMIT=5
OFFER_WINDOW_HOURS=24
OFFER_RETENTION_HOURS=72
```

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start the API:

```bash
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. The API is expected at http://localhost:3000.

## API overview

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in, returns a JWT |
| GET | `/api/auth/me` | Logged in | Current user |
| GET | `/api/auth/users` | Admin | List users |
| GET | `/api/offers` | Public | Paginated offers (`page`, `limit`, `q`, `location`, `remote`) |
| POST | `/api/cv` | Logged in | Save your CV text |
| POST | `/api/Ai/CompareCv` | Logged in | Score your CV against an offer |

Protected routes need the header `Authorization: Bearer <token>`.

## How it works

1. A scheduled job fetches recent offers, converts them to a common format and upserts them into MongoDB. Old offers are deleted automatically by a TTL index.
2. The React app reads offers from the API with server-side pagination.
3. When you compare an offer, the server loads your CV text, asks the AI for a score and reason, and returns clean JSON. Your CV and the offer text are treated as untrusted data in the prompt.

## Adding a new job source

Create a file in `server/src/integrations/` that exports `{ name, fetchRecent }`, mapping the site's fields to the Offer model, then add it to the `SOURCES` list in `offer.services.js`.

## Notes

- Never commit your `.env` file.
- Offers come from Arbeitnow; each card links back to the original posting.
- To make a user an admin, set `role` to `admin` on their document in MongoDB.
