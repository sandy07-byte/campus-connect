const express = require('express');
const { authenticateToken, authorizeRoles } = require('../auth');
const { Quiz, Event, Diary, Contact, Timetable, Announcement } = require('../models/ExtendedModels');

module.exports = function() {
  const router = express.Router();

  // Quiz Routes
  router.post('/quizzes', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const { title, description, subject, class: className, questions, time_limit, due_date } = req.body;
      
      if (!title || !subject || !className || !questions || !due_date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const total_points = questions.reduce((sum, q) => sum + (q.points || 1), 0);
      
      const quiz = await Quiz.create({
        title,
        description,
        subject,
        class: className,
        teacher_id: req.user.id,
        questions,
        total_points,
        time_limit,
        due_date
      });

      return res.json({ id: quiz._id, message: 'Quiz created successfully' });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.get('/quizzes', authenticateToken, async (req, res) => {
    try {
      const userRole = req.user.role;
      let query = {};

      if (userRole === 'student') {
        query.is_active = true;
        query.due_date = { $gte: new Date() };
      } else if (userRole === 'teacher') {
        query.teacher_id = req.user.id;
      }

      const quizzes = await Quiz.find(query)
        .populate('teacher_id', 'name email')
        .sort({ createdAt: -1 })
        .lean();

      return res.json(quizzes);
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.post('/quizzes/:id/submit', authenticateToken, authorizeRoles('student'), async (req, res) => {
    try {
      const { answers, time_taken } = req.body;
      const quizId = req.params.id;

      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Check if already submitted
      const existingSubmission = quiz.submissions.find(sub => 
        sub.student_id.toString() === req.user.id
      );

      if (existingSubmission) {
        return res.status(400).json({ error: 'Quiz already submitted' });
      }

      // Calculate score
      let totalScore = 0;
      const processedAnswers = answers.map((answer, index) => {
        const question = quiz.questions[index];
        const isCorrect = answer.selected_answer === question.correct_answer;
        const pointsEarned = isCorrect ? (question.points || 1) : 0;
        totalScore += pointsEarned;

        return {
          question_index: index,
          selected_answer: answer.selected_answer,
          is_correct: isCorrect,
          points_earned: pointsEarned
        };
      });

      const percentage = Math.round((totalScore / quiz.total_points) * 100);

      quiz.submissions.push({
        student_id: req.user.id,
        answers: processedAnswers,
        total_score: totalScore,
        percentage,
        time_taken
      });

      await quiz.save();

      return res.json({ 
        message: 'Quiz submitted successfully',
        score: totalScore,
        percentage,
        total_points: quiz.total_points
      });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  // Event Routes
  router.post('/events', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const eventData = {
        ...req.body,
        created_by: req.user.id
      };

      const event = await Event.create(eventData);
      return res.json({ id: event._id, message: 'Event created successfully' });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.get('/events', async (req, res) => {
    try {
      const events = await Event.find({ is_active: true })
        .populate('created_by', 'name')
        .sort({ start_date: 1 })
        .lean();

      return res.json(events);
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.post('/events/:id/register', authenticateToken, authorizeRoles('student'), async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (!event.registration_required) {
        return res.status(400).json({ error: 'Registration not required for this event' });
      }

      // Check if already registered
      const alreadyRegistered = event.registered_participants.some(participant =>
        participant.user_id.toString() === req.user.id
      );

      if (alreadyRegistered) {
        return res.status(400).json({ error: 'Already registered for this event' });
      }

      event.registered_participants.push({
        user_id: req.user.id,
        registered_at: new Date()
      });

      await event.save();

      return res.json({ message: 'Successfully registered for the event' });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  // Diary Routes
  router.post('/diary', authenticateToken, authorizeRoles('student'), async (req, res) => {
    try {
      const { entry, mood, tags } = req.body;

      if (!entry) {
        return res.status(400).json({ error: 'Entry is required' });
      }

      const diaryEntry = await Diary.create({
        student_id: req.user.id,
        entry,
        mood,
        tags
      });

      return res.json({ id: diaryEntry._id, message: 'Diary entry created successfully' });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.get('/diary', authenticateToken, authorizeRoles('student'), async (req, res) => {
    try {
      const entries = await Diary.find({ student_id: req.user.id })
        .sort({ date: -1 })
        .lean();

      return res.json(entries);
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.get('/diary/student/:studentId', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const { studentId } = req.params;
      const entries = await Diary.find({ student_id: studentId })
        .populate('student_id', 'name email')
        .sort({ date: -1 })
        .lean();

      return res.json(entries);
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.post('/diary/:id/comment', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const { comment } = req.body;
      const diaryId = req.params.id;

      const diaryEntry = await Diary.findById(diaryId);
      if (!diaryEntry) {
        return res.status(404).json({ error: 'Diary entry not found' });
      }

      diaryEntry.teacher_comments.push({
        teacher_id: req.user.id,
        comment
      });

      await diaryEntry.save();

      return res.json({ message: 'Comment added successfully' });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  // Contact Routes
  router.post('/contact', async (req, res) => {
    try {
      const { name, email, phone, subject, message, category } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const contact = await Contact.create({
        name,
        email,
        phone,
        subject,
        message,
        category
      });

      return res.json({ id: contact._id, message: 'Message sent successfully' });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.get('/contact', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      const { status, category } = req.query;
      let query = {};

      if (status) query.status = status;
      if (category) query.category = category;

      const contacts = await Contact.find(query)
        .populate('assigned_to', 'name email')
        .sort({ createdAt: -1 })
        .lean();

      return res.json(contacts);
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.put('/contact/:id/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      const { status, assigned_to } = req.body;
      const contactId = req.params.id;

      const contact = await Contact.findById(contactId);
      if (!contact) {
        return res.status(404).json({ error: 'Contact message not found' });
      }

      contact.status = status;
      if (assigned_to) contact.assigned_to = assigned_to;
      if (status === 'closed') contact.resolved_at = new Date();

      await contact.save();

      return res.json({ message: 'Status updated successfully' });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.post('/contact/:id/reply', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      const { reply_message } = req.body;
      const contactId = req.params.id;

      if (!reply_message) {
        return res.status(400).json({ error: 'Reply message is required' });
      }

      const contact = await Contact.findById(contactId);
      if (!contact) {
        return res.status(404).json({ error: 'Contact message not found' });
      }

      contact.replies.push({
        replied_by: req.user.id,
        reply_message
      });

      contact.status = 'replied';
      await contact.save();

      return res.json({ message: 'Reply sent successfully' });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  // Timetable Routes
  router.get('/timetable/:className', authenticateToken, async (req, res) => {
    try {
      const { className } = req.params;
      const { day } = req.query;

      let query = { class_name: className, is_active: true };
      if (day) query.day_of_week = day;

      const timetable = await Timetable.find(query)
        .populate('periods.teacher_id', 'name email')
        .sort({ 'periods.period_number': 1 })
        .lean();

      return res.json(timetable);
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  // Announcement Routes
  router.post('/announcements', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const announcementData = {
        ...req.body,
        created_by: req.user.id
      };

      const announcement = await Announcement.create(announcementData);
      return res.json({ id: announcement._id, message: 'Announcement created successfully' });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.get('/announcements', authenticateToken, async (req, res) => {
    try {
      const userRole = req.user.role;
      let query = { is_active: true };

      if (userRole === 'student') {
        query.$or = [
          { target_audience: 'all' },
          { target_audience: 'students' },
          { specific_classes: { $in: [req.user.class] } }
        ];
      }

      const announcements = await Announcement.find(query)
        .populate('created_by', 'name email')
        .sort({ scheduled_at: -1 })
        .lean();

      return res.json(announcements);
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  return router;
};


