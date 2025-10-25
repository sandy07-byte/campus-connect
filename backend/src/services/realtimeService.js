const mongoose = require('mongoose');
const User = require('../models/User');
const Admission = require('../models/Admission');
const { Quiz, Event, Diary, Contact } = require('../models/ExtendedModels');

class RealtimeService {
  constructor() {
    this.changeStreams = new Map();
    this.io = null;
  }

  initializeSocket(io) {
    this.io = io;
    console.log('RealtimeService initialized with Socket.IO');
  }

  // Start change stream for a specific collection
  startChangeStream(collectionName, namespace) {
    if (this.changeStreams.has(namespace)) {
      return; // Already watching
    }

    let Model;
    switch (collectionName) {
      case 'users':
        Model = User;
        break;
      case 'admissions':
        Model = Admission;
        break;
      case 'quizzes':
        Model = Quiz;
        break;
      case 'events':
        Model = Event;
        break;
      case 'diary':
        Model = Diary;
        break;
      case 'contact':
        Model = Contact;
        break;
      default:
        console.error(`Unknown collection: ${collectionName}`);
        return;
    }

    try {
      const changeStream = Model.watch();
      
      changeStream.on('change', (change) => {
        console.log(`Change detected in ${collectionName}:`, change.operationType);
        
        // Emit to specific namespace
        if (this.io) {
          this.io.to(namespace).emit('dataChange', {
            collection: collectionName,
            operation: change.operationType,
            data: change.fullDocument || change.documentKey,
            timestamp: new Date()
          });
        }
      });

      changeStream.on('error', (error) => {
        console.error(`Change stream error for ${collectionName}:`, error);
        this.changeStreams.delete(namespace);
      });

      this.changeStreams.set(namespace, changeStream);
      console.log(`Started change stream for ${collectionName} on namespace ${namespace}`);
      
    } catch (error) {
      console.error(`Failed to start change stream for ${collectionName}:`, error);
    }
  }

  // Stop change stream for a namespace
  stopChangeStream(namespace) {
    const changeStream = this.changeStreams.get(namespace);
    if (changeStream) {
      changeStream.close();
      this.changeStreams.delete(namespace);
      console.log(`Stopped change stream for namespace ${namespace}`);
    }
  }

  // Get real-time data for Admin Dashboard
  async getAdminDashboardData() {
    try {
      const [students, teachers, admissions, events, contacts] = await Promise.all([
        User.find({ role: 'student' }).select('name email class status createdAt').lean(),
        User.find({ role: 'teacher' }).select('name email subjects classes createdAt').lean(),
        Admission.find().sort({ createdAt: -1 }).lean(),
        Event.find().sort({ date: 1 }).lean(),
        Contact.find().sort({ createdAt: -1 }).lean()
      ]);

      return {
        students: {
          total: students.length,
          list: students
        },
        teachers: {
          total: teachers.length,
          list: teachers
        },
        admissions: {
          total: admissions.length,
          pending: admissions.filter(a => a.status === 'pending').length,
          approved: admissions.filter(a => a.status === 'approved').length,
          declined: admissions.filter(a => a.status === 'declined').length,
          list: admissions
        },
        events: {
          total: events.length,
          upcoming: events.filter(e => new Date(e.date) > new Date()).length,
          list: events
        },
        contacts: {
          total: contacts.length,
          pending: contacts.filter(c => c.status === 'pending').length,
          resolved: contacts.filter(c => c.status === 'resolved').length,
          list: contacts
        }
      };
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      throw error;
    }
  }

  // Get real-time data for Teacher Dashboard
  async getTeacherDashboardData(teacherId) {
    try {
      // First get the teacher data
      const teacher = await User.findById(teacherId).select('name email subjects classes').lean();
      
      if (!teacher) {
        throw new Error('Teacher not found');
      }

      // Then get other data using the teacher's classes
      const [quizzes, students, events] = await Promise.all([
        Quiz.find({ teacher_id: teacherId }).sort({ createdAt: -1 }).lean(),
        User.find({ role: 'student', class: { $in: teacher.classes || [] } }).select('name email class').lean(),
        Event.find({ 
          $or: [
            { audience: 'all' },
            { audience: 'teacher' },
            { organizer_id: teacherId }
          ]
        }).sort({ date: 1 }).lean()
      ]);

      // Now get diary entries for the students
      const diaryEntries = await Diary.find({ 
        student_id: { $in: students.map(s => s._id) }
      }).sort({ date: -1 }).lean();

      return {
        teacher: teacher,
        quizzes: {
          total: quizzes.length,
          published: quizzes.filter(q => q.status === 'published').length,
          draft: quizzes.filter(q => q.status === 'draft').length,
          list: quizzes
        },
        students: {
          total: students.length,
          list: students
        },
        events: {
          total: events.length,
          upcoming: events.filter(e => new Date(e.date) > new Date()).length,
          list: events
        },
        diary: {
          total: diaryEntries.length,
          recent: diaryEntries.slice(0, 10),
          list: diaryEntries
        }
      };
    } catch (error) {
      console.error('Error fetching teacher dashboard data:', error);
      throw error;
    }
  }

  // Get real-time data for Student Dashboard
  async getStudentDashboardData(studentId) {
    try {
      // First get the student data
      const student = await User.findById(studentId).select('name email class').lean();
      
      if (!student) {
        throw new Error('Student not found');
      }

      // Then get other data using the student's class
      const [quizzes, events, diaryEntries] = await Promise.all([
        Quiz.find({ 
          class_id: student.class,
          status: 'published'
        }).sort({ due_date: 1 }).lean(),
        Event.find({ 
          $or: [
            { audience: 'all' },
            { audience: 'student' }
          ]
        }).sort({ date: 1 }).lean(),
        Diary.find({ student_id: studentId }).sort({ date: -1 }).lean()
      ]);

      return {
        student: student,
        quizzes: {
          total: quizzes.length,
          upcoming: quizzes.filter(q => new Date(q.due_date) > new Date()).length,
          list: quizzes
        },
        events: {
          total: events.length,
          upcoming: events.filter(e => new Date(e.date) > new Date()).length,
          list: events
        },
        diary: {
          total: diaryEntries.length,
          recent: diaryEntries.slice(0, 5),
          list: diaryEntries
        }
      };
    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
      throw error;
    }
  }

  // Cleanup all change streams
  cleanup() {
    this.changeStreams.forEach((changeStream, namespace) => {
      changeStream.close();
    });
    this.changeStreams.clear();
    console.log('All change streams cleaned up');
  }
}

module.exports = new RealtimeService();

