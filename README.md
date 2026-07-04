<div align="center">

# 🔐 Auth Service

**A secure, session-aware authentication backend built with Node.js, Express & MongoDB**

JWT access/refresh tokens · Email OTP verification · Multi-device session management

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Postman](https://img.shields.io/badge/Tested%20with-Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [✅ Prerequisites](#-prerequisites)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Installation](#-installation)
- [📡 API Endpoints](#-api-endpoints)
- [🧪 API Testing](#-api-testing)
- [🔄 Authentication Flow](#-authentication-flow)
- [🛡️ Security Notes](#️-security-notes)
- [📄 License](#-license)

---

## ✨ Features

| | |
|---|---|
| 📝 | **User registration** with email OTP verification |
| 🔑 | **Login** with hashed password verification |
| 🎫 | **Access & refresh token** flow using JWT |
| 📱 | **Session tracking** per device (IP + User-Agent), stored in MongoDB |
| 🔁 | **Refresh token rotation** on every refresh request |
| 🚪 | **Logout** (single session) & **logout-all** (revoke every session) |
| 📧 | **Email delivery** via Gmail using Nodemailer + OAuth2 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (ES Modules) |
| **Framework** | Express 5 |
| **Database** | MongoDB with Mongoose |
| **Auth** | JSON Web Tokens (`jsonwebtoken`) |
| **Email** | Nodemailer (Gmail OAuth2) |
| **Logging** | Morgan |
| **Cookies** | cookie-parser |
| **API Testing** | Postman |

---

## 📁 Project Structure

```
auth/
├── server.js                     # App entry point, connects DB and starts server
├── config/
│   ├── config.js                 # Loads & validates environment variables
│   └── database.js               # MongoDB connection
├── src/
│   ├── app.js                    # Express app setup & middleware
│   ├── routes/
│   │   └── auth.routes.js        # Auth route definitions
│   ├── controllers/
│   │   └── auth.controller.js    # Route handler logic
│   └── models/
│       ├── user.model.js         # User schema
│       ├── session.model.js      # Session schema (refresh token tracking)
│       └── otp.model.js          # OTP schema
├── services/
│   └── email.service.js          # Nodemailer transporter & sendEmail helper
├── utils/
│   └── utils.js                  # OTP generation & email HTML template
└── package.json
```

---

## ✅ Prerequisites

- Node.js **v18+**
- A MongoDB instance (local or Atlas)
- A Google Cloud project with Gmail API OAuth2 credentials (client ID, client secret, refresh token)

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REFRESH_TOKEN=your_google_oauth_refresh_token
GOOGLE_USER=your_gmail_address
```

> ⚠️ All six variables are **required** — the app throws an error on startup if any are missing.
>
> 🔒 Never commit your `.env` file. Add it to `.gitignore` and share an `.env.example` (with placeholder values) instead.

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd auth

# 2. Install dependencies
npm install

# 3. Create your .env file (see above)

# 4. Run in development mode (auto-restart via nodemon)
npm run dev

# — or run in production —
npm start
```

Server runs at **`http://localhost:3000`** 🎉

---

## 📡 API Endpoints

All routes are prefixed with `/api/auth`.

| Method | Endpoint | Description | Auth Required |
|:---:|---|---|:---:|
| `POST` | `/register` | Register a new user, sends OTP to email | ❌ |
| `POST` | `/login` | Log in, sets refresh token cookie, returns access token | ❌ |
| `GET` | `/get-me` | Get current user info | ✅ Bearer token |
| `GET` | `/refresh-token` | Rotate refresh token & get new access token | ✅ Refresh cookie |
| `GET` | `/logout` | Revoke current session | ✅ Refresh cookie |
| `GET` | `/logout-all` | Revoke all sessions for the user | ✅ Refresh cookie |
| `GET` | `/verify-email` | Verify a user's email using the OTP | ❌ |

<details>
<summary><b>📝 Example — Register</b></summary>

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "abhay",
  "email": "abhay@example.com",
  "password": "yourpassword"
}
```
</details>

<details>
<summary><b>🔑 Example — Login</b></summary>

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "abhay@example.com",
  "password": "yourpassword"
}
```

Returns an `accessToken` in the response body and sets an httpOnly `refreshToken` cookie.
</details>

---

## 🧪 API Testing

All endpoints are tested using **Postman**. To try them yourself:

1. 📥 Import the base URL `http://localhost:3000/api/auth` into a Postman collection.
2. 🧱 Create requests for each endpoint listed above.
3. 🍪 For `/login`, enable cookie handling in your Postman workspace so the `refreshToken` cookie is stored — this is required for `/refresh-token`, `/logout`, and `/logout-all`.
4. 🪪 For `/get-me`, add the `accessToken` from `/login` as a **Bearer Token** in the request's Authorization tab.

> 💡 **Tip:** Export your Postman requests as a collection and commit it (e.g. `postman/auth.postman_collection.json`) so others can import and test instantly.

---

## 🔄 Authentication Flow

```
Register → Email OTP → Verify Email → Login
                                          │
                          ┌───────────────┴───────────────┐
                          ▼                                ▼
                  Access Token (15m)              Refresh Token (7d)
                  sent in response                httpOnly cookie + session
                          │                                │
                          ▼                                ▼
              Used as Bearer token            Used to rotate tokens via
              on protected routes              /refresh-token
                                                             │
                                          ┌──────────────────┴─────────────────┐
                                          ▼                                     ▼
                                     /logout                              /logout-all
                              (revoke this session)               (revoke all sessions)
```

---

## 🛡️ Security Notes

- 🔐 Passwords and refresh tokens are hashed (SHA-256) before being stored.
- 🍪 Refresh tokens are stored as `httpOnly`, `secure`, `sameSite: strict` cookies.
- ♻️ **Rotate all credentials** in `.env` before pushing this project to a public repository, and make sure `.env` is excluded via `.gitignore`.

---

## 📄 License

Released under the **ISC** license.
