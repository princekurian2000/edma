import React from 'react';
import event1 from '../assets/event1.jpg';
import event2 from '../assets/event2.jpg';
import event3 from '../assets/event3.jpg';
import './EventsBanner.css'; // Make sure to import CSS

const EventsBanner = () => (
  <div className="container my-5">
    <h2 className="text-center mb-4">Upcoming Events</h2>
    <div id="eventCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {[event1, event2, event3].map((img, i) => (
          <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={i}>
            <img src={img} className="d-block w-100 event-carousel-img rounded" alt={`Event ${i + 1}`} />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#eventCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#eventCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  </div>
);

export default EventsBanner;
