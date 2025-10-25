import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useStudentDashboard = (userClass, token) => {
  const [quizzes, setQuizzes] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    todayClasses: 0,
    pendingQuizzes: 0,
    upcomingEvents: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !userClass) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch quizzes for student's class
        const quizzesRes = await fetch(`http://localhost:4000/api/quizzes/class/${userClass}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (quizzesRes.ok) {
          const quizzesData = await quizzesRes.json();
          setQuizzes(quizzesData);
          setStats(prev => ({
            ...prev,
            pendingQuizzes: quizzesData.filter(q => q.status !== 'completed').length
          }));
        }

        // Fetch timetable
        const timetableRes = await fetch(`http://localhost:4000/api/timetable/class/${userClass}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (timetableRes.ok) {
          const timetableData = await timetableRes.json();
          setTimetable(timetableData);
          
          // Calculate today's classes
          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
          const todayClasses = timetableData.filter(entry => entry.day === today).length;
          setStats(prev => ({
            ...prev,
            todayClasses
          }));
        }

        // Fetch events
        const eventsRes = await fetch('http://localhost:4000/api/events', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData);
          
          // Count upcoming events
          const now = new Date();
          const upcoming = eventsData.filter(event => new Date(event.startDate) > now).length;
          setStats(prev => ({
            ...prev,
            upcomingEvents: upcoming
          }));
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Initialize Socket.IO connection
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:4000', {
        auth: { token }
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Student dashboard connected to Socket.IO');
        setIsConnected(true);
        
        // Join class-specific room
        if (userClass) {
          socketRef.current.emit('join-class', userClass);
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Student dashboard disconnected from Socket.IO');
        setIsConnected(false);
      });

      // Listen for quiz updates via Change Streams
      socketRef.current.on('quiz:created', ({ quiz }) => {
        console.log('📝 New quiz available:', quiz);
        setQuizzes(prev => [quiz, ...prev]);
        setStats(prev => ({
          ...prev,
          pendingQuizzes: prev.pendingQuizzes + 1
        }));
      });

      socketRef.current.on('quiz:updated', ({ quiz }) => {
        console.log('📝 Quiz updated:', quiz);
        setQuizzes(prev => prev.map(q => q._id === quiz._id ? quiz : q));
      });

      socketRef.current.on('quiz:deleted', ({ quizId }) => {
        console.log('📝 Quiz removed:', quizId);
        setQuizzes(prev => prev.filter(q => q._id !== quizId));
        setStats(prev => ({
          ...prev,
          pendingQuizzes: Math.max(0, prev.pendingQuizzes - 1)
        }));
      });

      // Listen for timetable updates
      socketRef.current.on('timetable:created', ({ timetable: newEntry }) => {
        console.log('📅 Timetable entry added:', newEntry);
        setTimetable(prev => [...prev, newEntry].sort((a, b) => {
          if (a.day !== b.day) return a.day.localeCompare(b.day);
          return a.period - b.period;
        }));
      });

      socketRef.current.on('timetable:updated', ({ timetable: updatedEntry }) => {
        console.log('📅 Timetable entry updated:', updatedEntry);
        setTimetable(prev => prev.map(entry => 
          entry._id === updatedEntry._id ? updatedEntry : entry
        ));
      });

      socketRef.current.on('timetable:deleted', ({ timetableId }) => {
        console.log('📅 Timetable entry removed:', timetableId);
        setTimetable(prev => prev.filter(entry => entry._id !== timetableId));
      });

      // Listen for event updates
      socketRef.current.on('event:created', ({ event }) => {
        console.log('🎉 New event added:', event);
        setEvents(prev => [event, ...prev].sort((a, b) => 
          new Date(a.startDate) - new Date(b.startDate)
        ));
        setStats(prev => ({
          ...prev,
          upcomingEvents: prev.upcomingEvents + 1
        }));
      });

      socketRef.current.on('event:updated', ({ event }) => {
        console.log('🎉 Event updated:', event);
        setEvents(prev => prev.map(e => e._id === event._id ? event : e));
      });

      socketRef.current.on('event:deleted', ({ eventId }) => {
        console.log('🎉 Event removed:', eventId);
        setEvents(prev => prev.filter(e => e._id !== eventId));
        setStats(prev => ({
          ...prev,
          upcomingEvents: Math.max(0, prev.upcomingEvents - 1)
        }));
      });

      socketRef.current.on('error', (err) => {
        console.error('❌ Socket.IO error:', err);
        setError(err.message);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userClass, token]);

  return { 
    quizzes, 
    timetable, 
    events,
    stats,
    loading, 
    error, 
    isConnected 
  };
};

export default useStudentDashboard;
