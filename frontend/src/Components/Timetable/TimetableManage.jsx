import React, { useState, useEffect } from 'react';
import './TimetableManage.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function TimetableManage() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [formData, setFormData] = useState({
    class: '',
    day: 'Monday',
    period: 1,
    subject: '',
    teacher: '',
    room: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/timetable', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTimetables(data);
    } catch (error) {
      console.error('Error fetching timetables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingEntry 
        ? `http://localhost:4000/api/timetable/${editingEntry._id}`
        : 'http://localhost:4000/api/timetable';
      
      const method = editingEntry ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingEntry(null);
        setFormData({
          class: '',
          day: 'Monday',
          period: 1,
          subject: '',
          teacher: '',
          room: '',
          startTime: '',
          endTime: ''
        });
      }
    } catch (error) {
      console.error('Error saving timetable:', error);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData(entry);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timetable entry?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:4000/api/timetable/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error deleting timetable:', error);
      }
    }
  };

  if (loading) {
    return <div className="timetable-loading">Loading timetables...</div>;
  }

  return (
    <div className="timetable-manage">
      <div className="timetable-header">
        <h2>Timetable Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
        >
          Add Timetable Entry
        </button>
      </div>

      {showForm && (
        <div className="timetable-form-overlay">
          <div className="timetable-form">
            <h3>{editingEntry ? 'Edit' : 'Add'} Timetable Entry</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Class</label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Day</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                    required
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Period</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Teacher</label>
                  <input
                    type="text"
                    value={formData.teacher}
                    onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Room</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingEntry ? 'Update' : 'Create'} Entry
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEntry(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="timetable-list">
        {timetables.map(entry => (
          <div key={entry._id} className="timetable-entry-card">
            <div className="entry-info">
              <h4>{entry.class} - {entry.day}</h4>
              <p><strong>Period {entry.period}:</strong> {entry.subject}</p>
              <p><strong>Teacher:</strong> {entry.teacher}</p>
              <p><strong>Room:</strong> {entry.room}</p>
              <p><strong>Time:</strong> {entry.startTime} - {entry.endTime}</p>
            </div>
            <div className="entry-actions">
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => handleEdit(entry)}
              >
                Edit
              </button>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(entry._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimetableManage;
