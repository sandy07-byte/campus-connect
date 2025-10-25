// Express server setup with SQLite and routes
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

const { connectMongo } = require('./storage/mongo');
const changeStreamService = require('./services/changeStreamService');
const authRoutes = require('./routes/auth');
const admissionsRoutes = require('./routes/admissions');
const feedbackRoutes = require('./routes/feedback');
const timetableRoutes = require('./routes/timetable');
const quizRoutes = require('./routes/quizzes');
const eventRoutes = require('./routes/events');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true
  }
});

const PORT = process.env.PORT || 4000;

// Allow all origins in development
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Connect MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_connect';
connectMongo(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // Initialize change stream service after successful MongoDB connection
    changeStreamService.initialize(io);
    
    // Start all change streams for real-time updates
    changeStreamService.startAllStreams();
  })
  .catch((e) => {
    console.error('❌ MongoDB connection failed', e);
    process.exit(1);
  });

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  
  // Join global room for all users
  socket.join('global');
  
  socket.on('join-namespace', (namespace) => {
    socket.join(namespace);
    console.log(`✅ Client ${socket.id} joined namespace: ${namespace}`);
  });

  // Allow clients to join class-specific rooms
  socket.on('join-class', (className) => {
    socket.join(`class:${className}`);
    console.log(`✅ Client ${socket.id} joined class room: ${className}`);
  });

  // Allow clients to leave rooms
  socket.on('leave-room', (room) => {
    socket.leave(room);
    console.log(`✅ Client ${socket.id} left room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes());
app.use('/api/admissions', admissionsRoutes());
app.use('/api/feedback', feedbackRoutes());
app.use('/api/timetable', timetableRoutes(io));
app.use('/api/quizzes', quizRoutes(io));
app.use('/api/events', eventRoutes(io));

app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(`Socket.IO server ready`);
});


