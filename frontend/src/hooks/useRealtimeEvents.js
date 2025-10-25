import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useRealtimeEvents = (token) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/events', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Initialize Socket.IO connection
    if (!socketRef.current && token) {
      socketRef.current = io('http://localhost:4000', {
        auth: { token }
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to Socket.IO for events');
        setIsConnected(true);
        
        // Join global room for events
        socketRef.current.emit('join-namespace', 'global');
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Disconnected from Socket.IO');
        setIsConnected(false);
      });

      // Listen for event created
      socketRef.current.on('event:created', ({ event }) => {
        console.log('🎉 New event created:', event);
        setEvents(prev => [event, ...prev].sort((a, b) => 
          new Date(a.startDate) - new Date(b.startDate)
        ));
      });

      // Listen for event updated
      socketRef.current.on('event:updated', ({ event }) => {
        console.log('🎉 Event updated:', event);
        setEvents(prev => prev.map(e => e._id === event._id ? event : e));
      });

      // Listen for event deleted
      socketRef.current.on('event:deleted', ({ eventId }) => {
        console.log('🎉 Event deleted:', eventId);
        setEvents(prev => prev.filter(e => e._id !== eventId));
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
  }, [token]);

  return { events, loading, error, isConnected };
};

export default useRealtimeEvents;
