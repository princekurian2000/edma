import React from 'react';

const AboutEDMA = () => (
  <div className="container my-5">
    <h2 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: '700' }}>
      About <span style={{ color: '#d35400' }}>EDMA</span>
    </h2>
    <div className="row justify-content-center">
      <div className="col-md-10">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <p className="card-text lead" style={{ color: '#34495e' }}>
              <strong style={{ color: '#d35400' }}>
                EDMA (East Devon Malayalee Association)
              </strong>{' '}
              is a vibrant and active community of{' '}
              <span style={{ fontWeight: '700', fontSize: '1.5rem', color: '#2980b9' }}>
                300
              </span>{' '}
              members from Honiton, Axminster, Seaton, and Sidmouth, united by the rich cultural heritage of Kerala, India.
            </p>
            <p className="card-text lead mt-3" style={{ color: '#34495e' }}>
              We aim to preserve and share our traditions while contributing meaningfully to the social and cultural fabric of East Devon.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutEDMA;
