# CacheUp

> Join the new era of community-driven discussions. CacheUpp brings you the best of social media and forums — all in one place.

![GitHub stars](https://img.shields.io/github/stars/michael-020/CacheUp?style=social)
![License](https://img.shields.io/badge/License-ISC-blue.svg)

## ✨ Key Features

*   **User Authentication & Authorization**: Secure sign-up/sign-in with email/password and Google OAuth, including OTP verification for email and password resets. Robust role-based access for regular users and administrators.
*   **Personalized User Profiles**: Users can customize their profiles with a name, username, bio, and profile picture.
*   **Friendship System**: Send, accept, reject, and cancel friend requests. View friend lists and discover mutual friends.
*   **Real-time Messaging**: Engage in one-on-one private chats with friends, featuring real-time message exchange via WebSockets and image sharing.
*   **Dynamic Post Feed**: Create and interact with posts containing text and images. Features include liking, commenting, saving, and reporting. The feed supports infinite scrolling.
*   **Community Forums**: Participate in a structured forum environment with dedicated sections for various topics.
    *   **Forum Hierarchy**: Create and navigate through Forums, Threads, Posts, and Comments.
    *   **Engagement**: Like/dislike posts and comments, and contribute to discussions.
    *   **Thread Watching**: Subscribe to threads to receive real-time notifications for new posts and comments.
    *   **Reporting System**: Users can report inappropriate content across posts, comments, and threads.
*   **Semantic Search**: A powerful search functionality for forums that leverages vector embeddings to provide semantically relevant results across forum titles, descriptions, threads, posts, and comments.
*   **Admin Dashboard**: A dedicated interface for administrators to manage users, posts, comments, and forum requests. Monitor user activity, page views, and session durations.
*   **Image Optimization**: Images uploaded by users are processed (converted to WebP) and stored efficiently using Cloudinary.
*   **Responsive UI & Dark Mode**: A modern, responsive user interface designed with Tailwind CSS and Shadcn UI, supporting both light and dark themes.
*   **Scheduled Data Cleanup**: Automated tasks to periodically purge soft-deleted data from the database.

## 🛠️ Tech Stack

**Frontend:**
*   **React**: A JavaScript library for building user interfaces.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
*   **Vite**: A fast build tool that provides a leaner and faster development experience for modern web projects.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly styling applications.
*   **Shadcn UI**: A collection of reusable components built using Radix UI and Tailwind CSS.
*   **Zustand**: A small, fast, and scalable bear-necessities state-management solution.
*   **React Router DOM**: Declarative routing for React.js.
*   **Framer Motion**: A production-ready motion library for React.

**Backend:**
*   **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
*   **TypeScript**: Enhances code quality and maintainability.
*   **MongoDB**: A NoSQL database for flexible data storage, managed with Mongoose.
*   **PostgreSQL**: A powerful, open-source relational database, extended with `pgvector` for vector embeddings, managed with Prisma.
*   **Prisma**: A next-generation ORM for Node.js and TypeScript, used to interact with PostgreSQL.
*   **Redis**: Used for session storage to enhance scalability.
*   **JSON Web Tokens (JWT)**: For secure, stateless authentication.
*   **Bcrypt**: For hashing and salting passwords.
*   **WebSockets (`ws`)**: For real-time communication in chat and notifications.
*   **Cloudinary**: Cloud-based image and video management.
*   **Sharp**: High-performance Node.js image processing.
*   **Hugging Face Transformers (`@huggingface/transformers`)**: For generating text vector embeddings for semantic search.
*   **Zod**: TypeScript-first schema declaration and validation library.
*   **Nodemailer**: Module for sending emails.
*   **PM2**: A production process manager for Node.js applications.
*   **Axios**: Promise-based HTTP client.
*   **Dotenv**: Loads environment variables from a `.env` file.

**Databases:**
*   **MongoDB**: Primary database for most application data (users, posts, messages, forum metadata).
*   **PostgreSQL with `pgvector` extension**: Used specifically for storing and querying vector embeddings for the semantic search functionality.

**Development & Deployment:**
*   **Docker**: For containerization of both frontend and backend services.
*   **Git**: Version control.

## 🚀 Installation

To set up and run this project locally, follow these steps:

### Prerequisites

*   Node.js (v20 or higher)
*   npm (v10 or higher)
*   MongoDB instance (local or cloud-hosted)
*   PostgreSQL instance (local or cloud-hosted)
*   Docker (optional, for containerized setup)
*   Cloudinary account
*   Hugging Face account (for model download, though pre-packaged)
*   Google OAuth credentials
*   Email service credentials (e.g., Gmail)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/michael-020/CacheUp.git
    cd CacheUp
    ```
2.  **Navigate to the Backend directory:**
    ```bash
    cd Backend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Configure environment variables:**
    Create a `.env` file in the `Backend` directory based on `.env.example`:
    ```
    MONGO_URL=your_mongodb_connection_string
    DATABASE_URL="postgresql://user:password@host:port/database?schema=public" # PostgreSQL connection string

    JWT_SECRET=a_very_secret_jwt_key
    SESSION_SECRET=another_very_secret_session_key
    CREATE_ADMIN_PASS=a_strong_password_for_admin_creation

    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_app_password # Or regular password if less secure
    
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    BACKEND_URL=http://localhost:3000 # Or your deployed backend URL
    FRONTEND_URL=http://localhost:5173 # Or your deployed frontend URL
    ```
5.  **Prisma Setup & Database Migration (PostgreSQL):**
    Ensure `pgvector` extension is enabled in your PostgreSQL database.
    ```bash
    npx prisma migrate deploy
    npx prisma generate
    ```
6.  **Download AI Model (for vectorization):**
    ```bash
    npm run download:model
    ```
7.  **Seed PostgreSQL Database (for initial vector data):**
    ```bash
    npm run seed:pg
    ```
8.  **Build the backend:**
    ```bash
    npm run build
    ```
9.  **Start the backend in development mode (with Nodemon):**
    ```bash
    npm run nodemon
    ```
    Or for production build and start:
    ```bash
    npm run prod:build
    npm start
    ```

### Frontend Setup

1.  **Navigate to the Web directory:**
    ```bash
    cd ../web
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure environment variables:**
    Create a `.env` file in the `web` directory based on `.env.example`:
    ```
    VITE_API_URL=http://localhost:3000 # Must match your backend URL
    ```
4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Usage

Once both the backend and frontend are running:

1.  **Access the application:** Open your web browser and navigate to `http://localhost:5173`.
2.  **Sign Up/Sign In**: Register a new account or log in using existing credentials or Google OAuth.
3.  **Explore the Feed**: View posts from other users, like, comment, and save content. Create your own posts with text and images.
4.  **Connect with Friends**: Send and accept friend requests. Engage in real-time private messages.
5.  **Participate in Forums**: Browse various forums, join discussions in threads, create new content, and utilize the semantic search to find relevant information.
6.  **Admin Panel**: If you are an administrator, navigate to `/admin/signin` and log in with your admin credentials to access the administrative features.

## 🔧 How It Works

CacheUp is a monorepo project structured into `Backend` and `Web` applications, facilitating a comprehensive social media and forum experience.

### Backend Architecture

The `Backend` is a **Node.js** application built with **Express.js** and **TypeScript**. It serves as the API for the frontend and handles all data processing, authentication, and business logic.

*   **API Endpoints**: Routes defined in `src/routes` manage user authentication, profile management, friend interactions, post operations, forum content, and real-time messaging.
*   **Authentication & Session Management**:
    *   Users can sign up/in using local credentials or **Google OAuth** (configured in `src/config/oauth.ts`).
    *   **JWT (`jsonwebtoken`)** is used for secure session tokens.
    *   **Bcrypt** ensures passwords are securely hashed.
    *   Sessions are stored in **MongoDB** using `connect-mongo` for persistent user sessions.
    *   Email verification and password reset functionalities are handled via **Nodemailer** (`src/emailService.ts`) which sends OTPs.
*   **Database Layer**:
    *   **MongoDB**: Utilized for storing the primary application data, including user profiles (`userModel`), posts (`postModel`), chat messages (`chatModel`), and forum content metadata (`forumModel`, `threadForumModel`, `postForumModel`, `commentForumModel`). Mongoose acts as the ODM.
    *   **PostgreSQL with `pgvector`**: A relational database is employed for storing vector embeddings. The `prisma/schema.prisma` defines the schema for vector storage, and **Prisma** is used as the ORM to interact with this database.
*   **Vector Embeddings & Semantic Search**:
    *   The application leverages **Hugging Face Transformers (`@huggingface/transformers`)** to generate high-dimensional vector embeddings for text content (forum titles, descriptions, posts, comments). The model is downloaded and managed by `src/downloadModel.ts` and `src/lib/vectorizeText.ts`.
    *   These vectors are stored in **PostgreSQL** using the `pgvector` extension (`src/lib/vectorQueries.ts`).
    *   The `searchForumHandler.ts` uses these vectors to perform **semantic similarity searches**, allowing users to find relevant content even if exact keywords aren't present.
    *   `src/dbSync/seedPg.ts` ensures that MongoDB data is synchronized with PostgreSQL for vector processing, either by creating new vector entries or updating existing ones.
*   **Real-time Communication**:
    *   **WebSockets (`ws`)** are implemented in `src/websockets/index.ts` to enable real-time features.
    *   This includes instant messaging between users and live updates for online status and thread notifications.
*   **File Handling**:
    *   **Multer** (`src/middlewares/upload.ts`) processes image uploads from the frontend.
    *   **Sharp** (`src/lib/imageReEncode.ts`) is used to convert uploaded images to the WebP format for optimal performance.
    *   **Cloudinary** (`src/lib/cloudinary.ts`) stores all processed images in the cloud.
*   **Monitoring & Analytics**:
    *   `src/services/loggingService.ts` and `src/services/timeTrackingService.ts` record user activities like signups, logins, logouts, and page views, along with time spent on each page.
    *   This data feeds into the Admin Dashboard for user statistics and activity monitoring.
*   **Scheduled Tasks**: `src/lib/deleteCronJob.ts` uses `node-cron` to periodically clean up soft-deleted user data, posts, forums, and comments from MongoDB.

### Frontend Architecture

The `Web` application is a Single Page Application (SPA) built with **React** and **TypeScript**, powered by **Vite** for a fast development experience.

*   **User Interface**: Styled with **Tailwind CSS** and augmented with pre-built, accessible components from **Shadcn UI**.
*   **State Management**: **Zustand** is used for global state management, handling authentication (`AuthStore`), posts (`PostStore`), real-time chat (`chatStore`), friend relations (`FriendsStore`), forum data (`ForumStore`), and UI concerns like theme (`ThemeStore`).
*   **Routing**: **React Router DOM** (`src/App.tsx`) manages client-side navigation, providing a seamless user experience.
*   **API Interaction**: **Axios** (`src/lib/axios.ts`) is the HTTP client for communicating with the backend API.
*   **User Feedback**: **`react-hot-toast`** and **`sonner`** are used for displaying ephemeral notifications, with a custom toast component for incoming chat messages.
*   **Animations**: **Framer Motion** (`src/lib/routeAnimation.ts`) is integrated for smooth UI transitions and animations.
*   **Theme Management**: A global theme store (`useThemeStore.ts`) allows users to toggle between light and dark modes, persisting their preference locally.
*   **Optimizations**: Techniques like debouncing (`useDebounce.ts`) are used for search inputs to reduce API calls, and lazy loading of components contributes to performance.
