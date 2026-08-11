# EduChamp - E-Learning Results Management System

A full-stack web application for managing and distributing student results to parents via SMS/WhatsApp.

## Features

- **Admin Panel**: Upload student results via Excel sheets
- **Parent Dashboard**: View children's academic results in real-time
- **SMS/WhatsApp Notifications**: Automatic notifications to parents when results are uploaded
- **Excel Parsing**: Parse and validate student data from Excel files
- **Role-based Access**: Admin and Parent roles with different permissions
- **Secure Authentication**: JWT-based user authentication

## Project Structure

```
educhamp/
├── public/                 # Static assets
├── src/                    # Frontend (React)
│   ├── components/        # Reusable React components
│   ├── pages/             # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── AdminPanel.jsx
│   ├── services/          # API service layer
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── server/                # Backend (Node.js + Express)
│   ├── models/            # MongoDB schemas
│   │   ├── User.js
│   │   ├── Student.js
│   │   └── Result.js
│   ├── routes/            # API endpoints
│   │   ├── auth.js
│   │   └── results.js
│   ├── middleware/        # Auth middleware
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── vite.config.js
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173/`

### Backend Setup

1. **Navigate to server folder**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your settings**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/educhamp
   JWT_SECRET=your_secret_key_here
   FIREBASE_PROJECT_ID=your_firebase_id
   FIREBASE_PRIVATE_KEY=your_firebase_key
   FIREBASE_CLIENT_EMAIL=your_firebase_email
   ```

5. **Start the server** (development mode with auto-reload)
   ```bash
   npm run dev
   ```
   Or production mode:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000/`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Results Management
- `POST /api/results/upload` - Upload Excel file with results
- `GET /api/results/parent/:parentId` - Get results for parent's children

## Excel Upload Format

Your Excel file should have the following columns:
| studentId | subject | score | maxScore | examType |
|-----------|---------|-------|----------|----------|
| STU001 | Mathematics | 85 | 100 | Mid-term |
| STU002 | English | 92 | 100 | Mid-term |

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: 'admin' | 'parent',
  children: [ObjectId],
  createdAt: Date
}
```

### Student
```javascript
{
  name: String,
  studentId: String (unique),
  parent: ObjectId,
  class: String,
  section: String,
  createdAt: Date
}
```

### Result
```javascript
{
  student: ObjectId,
  subject: String,
  score: Number,
  maxScore: Number,
  percentage: Number,
  grade: String (A-F),
  examType: String,
  uploadedAt: Date,
  notificationSent: Boolean
}
```

## Testing the App

### As Admin:
1. Register with role "Admin"
2. Login with admin credentials
3. Upload an Excel file with student results
4. Results are added to the database

### As Parent:
1. Register with role "Parent"
2. Login with parent credentials
3. View your children's results
4. Receive notifications when new results are added

## Future Enhancements

- [ ] SMS/WhatsApp integration via Twilio
- [ ] Email notifications
- [ ] Better analytics and performance tracking
- [ ] Attendance tracking
- [ ] Fee management
- [ ] Teacher portal for result entry
- [ ] Mobile app

## Tech Stack

**Frontend:**
- React 18
- Vite
- Axios
- CSS3

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Firebase Cloud Messaging

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
