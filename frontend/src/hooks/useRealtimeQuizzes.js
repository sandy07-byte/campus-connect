import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useRealtimeQuizzes = (userClass, token) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/quizzes/class/${userClass}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQuizzes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();

    // Initialize Socket.IO connection
    if (!socketRef.current && token) {
      socketRef.current = io('http://localhost:4000', {
        auth: { token }
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to Socket.IO for quizzes');
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

      // Listen for quiz created
      socketRef.current.on('quiz:created', ({ quiz }) => {
        console.log('📝 New quiz created:', quiz);
        setQuizzes(prev => [quiz, ...prev]);
      });

      // Listen for quiz updated
      socketRef.current.on('quiz:updated', ({ quiz }) => {
        console.log('📝 Quiz updated:', quiz);
        setQuizzes(prev => prev.map(q => q._id === quiz._id ? quiz : q));
      });

      // Listen for quiz deleted
      socketRef.current.on('quiz:deleted', ({ quizId }) => {
        console.log('📝 Quiz deleted:', quizId);
        setQuizzes(prev => prev.filter(q => q._id !== quizId));
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

  return { quizzes, loading, error, isConnected };
};

export default useRealtimeQuizzes;
