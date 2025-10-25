import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useRealtimeTimetable = (userClass, token) => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/timetable/class/${userClass}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTimetable(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching timetable:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();

    // Initialize Socket.IO connection
    if (!socketRef.current && token) {
      socketRef.current = io('http://localhost:4000', {
        auth: { token }
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to Socket.IO for timetable');
        setIsConnected(true);
        
        // Join class-specific room
        if (userClass) {
          socketRef.current.emit('join-class', userClass);
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Disconnected from Socket.IO');
        setIsConnected(false);
      });

      // Listen for timetable created
      socketRef.current.on('timetable:created', ({ timetable: newEntry }) => {
        console.log('📅 New timetable entry created:', newEntry);
        setTimetable(prev => [...prev, newEntry].sort((a, b) => {
          // Sort by day and period
          if (a.day !== b.day) return a.day.localeCompare(b.day);
          return a.period - b.period;
        }));
      });

      // Listen for timetable updated
      socketRef.current.on('timetable:updated', ({ timetable: updatedEntry }) => {
        console.log('📅 Timetable entry updated:', updatedEntry);
        setTimetable(prev => prev.map(entry => 
          entry._id === updatedEntry._id ? updatedEntry : entry
        ));
      });

      // Listen for timetable deleted
      socketRef.current.on('timetable:deleted', ({ timetableId }) => {
        console.log('📅 Timetable entry deleted:', timetableId);
        setTimetable(prev => prev.filter(entry => entry._id !== timetableId));
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

  return { timetable, loading, error, isConnected };
};

export default useRealtimeTimetable;
