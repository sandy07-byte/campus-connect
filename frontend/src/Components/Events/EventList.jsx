import React from 'react';
import useRealtimeEvents from '../../hooks/useRealtimeEvents';
import './EventList.css';

function EventList({ userRole }) {
  const token = localStorage.getItem('token');
  const { events, loading, error, isConnected } = useRealtimeEvents(token);

  if (loading) {
    return <div className="event-loading">Loading events...</div>;
  }

  if (error) {
    return <div className="event-error">Error loading events: {error}</div>;
  }

  return (
    <div className="event-list">
      <div className="event-list-header">
        <h2>Upcoming Events</h2>
        <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Live' : '🔴 Offline'}
        </span>
      </div>
      {events.length === 0 ? (
        <div className="no-events">No upcoming events scheduled.</div>
      ) : (
        <div className="event-grid">
          {events.map(event => (
            <div key={event._id} className="event-card">
              <div className="event-header">
                <h3>{event.title}</h3>
                <span className={`event-type ${event.type}`}>{event.type}</span>
              </div>
              <div className="event-info">
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Created by:</strong> {event.createdBy.name}</p>
              </div>
              <div className="event-description">
                <p>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventList;
