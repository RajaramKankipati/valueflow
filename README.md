# ValueFlow - ACT Therapy Habit Tracker

A modern, values-based habit tracking application built with React and Node.js, incorporating Acceptance and Commitment Therapy (ACT) principles.

## Features

- 🎯 **Values Identification**: Discover and select your top 5 core values
- 🌱 **Tiny Habits**: Create small, actionable habits based on your values
- 📊 **Progress Tracking**: Daily and weekly habit tracking with streak visualization
- 🧘 **ACT Reflection**: Guided reflection exercises using ACT principles
- 💪 **Positive Reinforcement**: Encouraging messages when habits are completed
- 🔐 **User Authentication**: Secure login and data sync with MongoDB
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + React Router
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **State Management**: React Context API
- **Styling**: Tailwind CSS + Custom Components

## Quick Start

### Prerequisites

- Node.js v18 or higher ([Download](https://nodejs.org/))
- MongoDB Atlas account (free tier) or local MongoDB

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd valueflow
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
NODE_ENV=development
```

To generate a secure JWT secret:
```bash
openssl rand -base64 32
```

4. **Start development servers**
```bash
npm run dev
```

This starts:
- Backend server: http://localhost:3001
- Frontend dev server: http://localhost:5173

## Project Structure

```
valueflow/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Learn.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Values.jsx
│   │   │   ├── Habits.jsx
│   │   │   ├── DailyTracker.jsx
│   │   │   └── WeeklyTracker.jsx
│   │   ├── contexts/         # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── AppContext.jsx
│   │   └── data/             # Static data and constants
│   └── package.json
├── server/                    # Express backend
│   ├── index.js              # Server entry point
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/
│   │   └── User.js           # User model with authentication
│   ├── routes/
│   │   └── userRoutes.js     # API routes
│   └── middleware/
│       └── authMiddleware.js # JWT authentication
├── render.yaml               # Render deployment config
├── build.sh                  # Build script for deployment
└── package.json              # Root package.json
```

## Authentication & Routing

### Public Routes (No Login Required)
- `/` - Home page with tutorial
- `/learn` - ACT principles learning page
- `/login` - User login
- `/register` - User registration

### Protected Routes (Login Required)
- `/values` - Values identification and management
- `/habits` - Habit creation and management
- `/daily` - Daily habit tracking
- `/weekly` - Weekly progress review

## Usage

### 1. Register & Login
- Create an account or login
- Your data is securely stored in MongoDB

### 2. Identify Your Values
- Navigate to the Values page
- Select your top 5 core values from categories like:
  - Relationships (Family, Friendship, etc.)
  - Personal Growth (Learning, Creativity, etc.)
  - Well-being (Health, Peace of Mind, etc.)

### 3. Create Tiny Habits
- Build small, specific habits aligned with your values
- Follow the habit formula: **[ACTION] for [DURATION] after [ANCHOR]**
- Example: "Call mom for 5 minutes after breakfast"

### 4. Track Daily
- Mark habits as complete or skipped each day
- Build streaks and maintain consistency
- Get positive reinforcement for completed habits

### 5. Reflect with ACT
- When you skip a habit, use ACT principles to reflect:
  - Notice what got in the way
  - Practice acceptance and self-compassion
  - Reconnect with your values
  - Commit to next steps

## ACT Principles

This app incorporates six core ACT principles:

1. **Being Present** 🧘 - Notice when you're off track
2. **Values** 💎 - How do you want to be?
3. **Acceptance** 🤲 - This is what it feels like
4. **Defusion** 💭 - Thanks mind! What are you trying to tell me?
5. **Self-as-Context** 👤 - Practice self-compassion
6. **Committed Action** 🎯 - What will you do next?

## Deployment to Render

### Quick Deploy Steps

1. **Set up MongoDB Atlas**
   - Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create database user with password
   - Allow access from anywhere (0.0.0.0/0)
   - Copy connection string

2. **Deploy to Render**
   - Sign up at [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your Git repository
   - Set environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Random secret key
     - `NODE_ENV`: `production`
   - Click "Apply"

3. **Wait for deployment** (~5-10 minutes)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 3001, Render uses 10000) | No |

### Free Tier Notes
- App sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Auto-deploys on git push

## API Endpoints

### Authentication
- `POST /api/users` - Register new user
- `POST /api/users/login` - Login user

### Protected Endpoints (Require JWT)
- `POST /api/users/sync` - Sync app data to MongoDB
- `GET /api/users/data` - Fetch user's app data

### Health Check
- `GET /api/health` - API health status

## Development Scripts

```bash
# Install all dependencies (root + client)
npm run install-all

# Run both frontend and backend in development
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client

# Build frontend for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct in `.env`
- Check MongoDB Atlas network access allows your IP (0.0.0.0/0 for development)
- Ensure password in connection string doesn't contain special characters

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm run install-all` again
- Clear browser cache and restart dev server

### Authentication Not Working
- Check `JWT_SECRET` is set in `.env`
- Verify MongoDB is connected (check server logs)
- Clear browser localStorage and try again

## License

MIT

---

Made with ❤️ using React, Node.js, and ACT principles
