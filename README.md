# AI-Powered Vocational Training Platform

A modern web application that combines traditional vocational training with cutting-edge AI guidance and AR visualization to accelerate learning and ensure industry-ready skills.

## 🌟 Features

### Core Functionality
- **Homepage**: Explains the AI-powered vocational training concept with modern UI
- **User Authentication**: Sign-up and login system with JWT tokens
- **Dashboard**: User progress tracking with statistics and course overview
- **Training Module**: Interactive "Welding 101" course with:
  - Video content placeholder
  - AR overlay simulation
  - Step-by-step instructions
  - Progress tracking

### Technology Stack
- **Frontend**: React with TypeScript, React Router, Axios
- **Backend**: Node.js with Express, JWT authentication, bcryptjs
- **UI/UX**: Modern CSS with gradients, responsive design, and smooth animations
- **Data Storage**: In-memory storage (easily replaceable with database)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd ai-vocational-training
   npm run install-all
   ```

2. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 5000) and frontend (port 3000) concurrently.

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Alternative: Start servers separately

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

## 📱 Application Structure

### Frontend (`/frontend`)
```
src/
├── components/
│   └── Navbar.tsx           # Navigation bar
├── contexts/
│   └── AuthContext.tsx      # Authentication state management
├── pages/
│   ├── HomePage.tsx         # Landing page with features
│   ├── LoginPage.tsx        # User login
│   ├── SignUpPage.tsx       # User registration
│   ├── Dashboard.tsx        # User progress dashboard
│   └── TrainingModule.tsx   # Interactive training content
├── services/
│   └── authService.ts       # API communication
└── App.tsx                  # Main app with routing
```

### Backend (`/backend`)
```
├── server.js               # Express server with all routes
└── package.json           # Dependencies and scripts
```

## 🎯 Key Features Demonstration

### 1. Homepage
- Modern hero section with gradient backgrounds
- Feature cards explaining AI/AR capabilities
- Call-to-action sections
- Responsive design

### 2. Authentication System
- User registration with validation
- JWT-based login system
- Protected routes
- Persistent sessions

### 3. Dashboard
- Progress statistics cards
- Course overview with completion tracking
- Visual progress bars
- Coming soon sections for future courses

### 4. Training Module (Welding 101)
- Module header with metadata
- Video placeholder (ready for real video integration)
- Interactive AR simulation toggle
- Step-by-step expandable instructions
- Progress tracking with completion marking
- Real-time progress updates

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (protected)

### Progress & Training
- `GET /api/progress` - Get user progress (protected)
- `POST /api/progress/:moduleId/step/:stepId` - Update step completion (protected)
- `GET /api/modules/:moduleId` - Get training module content (protected)

### Media
- `GET /api/videos/:filename` - Video streaming endpoint (mock)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, smooth transitions, progress animations
- **Visual Feedback**: Loading states, error handling, success confirmations
- **Accessibility**: Proper form labels, semantic HTML, keyboard navigation

## 🧪 Testing the Application

### Sample User Journey

1. **Visit Homepage** (http://localhost:3000)
   - View the AI vocational training concept explanation
   - See feature cards and benefits

2. **Create Account**
   - Click "Sign Up" 
   - Fill out registration form
   - Automatically redirected to dashboard

3. **Explore Dashboard**
   - View progress statistics
   - See available courses
   - Check step completion status

4. **Access Training Module**
   - Click "Continue Learning" on Welding 101
   - Explore video placeholder
   - Toggle AR simulation
   - Expand and complete steps
   - Track progress in real-time

5. **Test Navigation**
   - Use breadcrumb navigation
   - Access user menu
   - Logout and login again

## 🔮 Future Enhancements

### Immediate Improvements
- Database integration (PostgreSQL/MongoDB)
- Real video streaming
- Actual AR implementation using WebXR
- File upload for user-generated content
- Email verification
- Password reset functionality

### Advanced Features
- AI-powered progress analysis
- Real-time technique feedback
- Social learning features
- Certification system
- Mobile app development
- Multi-language support

### Additional Courses
- Plumbing Fundamentals
- Electrical Basics
- Construction Skills
- Automotive Repair
- HVAC Systems

## 🛠️ Development

### Code Structure
- **Modular Components**: Reusable React components
- **Type Safety**: TypeScript for better development experience
- **State Management**: Context API for authentication
- **API Layer**: Centralized service layer for backend communication
- **Responsive CSS**: Mobile-first design approach

### Environment Variables
Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000
```

Create a `.env` file in the backend directory:
```
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
```

## 📄 License

This project is built for demonstration purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ for the future of vocational training**
