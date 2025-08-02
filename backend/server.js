const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage (replace with database in production)
const users = [];
const userProgress = new Map();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register user
app.post('/api/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      createdAt: new Date()
    };

    users.push(newUser);

    // Initialize user progress
    userProgress.set(newUser.id, {
      completedModules: [],
      currentModule: null,
      totalProgress: 0,
      courses: {
        'welding-101': {
          title: 'Welding 101',
          progress: 0,
          completed: false,
          steps: [
            { id: 1, title: 'Safety Equipment', completed: false },
            { id: 2, title: 'Basic Techniques', completed: false },
            { id: 3, title: 'Practice Session', completed: false },
            { id: 4, title: 'Final Assessment', completed: false }
          ]
        }
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
app.post('/api/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(user => user.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name
  });
});

// Get user progress
app.get('/api/progress', authenticateToken, (req, res) => {
  const progress = userProgress.get(req.user.userId);
  if (!progress) {
    return res.status(404).json({ message: 'Progress not found' });
  }

  res.json(progress);
});

// Update module progress
app.post('/api/progress/:moduleId/step/:stepId', authenticateToken, (req, res) => {
  const { moduleId, stepId } = req.params;
  const progress = userProgress.get(req.user.userId);
  
  if (!progress || !progress.courses[moduleId]) {
    return res.status(404).json({ message: 'Module not found' });
  }

  const course = progress.courses[moduleId];
  const step = course.steps.find(s => s.id === parseInt(stepId));
  
  if (!step) {
    return res.status(404).json({ message: 'Step not found' });
  }

  step.completed = true;
  
  // Calculate progress
  const completedSteps = course.steps.filter(s => s.completed).length;
  course.progress = Math.round((completedSteps / course.steps.length) * 100);
  
  if (course.progress === 100) {
    course.completed = true;
    if (!progress.completedModules.includes(moduleId)) {
      progress.completedModules.push(moduleId);
    }
  }

  // Update total progress
  const totalCourses = Object.keys(progress.courses).length;
  const completedCourses = progress.completedModules.length;
  progress.totalProgress = Math.round((completedCourses / totalCourses) * 100);

  res.json({ message: 'Progress updated', progress: progress });
});

// Get training module content
app.get('/api/modules/:moduleId', authenticateToken, (req, res) => {
  const { moduleId } = req.params;
  
  const modules = {
    'welding-101': {
      id: 'welding-101',
      title: 'Welding 101: Fundamentals',
      description: 'Learn the basics of welding with AI-powered guidance and AR visualization',
      duration: '2 hours',
      difficulty: 'Beginner',
      videoUrl: '/api/videos/welding-101-intro.mp4',
      arContent: {
        model: 'welding-torch-3d',
        instructions: 'Point your device at the welding station to see AR overlay'
      },
      steps: [
        {
          id: 1,
          title: 'Safety Equipment Overview',
          content: 'Before starting any welding work, proper safety equipment is essential. This includes welding helmets with auto-darkening filters, flame-resistant clothing, welding gloves, and proper ventilation.',
          videoTimestamp: '0:00-2:30',
          arTrigger: 'safety-equipment'
        },
        {
          id: 2,
          title: 'Basic Welding Techniques',
          content: 'Learn the fundamental welding positions and movements. Start with the basic bead technique, maintaining consistent speed and angle.',
          videoTimestamp: '2:30-8:15',
          arTrigger: 'welding-technique'
        },
        {
          id: 3,
          title: 'Hands-on Practice Session',
          content: 'Apply what you\'ve learned in a guided practice session. The AI will analyze your technique and provide real-time feedback.',
          videoTimestamp: '8:15-15:00',
          arTrigger: 'practice-session'
        },
        {
          id: 4,
          title: 'Final Assessment',
          content: 'Complete a welding project to demonstrate your newly acquired skills. Your work will be evaluated against industry standards.',
          videoTimestamp: '15:00-20:00',
          arTrigger: 'final-assessment'
        }
      ]
    }
  };

  const module = modules[moduleId];
  if (!module) {
    return res.status(404).json({ message: 'Module not found' });
  }

  res.json(module);
});

// Serve static video files (mock endpoint)
app.get('/api/videos/:filename', (req, res) => {
  // In a real app, you'd serve actual video files
  res.json({ 
    message: 'Video streaming endpoint',
    filename: req.params.filename,
    url: `https://example.com/videos/${req.params.filename}`
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});