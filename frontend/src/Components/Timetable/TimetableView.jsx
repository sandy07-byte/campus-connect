import React from 'react';
import useRealtimeTimetable from '../../hooks/useRealtimeTimetable';
import './TimetableView.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function TimetableView({ userClass, userRole }) {
  const token = localStorage.getItem('token');
  const { timetable, loading, error, isConnected } = useRealtimeTimetable(userClass, token);

  const getTimetableForDay = (day) => {
    return timetable.filter(entry => entry.day === day).sort((a, b) => a.period - b.period);
  };

  if (loading) {
    return <div className="timetable-loading">Loading timetable...</div>;
  }

  if (error) {
    return <div className="timetable-error">Error loading timetable: {error}</div>;
  }

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h2>Class {userClass} Timetable</h2>
        <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Live' : '🔴 Offline'}
        </span>
      </div>
      <div className="timetable-grid">
        {days.map(day => (
          <div key={day} className="timetable-day">
            <h3 className="day-header">{day}</h3>
            <div className="day-schedule">
              {getTimetableForDay(day).map((entry, index) => (
                <div key={index} className="timetable-entry">
                  <div className="period-info">
                    <span className="period">Period {entry.period}</span>
                    <span className="time">{entry.startTime} - {entry.endTime}</span>
                  </div>
                  <div className="subject-info">
                    <span className="subject">{entry.subject}</span>
                    <span className="teacher">{entry.teacher}</span>
                    <span className="room">{entry.room}</span>
                  </div>
                </div>
              ))}
              {getTimetableForDay(day).length === 0 && (
                <div className="no-classes">No classes scheduled</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimetableView;


