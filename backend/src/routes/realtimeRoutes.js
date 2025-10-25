const express = require('express');
const { authenticateToken, authorizeRoles } = require('../auth');
const realtimeService = require('../services/realtimeService');

module.exports = function(io) {
  const router = express.Router();

  // Initialize realtime service with Socket.IO
  realtimeService.initializeSocket(io);

  // Admin Dashboard real-time data endpoint
  router.get('/admin/dashboard', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      const data = await realtimeService.getAdminDashboardData();
      
      // Start change streams for admin dashboard
      const adminNamespace = `admin-${req.user.id}`;
      realtimeService.startChangeStream('users', adminNamespace);
      realtimeService.startChangeStream('admissions', adminNamespace);
      realtimeService.startChangeStream('events', adminNamespace);
      realtimeService.startChangeStream('contact', adminNamespace);

      res.json({
        success: true,
        data: data,
        namespace: adminNamespace
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Teacher Dashboard real-time data endpoint
  router.get('/teacher/dashboard', authenticateToken, authorizeRoles('teacher'), async (req, res) => {
    try {
      const data = await realtimeService.getTeacherDashboardData(req.user.id);
      
      // Start change streams for teacher dashboard
      const teacherNamespace = `teacher-${req.user.id}`;
      realtimeService.startChangeStream('quizzes', teacherNamespace);
      realtimeService.startChangeStream('events', teacherNamespace);
      realtimeService.startChangeStream('diary', teacherNamespace);

      res.json({
        success: true,
        data: data,
        namespace: teacherNamespace
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Student Dashboard real-time data endpoint
  router.get('/student/dashboard', authenticateToken, authorizeRoles('student'), async (req, res) => {
    try {
      const data = await realtimeService.getStudentDashboardData(req.user.id);
      
      // Start change streams for student dashboard
      const studentNamespace = `student-${req.user.id}`;
      realtimeService.startChangeStream('quizzes', studentNamespace);
      realtimeService.startChangeStream('events', studentNamespace);
      realtimeService.startChangeStream('diary', studentNamespace);

      res.json({
        success: true,
        data: data,
        namespace: studentNamespace
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Disconnect user from real-time updates
  router.post('/disconnect', authenticateToken, (req, res) => {
    try {
      const namespace = req.body.namespace;
      if (namespace) {
        realtimeService.stopChangeStream(namespace);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  return router;
};




