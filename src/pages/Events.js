import React, { useEffect, useState } from 'react';

const Events = () => {
  // Event date: September 20, 2025 at 10:00 AM UK time
  const eventDate = new Date('2025-09-20T10:00:00');

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = eventDate - now;

      if (difference <= 0) {
        setTimeLeft(null); // Event started
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateCountdown(); // initial run
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container my-5">
     
    

      {/* 🔴 Live Stream Section: Onam 2025 */}
      <div className="mb-5 p-4 text-white bg-danger rounded shadow text-center">
        <h2 className="mb-3">🎥 Live Stream: Onam 2025</h2>

        {timeLeft ? (
          <div className="mb-3 fs-5">
            Starts in: <strong>{timeLeft.days}</strong> days{' '}
            <strong>{timeLeft.hours}</strong> hrs{' '}
            <strong>{timeLeft.minutes}</strong> mins{' '}
            <strong>{timeLeft.seconds}</strong> secs
          </div>
        ) : (
          <p className="fs-5 fw-bold">🎉 Live Now!</p>
        )}

        <div className="ratio ratio-16x9 mt-3">
           <iframe
    src="https://www.youtube.com/embed/0dF-XGz5Pko"
    title="Onam 2025 Live Stream"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
        </div>

         <div className="ratio ratio-16x9 mt-3">
           <iframe
    src="https://www.youtube.com/embed/ape0fYMn5q0"
    title="Onam 2025 Live Stream"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
        </div>

      </div>

      {/* 🎬 Past Events */}
      <h3 className="text-center mb-4">🎞️ Past Events</h3>
      <div className="row">
        {[
         { title: 'BBQ 2025', id: '9GGZMSf24Jg' },
          { title: 'BBQ 2025', id: 'K18Fhn5XmyA' },
          { title: 'Easter 2025', id: 'GWFMo8VaMp0' },
          { title: 'Easter 2025', id: 'g35rAKBCR0I' },
          { title: 'Easter 2025', id: 'NU7B-7Qe3ds' },
          { title: 'Christmas 2024', id: 'BsVesQ5KCCM' },
          { title: 'Onam 2024', id: 'NFH5ftITaqk' }
    
        ].map((event, i) => (
          <div className="col-md-6 mb-4" key={i}>
            <h5>{event.title}</h5>
            <div className="ratio ratio-16x9">
              <iframe
                src={`https://www.youtube.com/embed/${event.id}`}
                title={event.title}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
