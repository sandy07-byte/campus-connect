const Quiz = require('../models/Quiz');
const Timetable = require('../models/Timetable');
const Event = require('../models/Event');

class ChangeStreamService {
  constructor() {
    this.streams = new Map();
    this.io = null;
  }

  initialize(io) {
    this.io = io;
    console.log('🔄 ChangeStreamService initialized with Socket.IO');
  }

  startAllStreams() {
    if (!this.io) {
      console.error('❌ Socket.IO not initialized');
      return;
    }

    this.startQuizChangeStream();
    this.startTimetableChangeStream();
    this.startEventChangeStream();
    
    console.log('✅ All change streams started successfully');
  }

  startQuizChangeStream() {
    try {
      const quizStream = Quiz.watch([], { 
        fullDocument: 'updateLookup'
      });

      quizStream.on('change', async (change) => {
        console.log('📝 Quiz change detected:', change.operationType);
        
        try {
          let quiz = null;
          
          switch (change.operationType) {
            case 'insert':
              quiz = change.fullDocument;
              // Populate teacher info
              quiz = await Quiz.findById(quiz._id).populate('teacher', 'name email').lean();
              
              // Emit to global namespace
              this.io.emit('quiz:created', { quiz });
              
              // Emit to class-specific room
              if (quiz.class) {
                this.io.to(`class:${quiz.class}`).emit('quiz:created', { quiz });
              }
              
              console.log(`✅ Quiz created event emitted for class: ${quiz.class}`);
              break;

            case 'update':
              if (change.fullDocument) {
                quiz = await Quiz.findById(change.fullDocument._id)
                  .populate('teacher', 'name email')
                  .lean();
                
                this.io.emit('quiz:updated', { quiz });
                
                if (quiz.class) {
                  this.io.to(`class:${quiz.class}`).emit('quiz:updated', { quiz });
                }
                
                console.log(`✅ Quiz updated event emitted for class: ${quiz.class}`);
              }
              break;

            case 'delete':
              const quizId = change.documentKey._id;
              this.io.emit('quiz:deleted', { quizId });
              console.log(`✅ Quiz deleted event emitted for ID: ${quizId}`);
              break;
          }
        } catch (error) {
          console.error('Error handling quiz change:', error);
        }
      });

      quizStream.on('error', (error) => {
        console.error('❌ Quiz change stream error:', error);
        // Attempt to restart the stream
        setTimeout(() => this.startQuizChangeStream(), 5000);
      });

      this.streams.set('quiz', quizStream);
      console.log('✅ Quiz change stream started');
    } catch (error) {
      console.error('❌ Failed to start quiz change stream:', error);
    }
  }

  startTimetableChangeStream() {
    try {
      const timetableStream = Timetable.watch([], { 
        fullDocument: 'updateLookup'
      });

      timetableStream.on('change', async (change) => {
        console.log('📅 Timetable change detected:', change.operationType);
        
        try {
          let timetable = null;
          
          switch (change.operationType) {
            case 'insert':
              timetable = change.fullDocument;
              
              // Emit to global namespace
              this.io.emit('timetable:created', { timetable });
              
              // Emit to class-specific room
              if (timetable.class) {
                this.io.to(`class:${timetable.class}`).emit('timetable:created', { timetable });
              }
              
              console.log(`✅ Timetable created event emitted for class: ${timetable.class}`);
              break;

            case 'update':
              if (change.fullDocument) {
                timetable = change.fullDocument;
                
                this.io.emit('timetable:updated', { timetable });
                
                if (timetable.class) {
                  this.io.to(`class:${timetable.class}`).emit('timetable:updated', { timetable });
                }
                
                console.log(`✅ Timetable updated event emitted for class: ${timetable.class}`);
              }
              break;

            case 'delete':
              const timetableId = change.documentKey._id;
              this.io.emit('timetable:deleted', { timetableId });
              console.log(`✅ Timetable deleted event emitted for ID: ${timetableId}`);
              break;
          }
        } catch (error) {
          console.error('Error handling timetable change:', error);
        }
      });

      timetableStream.on('error', (error) => {
        console.error('❌ Timetable change stream error:', error);
        setTimeout(() => this.startTimetableChangeStream(), 5000);
      });

      this.streams.set('timetable', timetableStream);
      console.log('✅ Timetable change stream started');
    } catch (error) {
      console.error('❌ Failed to start timetable change stream:', error);
    }
  }

  startEventChangeStream() {
    try {
      const eventStream = Event.watch([], { 
        fullDocument: 'updateLookup'
      });

      eventStream.on('change', async (change) => {
        console.log('🎉 Event change detected:', change.operationType);
        
        try {
          let event = null;
          
          switch (change.operationType) {
            case 'insert':
              event = change.fullDocument;
              // Populate creator info
              event = await Event.findById(event._id)
                .populate('createdBy', 'name email')
                .lean();
              
              // Emit to all users
              this.io.emit('event:created', { event });
              
              // Also emit to global room
              this.io.to('global').emit('event:created', { event });
              
              // Emit to specific scopes
              if (event.scope === 'class' && event.targetClasses) {
                event.targetClasses.forEach(className => {
                  this.io.to(`class:${className}`).emit('event:created', { event });
                });
              }
              
              console.log(`✅ Event created event emitted for scope: ${event.scope}`);
              break;

            case 'update':
              if (change.fullDocument) {
                event = await Event.findById(change.fullDocument._id)
                  .populate('createdBy', 'name email')
                  .lean();
                
                this.io.emit('event:updated', { event });
                this.io.to('global').emit('event:updated', { event });
                
                if (event.scope === 'class' && event.targetClasses) {
                  event.targetClasses.forEach(className => {
                    this.io.to(`class:${className}`).emit('event:updated', { event });
                  });
                }
                
                console.log(`✅ Event updated event emitted for scope: ${event.scope}`);
              }
              break;

            case 'delete':
              const eventId = change.documentKey._id;
              this.io.emit('event:deleted', { eventId });
              this.io.to('global').emit('event:deleted', { eventId });
              console.log(`✅ Event deleted event emitted for ID: ${eventId}`);
              break;
          }
        } catch (error) {
          console.error('Error handling event change:', error);
        }
      });

      eventStream.on('error', (error) => {
        console.error('❌ Event change stream error:', error);
        setTimeout(() => this.startEventChangeStream(), 5000);
      });

      this.streams.set('event', eventStream);
      console.log('✅ Event change stream started');
    } catch (error) {
      console.error('❌ Failed to start event change stream:', error);
    }
  }

  stopAllStreams() {
    this.streams.forEach((stream, key) => {
      try {
        stream.close();
        console.log(`✅ Stopped ${key} change stream`);
      } catch (error) {
        console.error(`❌ Error stopping ${key} change stream:`, error);
      }
    });
    this.streams.clear();
    console.log('✅ All change streams stopped');
  }

  stopStream(streamName) {
    const stream = this.streams.get(streamName);
    if (stream) {
      stream.close();
      this.streams.delete(streamName);
      console.log(`✅ Stopped ${streamName} change stream`);
    }
  }
}

module.exports = new ChangeStreamService();
