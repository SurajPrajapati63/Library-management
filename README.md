# LIBRARY MANAGEMENT SYSTEM

Backend: Node.js + Express
Database: MongoDB (Mongoose)
Frontend: React (client)

Setup:

1. Run MongoDB locally or provide a `MONGO_URI` in `server/.env` (or `DB_URI`).
2. Copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_SECRET`, and `PORT`.
3. Install server dependencies and start the server:

```powershell
cd server
npm install
npm start
```

4. Install client dependencies and run React client in development (optional):

```powershell
cd client
npm install
npm start
```

5. Build the React client for production and serve via the server:

```powershell
cd client
npm run build
cd ../server
npm start
```

Notes:
- Seed admin/user by inserting into `Users` table (hash passwords with bcrypt).
- All pages are in `client/`. APIs are under `/api/*`.
