import React from 'react';
import './ExecutiveCommittee.css';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

import president from '../assets/members/president.jpg';
import vicePresident from '../assets/members/vicePresident.jpg';
import secretary from '../assets/members/secretary.jpg';
import jointSecretary from '../assets/members/jointSecretary.jpg';
import treasurer from '../assets/members/treasurer.jpg';
import jointTreasurer from '../assets/members/jointTreasurer.jpg';
import coordinator1 from '../assets/members/coordinator1.jpg';
import coordinator2 from '../assets/members/coordinator2.jpg';
import coordinator3 from '../assets/members/coordinator3.jpg';
import coordinator4 from '../assets/members/coordinator4.jpg';
import coordinator5 from '../assets/members/coordinator5.jpg';

const members = [
  { role: 'President', name: 'Prince Kurian', image: president, phone: '+447833857420' },
  { role: 'Vice President', name: 'Anila Sunilkumar', image: vicePresident, phone: '+447823979534' },
  { role: 'Secretary', name: 'Anila Sobin', image: secretary, phone: '+447586578785' },
  { role: 'Joint Secretary', name: 'Binu Joy', image: jointSecretary, phone: '+447823437672' },
  { role: 'Treasurer', name: 'Logi Thomas', image: treasurer, phone: '+447407253830' },
  { role: 'Joint Treasurer', name: 'Joffin', image: jointTreasurer, phone: '+447482703642' },
  { role: 'Program Coordinator', name: 'Shine Varghese', image: coordinator1 ,phone: '+447442547792'},
  { role: 'Program Coordinator', name: 'Nimmi Sebi', image: coordinator2,phone: '+447780390029' },
  { role: 'Program Coordinator', name: 'Riya Shibu', image: coordinator3,phone: '+447570394954' },
  { role: 'Program Coordinator', name: 'Anterson', image: coordinator4,phone: '+447799324517' },
  { role: 'Program Coordinator', name: 'Jisha Paulose', image: coordinator5,phone: '+447818973082' },
];

const ExecutiveCommittee = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">👥 Executive Committee Members</h2>
      <div className="row g-4">
        {members.map((member, index) => (
          <div className="col-6 col-md-4 col-lg-3 text-center" key={index}>
            <div className="card border-0 shadow-sm h-100">
              <img
                src={member.image}
                alt={member.name}
                className="card-img-top rounded-circle member-img mx-auto mt-3"
              />
              <div className="card-body">
                <h5 className="card-title mb-1">{member.name}</h5>
                <p className="text-muted small">{member.role}</p>
                {member.phone && (
                  <div className="d-flex justify-content-center gap-3 mt-2">
                    <a href={`tel:${member.phone}`} className="text-decoration-none text-primary" title="Call">
                      <FaPhoneAlt />
                    </a>
                    <a
                      href={`https://wa.me/${member.phone.replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none text-success"
                      title="WhatsApp"
                    >
                      <FaWhatsapp />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutiveCommittee;
