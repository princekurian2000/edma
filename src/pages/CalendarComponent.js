import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'; // Custom overrides
import { Card } from 'react-bootstrap';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const events = [
  {
    date: new Date(2025, 4, 14),
    title: 'Committee Meeting',
    location: 'Online',
    time: '04:00 PM'
  },
  {
    date: new Date(2025, 5, 14),
    title: 'BBQ Party',
    location: 'Will Update Soon',
    time: 'Will Update Soon'
  },
  {
    date: new Date(2025, 6, 12),
    title: 'BBQ Party',
    location: 'Will Update Soon',
    time: 'Will Update Soon'
  },
  {
    date: new Date(2025, 6, 26),
    title: 'Ladies Meet',
    location: 'Will Update Soon',
    time: 'Will Update Soon'
  },
  {
    date: new Date(2025, 7, 23),
    title: 'Sports Day',
    location: 'Will Update Soon',
    time: 'Will Update Soon'
  },
  {
    date: new Date(2025, 8, 20),
    title: 'Onam Celebration',
    location: 'Will Update Soon',
    time: 'Will Update Soon'
  },
  {
    date: new Date(2025, 9, 18),
    title: 'Indoor Games & Funday',
    location: 'Will Update Soon',
    time: 'Will Update Soon'
  },
  {
    date: new Date(2025, 11, 20),
    title: 'Xmas Carol',
    location: 'Will Update Soon',
    time: 'Will Update Soon'
  },
  {
    date: new Date(2026, 0, 3),
    title: 'XMas & New Year Celebration',
    location: 'Will Update Soon',
    time: 'Will Update Soon'
  },
  {
    date: new Date(2026, 3, 18),
    title: 'Easter, Vishu & Ramadan Celebration',
    location: 'Will Update Soon',
    time: 'Will Update Soon'
  }
];

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const onChange = (date) => {
    setSelectedDate(date);
    const event = events.find(e => e.date.toDateString() === date.toDateString());
    setSelectedEvent(event || null);
  };

  const tileContent = ({ date }) => {
    const event = events.find(e => e.date.toDateString() === date.toDateString());
    return event ? (
      <div className="event-indicator mt-1" title={event.title}>🎉</div>
    ) : null;
  };

  const tileClassName = ({ date, view }) => {
    const classes = [];

    // Highlight event days
    if (events.some(e => e.date.toDateString() === date.toDateString())) {
      classes.push('event-date');
    }

    // Dim out non-current month days
    if (view === 'month' && date.getMonth() !== new Date().getMonth()) {
      classes.push('non-current-month');
    }

    return classes;
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-primary">📅 EDMA 2025 Event Calendar</h2>

      <div className="d-flex flex-column align-items-center">
        <Calendar
          onChange={onChange}
          value={selectedDate}
          tileClassName={tileClassName}
          tileContent={tileContent}
        />

        {selectedDate && (
          <div className="mt-4 fade-in">
            {selectedEvent ? (
              <Card className="shadow-lg p-3 border-start border-5 border-success" style={{ maxWidth: '500px' }}>
                <Card.Body>
                  <Card.Title className="mb-3 h4 text-success">{selectedEvent.title}</Card.Title>
                  <Card.Text className="mb-2">
                    <FaMapMarkerAlt className="me-2 text-danger" />
                    <strong>Location:</strong> {selectedEvent.location}
                  </Card.Text>
                  <Card.Text>
                    <FaClock className="me-2 text-warning" />
                    <strong>Time:</strong> {selectedEvent.time}
                  </Card.Text>
                  <div className="text-muted small">
                    📌 Date: {selectedDate.toDateString()}
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <p className="text-muted">No events scheduled for {selectedDate.toDateString()}.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
