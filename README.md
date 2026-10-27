# 📰 ITS2020 RAD Article Backend API

<div align="center">

[![Repository](https://img.shields.io/badge/GitHub-chathunga2007%2FITS2020--RAD--Article--Backend-181717?style=for-the-badge&logo=github)](https://github.com/chathunga2007/ITS2020-RAD-Article-Backend)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express 5](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose 9](https://img.shields.io/badge/Mongoose_9-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<p align="center">
  <strong>Enterprise-ready, scalable RESTful API engine for Article Publishing with Role-Based Access Control (RBAC), Dual-Token JWT Authentication, Google Gemini AI Content Generation, and Supabase Cloud Storage.</strong>
</p>

[✨ Key Features](#-key-features) •
[🏛️ System Architecture](#️-system-architecture) •
[📂 Project Structure](#-project-structure) •
[⚡ Quick Start](#-quick-start--setup) •
[🌐 API Reference](#-rest-api-documentation) •
[🗄️ Database Schema](#️-database-models--schema) •
[🛡️ Security & Reliability](#️-security--reliability)

---

</div>

## 📖 Overview

The **ITS2020 RAD Article Backend API** is an asynchronous, strongly-typed RESTful microservice built using **Express 5** and **TypeScript**. Developed as part of the Rapid Application Development (RAD) curriculum, this backend provides a robust foundation for modern digital publishing platforms.

It features complete separation of concerns via a clean **Controller-Service-Router-Model** architecture, complete with Google Gemini Flash AI integration for autonomous summary generation, Supabase Object Storage for media uploads, and Dockerized MongoDB database persistence.

---

## ✨ Key Features

- **🔐 Dual-Token JWT Authentication**: Secure access token generation (`30m` lifespan) and persistent refresh token rotation (`7d` lifespan) using `bcryptjs` for salted password hashing.
- **🛡️ Role-Based Access Control (RBAC)**: Fine-grained authorization middleware checking roles across `ADMIN`, `WRITTER`, and `USER`.
- **🤖 Google Gemini AI Integration**: Powered by `@google/genai` (`gemini-3.5-flash-lite`) to dynamically generate article descriptions and summaries from prompt keywords.
- **☁️ Supabase Cloud Storage with Fallback**: Memory-stream image uploads via `multer` to Supabase Storage with graceful automatic fallback to Base64 data URIs.
- **📑 Paginated & Populated Article Feed**: High-performance querying with Mongoose pagination (`page`, `limit`), metadata calculations, and author population.
- **🐳 Containerized MongoDB**: Includes a production-ready `docker-compose.yml` for isolated MongoDB 7.0 database deployment.
- **🌐 Network Resilience**: Integrated custom DNS resolution fallback (`8.8.8.8`) ensuring dependable connection strings for MongoDB clusters and external APIs.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    Client["Client Applications<br/>(React / Mobile / cURL / Postman)"]

    subgraph ExpressGateway["Express 5 Server (Node.js & TypeScript)"]
        Cors["CORS & express.json()"]
        AuthMiddleware["authenticate Middleware<br/>(JWT Verification)"]
        RoleMiddleware["requireRole Middleware<br/>(RBAC Guard)"]
        UploadMiddleware["Multer Memory Storage<br/>(Single File 'image')"]

        subgraph Controllers["Controller Layer"]
            AuthController["Auth Controller<br/>register, login, refresh, me"]
            ArticleController["Article Controller<br/>create, getAll, aiGenerate"]
        end

        subgraph ServiceLayer["Service & Utility Layer"]
            AIService["Google Gemini Service<br/>(gemini-3.5-flash-lite)"]
            StorageService["Supabase Upload Service<br/>(Object Bucket + Base64 Fallback)"]
            JWTUtil["JWT Utilities<br/>(signAccessToken, signRefreshToken)"]
        end
    end

    subgraph DataPersistence["External & Cloud Services"]
        MongoDB[("MongoDB 7.0<br/>(Users & Articles Collections)")]
        SupabaseBucket[("Supabase Storage<br/>('articles' bucket)")]
        GeminiAPI["Google Gemini AI Engine"]
    end

    Client -->|HTTP Requests| Cors
    Cors --> AuthController
    Cors --> UploadMiddleware --> AuthMiddleware --> RoleMiddleware --> ArticleController

    AuthController --> JWTUtil
    AuthController --> MongoDB

    ArticleController --> AIService --> GeminiAPI
    ArticleController --> StorageService --> SupabaseBucket
    ArticleController --> MongoDB
```

---

## 📂 Project Structure

```text
rad-article-api/
├── .env                       # Local environment secrets (ignored by git)
├── .example.env               # Sample environment configuration template
├── .gitignore                 # Git ignore rules for node_modules & logs
├── docker-compose.yml         # MongoDB 7.0 container specification
├── package.json               # Dependencies, scripts, and project metadata
├── tsconfig.json              # TypeScript compiler configuration
└── src/
    ├── index.ts               # Application entry point & database connection
    ├── config/
    │   └── superbase.ts       # Supabase client initialization
    ├── controllers/
    │   ├── article.controller.ts # Article creation, pagination, AI generation
    │   └── auth.controller.ts    # Authentication, login, register, token refresh
    ├── middleware/
    │   ├── auth.ts            # Bearer token verification & user attachment
    │   ├── role.ts            # Role-based access control (RBAC) guard
    │   └── upload.ts          # Multer in-memory file upload handler
    ├── models/
    │   ├── article.model.ts   # Mongoose Article schema & TypeScript interface
    │   └── user.model.ts      # Mongoose User schema, UserRole enum & interface
    ├── routes/
    │   ├── article.routers.ts # Article endpoints (/api/v1/article)
    │   └── auth.routers.ts    # Auth endpoints (/api/v1/auth)
    ├── services/
    │   ├── ai.service.ts      # Google Gemini Flash generative content service
    │   ├── storage.service.ts # Storage export abstraction
    │   └── upload.service.ts  # Supabase cloud upload with fallback logic
    └── util/
        └── jwt_token.ts       # Access and refresh token generation & verification
```

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Language** | [Node.js 22+](https://nodejs.org/) / [TypeScript 7.x](https://www.typescriptlang.org/) | Type-safe asynchronous JavaScript runtime |
| **Development Engine** | [tsx](https://github.com/privatenumber/tsx) | Ultra-fast TypeScript watcher & executor without manual build steps |
| **Framework** | [Express 5.2](https://expressjs.com/) | Next-generation minimalist web application framework |
| **Database & ODM** | [MongoDB 7.0](https://www.mongodb.com/) / [Mongoose 9.10](https://mongoosejs.com/) | NoSQL Document database with schema modeling |
| **Artificial Intelligence** | [@google/genai 2.31](https://ai.google.dev/) | Generative AI SDK using `gemini-3.5-flash-lite` |
| **Cloud Storage** | [@supabase/supabase-js 2.118](https://supabase.com/) | Cloud object storage bucket integration for media assets |
| **Authentication & Crypto** | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) / [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | JWT dual token signing and salted password hashing |
| **File Handling** | [multer 2.4](https://github.com/expressjs/multer) | Multipart/form-data middleware using memory storage buffer |
| **Containerization** | [Docker & Docker Compose](https://www.docker.com/) | Local containerized MongoDB service environment |

---

## ⚡ Quick Start & Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** or **yarn**
- **Docker Desktop** (optional, for local MongoDB container)

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/chathunga2007/ITS2020-RAD-Article-Backend.git
cd ITS2020-RAD-Article-Backend
npm install
```

### 3. Spin up MongoDB with Docker
```bash
docker compose up -d
```
> This starts MongoDB 7.0 on port `27017` with credentials `admin` / `1234`.

### 4. Configure Environment Variables
Copy `.example.env` to `.env` and provide your secrets:
```bash
cp .example.env .env
```

Edit your `.env` file:
```env
PORT=3000
MONGO_LOCAL_URL=mongodb://admin:1234@localhost:27017/rad_article_db?authSource=admin
JWT_SECRET=super_secret_access_jwt_key_32_characters_long
JWT_REFRESH_SECRET=super_secret_refresh_jwt_key_32_characters_long
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-service-or-anon-key
GEMINI_API_KEY=your-google-gemini-api-key
```

### 5. Run Development Server
```bash
npm run dev
```
The server will boot with live reload on:
```text
DB connected..!
Server is running on http://localhost:3000
```

---

## 🌐 REST API Documentation

Base URL: `http://localhost:3000/api/v1`

### 1. Authentication Endpoints (`/api/v1/auth`)

#### 🔹 Register User
Registers a new user in the system with encrypted password and default `USER` role.
- **Method**: `POST`
- **URL**: `/api/v1/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Chathunga Bimsara",
    "email": "chathunga@example.com",
    "password": "Password123!"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully..!"
  }
  ```

---

#### 🔹 Login User
Authenticates user credentials and issues both Access Token and Refresh Token.
- **Method**: `POST`
- **URL**: `/api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "chathunga@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "OK",
    "data": {
      "email": "chathunga@example.com",
      "roles": ["USER"],
      "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

---

#### 🔹 Refresh Access Token
Issues a new Access Token using a valid Refresh Token.
- **Method**: `POST`
- **URL**: `/api/v1/auth/refresh`
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

---

#### 🔹 Get Current User Details
Retrieves authenticated user profile information based on token payload.
- **Method**: `GET`
- **URL**: `/api/v1/auth/me`
- **Headers**: `Authorization: Bearer <ACCESS_TOKEN>`
- **Response (200 OK)**:
  ```json
  {
    "message": "ok",
    "data": {
      "id": "670498bf89f1...",
      "email": "chathunga@example.com",
      "roles": ["USER"]
    }
  }
  ```

---

### 2. Article Endpoints (`/api/v1/article` or `/api/v1/articles`)

#### 🔹 Create Article
Uploads an article with optional image banner. Requires authentication and any role of (`ADMIN`, `WRITTER`, `USER`).
- **Method**: `POST`
- **URL**: `/api/v1/article/create`
- **Headers**:
  - `Authorization: Bearer <ACCESS_TOKEN>`
  - `Content-Type: multipart/form-data`
- **Form-Data Body**:
  - `title`: `Understanding Rapid Application Development`
  - `content`: `Full Markdown or HTML content for the article...`
  - `tags`: `TypeScript, RAD, Node.js` (or JSON array `["TypeScript", "RAD"]`)
  - `image`: *(File: binary image)*
- **Response (201 Created)**:
  ```json
  {
    "_id": "6705128df01a...",
    "title": "Understanding Rapid Application Development",
    "content": "Full Markdown or HTML content for the article...",
    "author": "670498bf89f1...",
    "imageURL": "https://xyz.supabase.co/storage/v1/object/public/articles/uuid-photo.jpg",
    "tags": ["TypeScript", "RAD", "Node.js"],
    "isVisible": true,
    "favorites": [],
    "createdAt": "2026-10-27T08:30:00.000Z",
    "updatedAt": "2026-10-27T08:30:00.000Z"
  }
  ```

---

#### 🔹 Get All Articles (Paginated)
Fetches public visible articles sorted by latest first with author info.
- **Method**: `GET`
- **URL**: `/api/v1/article?page=1&limit=10`
- **Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "_id": "6705128df01a...",
        "title": "Understanding Rapid Application Development",
        "content": "Full Markdown or HTML content...",
        "author": {
          "_id": "670498bf89f1...",
          "name": "Chathunga Bimsara",
          "email": "chathunga@example.com"
        },
        "imageURL": "https://xyz.supabase.co/storage/v1/object/public/articles/banner.png",
        "tags": ["TypeScript", "RAD"],
        "isVisible": true,
        "createdAt": "2026-10-27T08:30:00.000Z"
      }
    ],
    "meta": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
  ```

---

#### 🔹 AI Generate Description
Generates a concise article summary or concept definition using Google Gemini AI.
- **Method**: `POST`
- **URL**: `/api/v1/article/ai`
- **Request Body**:
  ```json
  {
    "text": "Microservices Architecture in Node.js"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "data": "Microservices architecture in Node.js is a design pattern where an application is broken down into small, independently deployable services that communicate over lightweight protocols such as HTTP REST or message queues..."
  }
  ```

---

## 🗄️ Database Models & Schema

### `system_users` Collection
```typescript
interface IUser {
  name: string;        // Full user name
  email: string;       // Unique indexed email address
  password: string;    // Bcrypt hashed password string
  roles: UserRole[];   // ["ADMIN" | "WRITTER" | "USER"]
  approve: boolean;    // Account activation status
  createdAt: Date;     // Managed by Mongoose timestamps
  updatedAt: Date;
}
```

### `articles` Collection
```typescript
interface IArticle {
  title: string;                 // Article headline
  content: string;               // Main body content
  author: Types.ObjectId;        // References system_users collection
  imageURL: string;              // Supabase Public CDN URL or Base64 URI
  tags: string[];                // Searchable keywords
  isVisible: boolean;            // Visibility switch (default: true)
  favorites: Types.ObjectId[];   // References to liking users
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🛡️ Security & Reliability

- **Salted Password Hashing**: Passwords are never stored as plain text. Every password undergoes 10 salt rounds with `bcryptjs`.
- **JWT Protection with Expiration**: Access tokens are kept short-lived (`30 minutes`) to mitigate token-theft risks. Long-lived refresh tokens (`7 days`) can generate fresh tokens without re-authenticating.
- **DNS Resolution Safeguard**: Resolves SRV / lookup issues encountered when connecting to remote cloud MongoDB clusters through Google DNS servers (`8.8.8.8`).
- **Resilient Media Storage Fallback**: In case of network interruptions or permission errors with Supabase Storage, the upload handler safely encodes the image into an inline Data URI (`data:${mimetype};base64,...`) without dropping article creation.

---

## 👨‍💻 Author & Contributions

- **Developer**: Chathunga Bimsara
- **GitHub**: [@chathunga2007](https://github.com/chathunga2007)
- **Course**: ITS2020 - Rapid Application Development (RAD)

Contributions and pull requests are warmly welcomed! Please open an issue first to discuss substantial modifications.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
