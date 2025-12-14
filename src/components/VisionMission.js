import React from 'react';

const VisionMission = () => (
  <div className="container text-center my-5">
    <h2 className="mb-4">Our Vision & Mission</h2>
    <div className="row">
      <div className="col-md-6 mb-3">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h4 className="card-title text-primary">Vision</h4>
            <p className="card-text">To unite and uplift our community by preserving culture, promoting education, and encouraging social responsibility.</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-3">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h4 className="card-title text-success">Mission</h4>
            <p className="card-text">To organize meaningful programs, foster leadership, and create a platform for support and cultural exchange.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default VisionMission;
