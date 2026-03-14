# LIBRARY MANAGEMENT SYSTEM

Backend: Node.js + Express
Database: MongoDB (Mongoose)
Frontend: React (client)

Setup:

1. Copy `server/.env.example` to `server/.env`.
2. Set `MONGO_URI`, `JWT_SECRET`, and `PORT` in `server/.env`.
3. Start MongoDB locally on `127.0.0.1:27017`, or replace `MONGO_URI` with your MongoDB Atlas/remote connection string.
4. Install server dependencies and start the server:

```powershell
cd server
npm install
npm start
```

5. Install client dependencies and run React client in development (optional):

```powershell
cd client
npm install
npm start
```

6. Build the React client for production and serve via the server:

```powershell
cd client
npm run build
cd ../server
npm start
```

Notes:
- Seed admin/user by inserting into `Users` table (hash passwords with bcrypt).
- All pages are in `client/`. APIs are under `/api/*`.
