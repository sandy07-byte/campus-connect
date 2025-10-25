import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useTeacherDashboard = (token) => {
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeQuizzes: 0,
    averageScore: 0,
    totalSubmissions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch quizzes
        const quizzesRes = await fetch('http://localhost:4000/api/quizzes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (quizzesRes.ok) {
          const quizzesData = await quizzesRes.json();
          setQuizzes(quizzesData);

          // Calculate stats
          const totalSubmissions = quizzesData.reduce((sum, quiz) => sum + (quiz.submissions || 0), 0);
          const avgScore = quizzesData.length > 0 
            ? Math.round(quizzesData.reduce((sum, quiz) => sum + (quiz.avgScore || 0), 0) / quizzesData.length)
            : 0;

          setStats(prev => ({
            ...prev,
            activeQuizzes: quizzesData.length,
            totalSubmissions,
            averageScore: avgScore
          }));
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching teacher dashboard data:', err);
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
        console.log('✅ Teacher dashboard connected to Socket.IO');
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Teacher dashboard disconnected from Socket.IO');
        setIsConnected(false);
      });

      // Listen for quiz updates via Change Streams
      socketRef.current.on('quiz:created', ({ quiz }) => {
        console.log('📝 New quiz created:', quiz);
        setQuizzes(prev => [quiz, ...prev]);
        setStats(prev => ({
          ...prev,
          activeQuizzes: prev.activeQuizzes + 1
        }));
      });

      socketRef.current.on('quiz:updated', ({ quiz }) => {
        console.log('📝 Quiz updated:', quiz);
        setQuizzes(prev => prev.map(q => q._id === quiz._id ? quiz : q));
      });

      socketRef.current.on('quiz:deleted', ({ quizId }) => {
        console.log('📝 Quiz deleted:', quizId);
        setQuizzes(prev => prev.filter(q => q._id !== quizId));
        setStats(prev => ({
          ...prev,
          activeQuizzes: Math.max(0, prev.activeQuizzes - 1)
        }));
      });

      // Listen for quiz submissions
      socketRef.current.on('quiz_submitted', ({ quizId, score, totalQuestions }) => {
        console.log('📊 New quiz submission:', quizId, score);
        setStats(prev => ({
          ...prev,
          totalSubmissions: prev.totalSubmissions + 1
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
  }, [token]);

  return { 
    quizzes, 
    students, 
    classes,
    stats,
    loading, 
    error, 
    isConnected 
  };
};

export default useTeacherDashboard;
