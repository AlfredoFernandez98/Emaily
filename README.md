# Emaily

A learning project: Google login with Express, Passport and MongoDB, plus a
React client.

Live: https://emaily-39ar.onrender.com

## Stack

- Server: Express 5, Passport (`passport-google-oauth20`), Mongoose, `cookie-session`
- Client: React (Create React App) in `client/`
- Hosting: Render, deployed from `main`

## Endpoints

- `GET /auth/google` starts the Google login
- `GET /auth/google/callback` Google redirects here
- `GET /api/current_user` the logged-in user
- `GET /api/logout` ends the session

Only the Google ID is stored. The session lives in a signed cookie.

## Running locally

Requires Node 22 or newer.

1. Install dependencies:

   ```
   npm install
   npm install --prefix client
   ```

2. Create a `.env` file in the project root (it is gitignored) with these keys:
   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MONGODB_URI`, `COOKIE_KEY`.

3. Start server and client together:

   ```
   npm run dev
   ```

4. Open http://localhost:3000. Requests to `/api` and `/auth/google` are
   forwarded to the server on port 5050 (see `client/src/setupProxy.js`).

The server uses port 5050, not 5000, because macOS AirPlay Receiver holds
port 5000.
