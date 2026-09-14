# Emaily

Google OAuth login built on Express, Passport, and MongoDB.

Live: https://emaily-39ar.onrender.com

## Stack

Express 5, Passport (`passport-google-oauth20`), Mongoose, `cookie-session`.
Deployed on Render from `main`.

## Endpoints

- `GET /auth/google` starts the Google login
- `GET /auth/google/callback` Google redirects here
- `GET /api/current_user` the logged-in user
- `GET /api/logout` ends the session

Only the Google ID is stored. The session lives in a signed cookie, so there is
no session store to run.

## Running locally

Requires Node 22 or newer.

```
npm install
npm run dev
```

Credentials come from `config/keys.js`. In production it reads environment
variables; locally it reads `config/dev.js`, which is gitignored. Create that
file yourself with `GoogleClientID`, `GoogleClientSecret`, `mongodbURI`, and
`cookieKey`.

Then open http://localhost:5000/auth/google.

## Notes

A learning project. No tests and no frontend yet.
