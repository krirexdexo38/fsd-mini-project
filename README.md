# 🎓 CampusHub — MERN Campus Event Registration System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v22+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-emerald?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-sky?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Academic-Mini--Project-indigo?style=for-the-badge)](LICENSE)

A complete, modern full-stack web application built for the **Full Stack Development II** subject (5th Semester CSE). **CampusHub** simplifies campus event discovery, seat-capacity-controlled registration, and administrative participant management across university departments, clubs, and student societies.

---

## 🌟 Key Features

### 👤 Student / Attendee Features
- **Public Event Discovery**: Real-time multi-criteria filtering by category (*Technical, Cultural, Sports, Workshop, Seminar, Competition*), search by event title/club, timeframe tabs (*Upcoming / Past*), and sorting.
- **Dynamic Smart Registration**: Single-click event enrollment with automatic seat tracking, deadline enforcement, duplicate prevention, and real-time remaining seat capacity indicators.
- **Personalized Student Dashboard**: Overview cards for total registrations, upcoming events schedule, and completed attendance history.
- **Self-Service Registration Cancellation**: Ability to cancel registrations before event commencement, instantly relinquishing the seat to other peers.
- **1-Click Demo Login**: Pre-configured button to immediately sign in as a student during university viva evaluations.

### 🛡️ Admin / Organizer Features
- **Organizer Console**: Real-time analytics displaying total events, upcoming activities, active bookings, registered students, and category breakdown.
- **Event CRUD Operations**: Create, view, edit, and delete events with automatic cascading clean-up of student registrations.
- **Live Seat Capacity Monitoring**: Visual progress bars tracking percentage of seats filled and remaining quotas.
- **Participant Roster Management**: Detailed participant table with attendance status toggles (`registered`, `attended`, `absent`, `cancelled`).
- **CSV Roster Export**: One-click download of attendance sheets formatted for university faculty records.
- **1-Click Demo Admin Login**: Instant one-click credentials auto-fill for evaluation.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite | Fast single-page application and responsive UI |
| **Styling** | Tailwind CSS, Lucide Icons | Modern, clean SaaS-level aesthetics without bloated libraries |
| **Routing** | React Router v6 | Client-side routing with protected route guards |
| **Backend API** | Node.js, Express.js | Modular RESTful architecture with controllers & routes |
| **Database** | MongoDB (Local or Atlas) with Mongoose | Relational schemas, virtuals, and compound unique indexing |
| **Authentication**| JWT (JSON Web Tokens) & bcryptjs | Stateless authorization and salted password hashing |
| **HTTP Client** | Axios | Centralized interceptors for token injection and error formatting |

---

## 🏛️ System Architecture

```
                               +-------------------------------------+
                               |         Client (React + Vite)       |
                               |  - Public Discovery & Landing Page  |
                               |  - Student Dashboard & History      |
                               |  - Organizer Console & Attendance   |
                               +------------------+------------------+
                                                  |
                                                  | REST API (JSON / JWT)
                                                  v
                               +-------------------------------------+
                               |       Express.js REST Service       |
                               |  - Auth & Role Middleware           |
                               |  - Controllers & Business Logic     |
                               |  - Centralized Error Handler        |
                               +------------------+------------------+
                                                  |
                                                  | Mongoose ODM
                                                  v
                               +-------------------------------------+
                               |          MongoDB Database           |
                               |  - Users (Students & Organizers)    |
                               |  - Events (Capacities & Deadlines)  |
                               |  - Registrations (Compound Index)   |
                               +-------------------------------------+
```

---

## 🗄️ Database Schema Design

### 1. `User` Schema (`backend/src/models/User.js`)
- `name` *(String, required)*
- `email` *(String, required, unique, indexed)*
- `password` *(String, hashed with bcrypt, excluded in JSON transforms)*
- `role` *(String: `'student'` or `'admin'`, default: `'student'`)*
- `department` *(String: e.g. "Computer Science & Engineering")*
- `studentId` *(String: e.g. "22CSE045")*
- `timestamps` *(createdAt, updatedAt)*

### 2. `Event` Schema (`backend/src/models/Event.js`)
- `title` *(String, required, indexed)*
- `description` *(String, required)*
- `category` *(Enum: `'Technical'`, `'Cultural'`, `'Sports'`, `'Workshop'`, `'Seminar'`, `'Competition'`, `'Other'`)*
- `date` *(Date, required, indexed)*
- `startTime` & `endTime` *(String: e.g. "10:00 AM", "01:00 PM")*
- `venue` *(String, required)*
- `organizer` *(String, required: e.g. "ACM Student Chapter")*
- `createdBy` *(ObjectId -> User, required)*
- `capacity` *(Number, required, min: 1)*
- `registeredCount` *(Number, default: 0)*
- `registrationDeadline` *(Date, required)*
- `bannerUrl` *(String, default curated Unsplash campus imagery)*
- `status` *(Enum: `'published'`, `'draft'`, `'completed'`, `'cancelled'`)*
- **Virtuals**: `remainingSeats` and `isRegistrationOpen`

### 3. `Registration` Schema (`backend/src/models/Registration.js`)
- `event` *(ObjectId -> Event, required, indexed)*
- `user` *(ObjectId -> User, required, indexed)*
- `status` *(Enum: `'registered'`, `'attended'`, `'absent'`, `'cancelled'`, default: `'registered'`)*
- `registeredAt` *(Date, default: Date.now)*
- **Compound Unique Index**: `{ event: 1, user: 1 }` (guarantees zero duplicate registrations at the database level)

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register student or club organizer |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue signed JWT |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile |

### 📅 Events (`/api/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | Browse events with `search`, `category`, `timeframe`, `sort`, `page` |
| `GET` | `/api/events/stats` | Public | Aggregate platform totals for homepage statistics counter |
| `GET` | `/api/events/:id` | Public / Auth | Single event details + current student enrollment status |
| `POST` | `/api/events` | Admin | Create a new campus event |
| `PUT` | `/api/events/:id` | Admin | Update event details, timings, venue, or capacity |
| `DELETE` | `/api/events/:id` | Admin | Permanently delete event and cascade remove registrations |

### 🎟️ Registrations (`/api/registrations` & `/api/events/:id`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/events/:id/register` | Student | Register for an open event (validates deadline & capacity) |
| `DELETE` | `/api/events/:id/register` | Student | Cancel registration before event date |
| `GET` | `/api/registrations/my` | Student | Get personal registration history and upcoming schedule |
| `GET` | `/api/events/:id/registrations` | Admin | Get participant roster with search & status filters |
| `PATCH`| `/api/registrations/:id/status`| Admin | Update student attendance (`attended`, `absent`, `cancelled`) |

### 📊 Admin Analytics (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Consolidated dashboard analytics and category distribution |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+ or v22+)
- **npm** (v9+ or v10+)
- **MongoDB** (Local MongoDB Windows Service or MongoDB Atlas cluster connection string)

### 1. Clone or Open Workspace
```bash
cd "Mini Project"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure your environment variables in `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campushub
JWT_SECRET=campushub_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Note**: If using MongoDB Atlas, replace `MONGODB_URI` with your connection string:  
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/campushub?retryWrites=true&w=majority`

### 3. Seed Database
Populate 5 sample users, 12 realistic campus events, and active registrations:
```bash
npm run seed
```

### 4. Start Backend Server
```bash
npm run dev
```
Backend API will be running at `http://localhost:5000/api`.

---

### 5. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be running at `http://localhost:5173`.

---

## 🔑 Demo Credentials (Viva Demonstration)

The application includes convenient **1-Click Demo Buttons** on the `/login` page:

| Role | Email | Password | Pre-loaded Data |
|---|---|---|---|
| 👑 **Admin / Organizer** | `admin@campushub.edu` | `Admin@123` | Full control over all 12 events, analytics, and participant rosters |
| 🎓 **Student (Primary)** | `student@campushub.edu` | `Student@123` | Registered for CodeSprint, MERN Masterclass, Aura Gala |
| 🎓 **Student (Alternative)** | `aarav@campushub.edu` | `Student@123` | Registered for Algolympics & Esports Tournament |
| 🎓 **Student (Alternative)** | `priya@campushub.edu` | `Student@123` | Registered for AI Seminar & CampusLens Photo Walk |

---

## 🎯 Recommended 5-Minute Viva Demonstration Flow

1. **Public Landing Page (`/`)**:
   - Show modern Hero section, live platform statistics (Total Events, Registrations, Clubs).
   - Point out Featured Upcoming Events and Category Exploration.
2. **Event Discovery (`/events`)**:
   - Search for *"Hackathon"*.
   - Filter by Category (*"Workshop"*).
   - Show how seat capacity progress bars update dynamically.
3. **Event Details (`/events/:id`)**:
   - Open *"Future of Generative AI & Autonomous Agents"*.
   - Point out remaining seats count and the smart CTA button *"Sign In to Register"*.
4. **Student Experience**:
   - Go to `/login`, click the **"Demo Student"** 1-click button, and sign in.
   - Return to the event and click **"Register For Event"** — observe immediate success toast and button state changing to *"Registered"*.
   - Navigate to **"My Registrations" (`/dashboard`)** to review the student's upcoming schedule and registration history.
   - Click **"Cancel Registration"** to show real-time seat rollback.
5. **Admin / Organizer Experience**:
   - Log out and log in using **"Demo Admin"**.
   - Review live analytics in the **Organizer Console (`/admin`)**.
   - Click **"View Participants Roster"** for an event.
   - Change a student's status from *Registered* to *Attended* — notice instant badge update and toast.
   - Click **"Export CSV"** to demonstrate download of the attendance sheet.

---

## 📂 Project Structure

```
Mini Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & error logging
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, profile
│   │   │   ├── eventController.js    # Event CRUD, filters, pagination
│   │   │   ├── registrationController.js # Event registration & cancellation
│   │   │   └── adminController.js    # Dashboard analytics aggregation
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   │   └── errorMiddleware.js    # Global error & 404 handlers
│   │   ├── models/
│   │   │   ├── User.js               # User model with bcrypt hashing
│   │   │   ├── Event.js              # Event model with capacity virtuals
│   │   │   └── Registration.js       # Registration model with compound index
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth endpoints
│   │   │   ├── eventRoutes.js        # /api/events endpoints
│   │   │   ├── registrationRoutes.js # /api/registrations endpoints
│   │   │   └── adminRoutes.js        # /api/admin endpoints
│   │   ├── utils/
│   │   │   └── seedData.js           # Realistic campus mock datasets
│   │   ├── app.js                    # Express app configuration & middleware
│   │   ├── server.js                 # Server entry point
│   │   └── seed.js                   # Database seeding CLI script
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx        # Navigation header with role drawer
│   │   │   │   ├── Footer.jsx        # CampusHub footer with tech tags
│   │   │   │   ├── Badge.jsx         # Category & status badges
│   │   │   │   ├── StatCard.jsx      # Metrics card with icons
│   │   │   │   ├── Modal.jsx         # Accessible modal dialog
│   │   │   │   ├── LoadingSpinner.jsx# Animated loading spinner
│   │   │   │   ├── SkeletonCard.jsx  # Shimmer placeholder loaders
│   │   │   │   ├── EmptyState.jsx    # User-friendly empty state illustration
│   │   │   │   └── ProtectedRoute.jsx# Auth & role-based route guard
│   │   │   └── events/
│   │   │       ├── EventCard.jsx     # Card with banner, seats meter & meta
│   │   │       ├── EventGrid.jsx     # Responsive grid container
│   │   │       ├── EventFilters.jsx  # Live search, category pills & sort
│   │   │       └── EventFormModal.jsx# Admin event create/edit modal form
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Global authentication state
│   │   │   └── ToastContext.jsx      # Custom floating toast notifications
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Public landing page with live counters
│   │   │   ├── EventsPage.jsx        # Dedicated discovery catalog
│   │   │   ├── EventDetailsPage.jsx  # Details view & smart register button
│   │   │   ├── LoginPage.jsx         # Sign-in with 1-click demo buttons
│   │   │   ├── RegisterPage.jsx      # Student registration form
│   │   │   ├── UserDashboardPage.jsx # Student registration schedule & history
│   │   │   ├── AdminDashboardPage.jsx# Organizer console & events CRUD
│   │   │   └── AdminParticipantsPage.jsx # Roster view & attendance tracker
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance with interceptors
│   │   │   ├── authService.js        # Auth API requests
│   │   │   ├── eventService.js       # Event API requests
│   │   │   └── registrationService.js# Registration API requests
│   │   ├── App.jsx                   # React Router layout
│   │   ├── main.jsx                  # React DOM mount
│   │   └── index.css                 # Tailwind directives & styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🛡️ Security & Validation Measures
- **Password Protection**: Passwords are never stored in plain text; salted and hashed using `bcryptjs` with factor 10. Passwords are explicitly scrubbed from API output via Mongoose schema `toJSON` transforms.
- **Stateless JWT Tokens**: Signed tokens with 30-day expiration, verified on all protected student and organizer routes.
- **Role-Based Access Control (RBAC)**: Middleware strictly checks for `req.user.role === 'admin'` before allowing event creation, deletion, or attendance modification.
- **Race Condition & Duplicate Prevention**: Compound unique indexing (`{ event: 1, user: 1 }`) ensures atomic enforcement against double registration even during concurrent clicks.
- **Validation**: Strict boundary checks on event capacities, registration deadlines, and role-authorized status changes.

---

## 👨‍💻 Academic Project Details
- **Subject**: Full Stack Development II (5th Semester)
- **Degree**: B.Tech. Computer Science & Engineering (CSE)
- **Year**: 3rd Year Undergraduates
