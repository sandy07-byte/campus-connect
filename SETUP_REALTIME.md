# Quick Setup Guide for Real-Time Features

## Prerequisites

- Node.js installed
- MongoDB installed
- Your existing MERN project

## Step 1: Start MongoDB as Replica Set

MongoDB Change Streams require a replica set. Here's how to set it up:

### For Windows:

```powershell
# Stop MongoDB if running
net stop MongoDB

# Start MongoDB with replica set
mongod --replSet rs0 --port 27017 --dbpath "C:\data\db"

# In a new terminal, open mongo shell
mongo

# Initialize replica set (only needed once)
rs.initiate()

# Verify
rs.status()
```

### For macOS/Linux:

```bash
# Start MongoDB with replica set
mongod --replSet rs0 --port 27017 --dbpath /data/db

# In a new terminal
mongo

# Initialize replica set
rs.initiate()

# Verify
rs.status()
```

## Step 2: Start Backend Server

```bash
cd backend
npm install  # if not already installed
npm run dev
```

**Expected output:**
```
✅ MongoDB connected
🔄 ChangeStreamService initialized with Socket.IO
✅ Quiz change stream started
✅ Timetable change stream started
✅ Event change stream started
Server running on http://localhost:4000
Socket.IO server ready
```

## Step 3: Start Frontend

```bash
cd frontend
npm install  # if not already installed
npm run dev
```

## Step 4: Test Real-Time Updates

### Test 1: Quiz Updates
1. Login as **Teacher**
2. Navigate to "Quizzes" tab
3. Create a new quiz
4. In another browser/incognito window, login as **Student**
5. Navigate to "Quizzes" tab
6. **Result:** Student should see the new quiz immediately without refresh! 🎉

### Test 2: Timetable Updates
1. As **Teacher**, go to "Timetable" tab
2. Add a new timetable entry
3. As **Student** (in another window), check "Timetable" tab
4. **Result:** New entry appears instantly! ⚡

### Test 3: Event Updates
1. Login as **Admin** or **Teacher**
2. Go to "Events" tab
3. Create a new event
4. Check any other logged-in user's dashboard
5. **Result:** Event appears immediately for all users! 🎊

## Verification Checklist

✅ MongoDB replica set initialized (`rs.status()` shows success)
✅ Backend server showing "All change streams started successfully"
✅ Frontend shows 🟢 **Live** indicator in components
✅ Browser console shows "Connected to Socket.IO"
✅ Real-time updates work as expected

## Common Issues & Solutions

### Issue 1: "Change streams can only be opened on replica sets"

**Solution:** MongoDB is not running as a replica set.
```bash
# Stop MongoDB
# Start with --replSet flag
mongod --replSet rs0 --port 27017 --dbpath /data/db

# Initialize in mongo shell
rs.initiate()
```

### Issue 2: Frontend shows 🔴 Offline

**Solution:** 
- Check if backend is running on port 4000
- Verify no CORS errors in browser console
- Check if token is valid

### Issue 3: Updates not appearing

**Solution:**
- Refresh the page once to establish Socket.IO connection
- Check browser console for Socket.IO connection logs
- Verify MongoDB change streams are active (check backend logs)

### Issue 4: "WebSocket connection failed"

**Solution:**
- Check firewall settings
- Verify backend URL in frontend code
- Ensure Socket.IO server is running

## Testing Socket.IO Connection

Open browser console on frontend:
```javascript
// Should see these logs
✅ Connected to Socket.IO for quizzes
✅ Connected to Socket.IO for timetable
✅ Connected to Socket.IO for events
```

## Environment Configuration

Ensure your `.env` file has:

```env
# Backend (.env)
MONGO_URI=mongodb://127.0.0.1:27017/campus_connect?replicaSet=rs0
PORT=4000

# JWT Secret (use your existing value)
JWT_SECRET=your_secret_key
```

## Production Deployment

For production, use **MongoDB Atlas** which has replica sets enabled by default:

1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update MONGO_URI in .env
4. No need to manually initialize replica set!

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campus_connect?retryWrites=true&w=majority
```

## Performance Tips

✅ **Close unused connections** - Components automatically cleanup
✅ **Use class-specific rooms** - Reduces unnecessary broadcasts
✅ **Connection pooling** - MongoDB handles this automatically
✅ **Error recovery** - Change streams auto-reconnect on failures

## Next Steps

1. ✅ Verify real-time updates work
2. ✅ Test with multiple users
3. ✅ Check connection status indicators
4. ✅ Monitor backend logs for change stream events
5. ✅ Enjoy instant updates without page refresh!

## Support

If you encounter issues:
1. Check backend logs
2. Check browser console
3. Verify MongoDB replica set status
4. Review REALTIME_FEATURES.md for detailed documentation

---

**Your real-time updates are now ready! 🚀**
