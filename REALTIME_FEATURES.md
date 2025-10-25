# Real-Time Updates with MongoDB Change Streams & Socket.IO

This document explains how the real-time features work in the Campus Connect application.

## 🎯 Overview

The application now supports **real-time updates** using:
- **MongoDB Change Streams** - Monitors database changes
- **Socket.IO** - Pushes updates to connected clients instantly

## ✨ Features

### Real-Time Updates For:

1. **Quizzes** 📝
   - Teachers create quizzes → Students see them instantly
   - Quiz updates appear live
   - Quiz deletions remove from UI immediately

2. **Timetables** 📅
   - Teachers add/update timetable entries → Students see changes live
   - Changes sync across all dashboards in real-time

3. **Events** 🎉
   - Admins/Teachers create events → All users see them instantly
   - Event updates broadcast to all connected clients
   - Deleted events disappear immediately

## 🏗️ Architecture

### Backend (MongoDB Change Streams)

```
MongoDB Collection → Change Stream → Socket.IO → Frontend
```

**File: `backend/src/services/changeStreamService.js`**

The `ChangeStreamService` watches MongoDB collections and emits Socket.IO events:

- Watches: `quizzes`, `timetables`, `events` collections
- Emits events: `quiz:created`, `quiz:updated`, `quiz:deleted`, etc.
- Auto-reconnects on errors

**File: `backend/src/server.js`**

Initializes change streams after MongoDB connection:

```javascript
changeStreamService.initialize(io);
changeStreamService.startAllStreams();
```

### Frontend (Socket.IO Listeners)

**Custom Hooks:**

1. **`useRealtimeQuizzes`** - Real-time quiz updates
2. **`useRealtimeTimetable`** - Real-time timetable updates
3. **`useRealtimeEvents`** - Real-time event updates

These hooks:
- Connect to Socket.IO server
- Join appropriate rooms (class-specific, global)
- Listen for change events
- Update UI automatically
- Handle connection status

## 📦 Components Updated

### Student Dashboard
- **QuizList** - Shows live quiz updates
- **TimetableView** - Displays real-time timetable
- **EventList** - Shows live event updates

### Teacher Dashboard
- **TimetableManage** - Add/edit timetables with instant updates
- **EventManage** - Create events visible immediately

### Admin Dashboard
- **EventManage** - Create/update events broadcast to all users

## 🚀 How It Works

### Example: Teacher Creates a Quiz

1. **Teacher** clicks "Create Quiz" and submits form
2. **Backend** saves quiz to MongoDB
3. **Change Stream** detects the insert operation
4. **Socket.IO** emits `quiz:created` event with quiz data
5. **Students** listening to that class room receive the event
6. **Frontend Hook** updates local state
7. **UI** shows new quiz instantly (no refresh needed)

### Socket.IO Rooms

- `global` - All users
- `class:${className}` - Class-specific updates
- `${namespace}` - Custom namespaces

### Events Emitted

#### Quizzes
- `quiz:created` - New quiz added
- `quiz:updated` - Quiz modified
- `quiz:deleted` - Quiz removed

#### Timetables
- `timetable:created` - New entry added
- `timetable:updated` - Entry modified
- `timetable:deleted` - Entry removed

#### Events
- `event:created` - New event added
- `event:updated` - Event modified
- `event:deleted` - Event removed

## 🔧 Configuration

### Environment Variables

Make sure MongoDB is running as a **Replica Set** (required for Change Streams):

```env
MONGO_URI=mongodb://127.0.0.1:27017/campus_connect?replicaSet=rs0
```

### Starting MongoDB as Replica Set

```bash
# Start MongoDB with replica set
mongod --replSet rs0 --port 27017 --dbpath /data/db

# In mongo shell, initialize replica set
rs.initiate()
```

## 💡 Usage

### In Components

```jsx
import useRealtimeQuizzes from '../../hooks/useRealtimeQuizzes';

function QuizList({ userClass }) {
  const token = localStorage.getItem('token');
  const { quizzes, loading, error, isConnected } = useRealtimeQuizzes(userClass, token);
  
  return (
    <div>
      <span className={isConnected ? 'connected' : 'disconnected'}>
        {isConnected ? '🟢 Live' : '🔴 Offline'}
      </span>
      {quizzes.map(quiz => <QuizCard key={quiz._id} quiz={quiz} />)}
    </div>
  );
}
```

## 🐛 Troubleshooting

### Change Streams Not Working?

1. **Check MongoDB Replica Set**
   ```bash
   # In mongo shell
   rs.status()
   ```
   
2. **Check Server Logs**
   ```
   ✅ MongoDB connected
   🔄 ChangeStreamService initialized with Socket.IO
   ✅ Quiz change stream started
   ✅ Timetable change stream started
   ✅ Event change stream started
   ```

3. **Check Frontend Console**
   ```
   ✅ Connected to Socket.IO for quizzes
   📝 New quiz created: {...}
   ```

### Connection Issues?

- Verify `http://localhost:4000` is correct backend URL
- Check CORS configuration in backend
- Ensure token is valid
- Check browser console for WebSocket errors

## 📊 Benefits

✅ **Instant Updates** - No page refresh needed
✅ **Better UX** - Users see changes immediately
✅ **Scalable** - MongoDB Change Streams are production-ready
✅ **Reliable** - Auto-reconnection on network issues
✅ **Efficient** - Only changed data is transmitted

## 🔒 Security

- Authentication required for Socket.IO connections
- JWT token validation
- Room-based access control
- Class-specific data isolation

## 📝 Notes

- Change Streams require MongoDB 3.6+ with Replica Set
- For development, use local replica set
- For production, use MongoDB Atlas (has replica sets by default)
- Socket.IO automatically handles reconnection
- All hooks include error handling and loading states

## 🎨 UI Indicators

All components now show connection status:
- 🟢 **Live** - Real-time updates active
- 🔴 **Offline** - Connection lost (will auto-reconnect)

## 🚀 Performance

- Minimal overhead from Change Streams
- Efficient Socket.IO rooms reduce unnecessary broadcasts
- Automatic cleanup on component unmount
- Debounced updates prevent UI thrashing

---

**Developed for Campus Connect - Real-Time School Management System**
