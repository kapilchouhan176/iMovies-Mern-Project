# iMovies — MERN Movie Ticket Booking System

A starting-from-zero MERN project for the SkillWallet iMovies brief.

## Stack
- React + Vite + React Router
- Node.js + Express REST API
- MongoDB + Mongoose
- JWT authentication + bcrypt password hashing
- Responsive custom CSS
- Demo checkout (no real money charged)

## Prerequisites
- Node.js 18+ (20+ recommended)
- npm
- MongoDB Community Server locally OR MongoDB Atlas connection string
- VS Code

## Setup

### 1. Backend
Open a terminal in the project folder:

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and update `MONGO_URI` and `JWT_SECRET`.

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Create sample movies:
```bash
npm run seed
```

Start API:
```bash
npm run dev
```
API runs at http://localhost:5000 and health endpoint is http://localhost:5000/api/health.

### 2. Frontend
Open a second terminal:
```bash
cd client
npm install
```

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Start:
```bash
npm run dev
```
Open http://localhost:5173.

## First admin account
Register a normal account, then promote it using MongoDB Compass or mongosh:
```js
use imovies
db.users.updateOne({ email: "your-email@example.com" }, { $set: { role: "admin" } })
```
Log out and log in again to receive an admin token. Admin routes are protected.

## Included
- Home page with search and genre filters
- Movie details
- Register / login
- Showtimes and interactive seat selection
- Booking history and cancellation for upcoming bookings
- Favorites/watchlist
- Movie reviews
- Admin APIs for movies, theatres and shows
- MongoDB models and demo seed script
- Error handling, Helmet, CORS, rate limiting, JWT and password hashing

## Important limitations
This is a development/college-project starter. Checkout is a simulated demo and does not charge money. Before public deployment, add a real payment provider with verified webhooks, email/SMS delivery, stronger production monitoring, and thorough security and concurrency tests. Seat booking uses a database conditional update to reduce double booking, but a production payment workflow should use transactions/seat holds and expiry.
