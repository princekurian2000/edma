import React, { useState } from 'react';
import { FaPhoneAlt, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');

    emailjs
      .send(
        'service_vt04h2f', // 🔁 Replace with your actual service ID
        'template_s3bci89', // 🔁 Replace with your template ID
        formData,
        'x8yLke-spZRWZfo3L' // 🔁 Replace with your EmailJS public key
      )
      .then(
        () => {
          setStatus('Message sent successfully!');
          setFormData({ name: '', email: '', message: '' });
        },
        (error) => {
          setStatus('Failed to send message. Try again later.');
          console.error('EmailJS Error:', error);
        }
      );
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Contact Us</h2>

      <div className="row mb-5">
        {/* Contact Info */}
        <div className="col-md-4">
          <h4 className="mb-4 text-primary">Contact Information</h4>
          <ul className="list-unstyled">
            <li className="d-flex align-items-center mb-4">
              <FaPhoneAlt className="me-3 text-primary" size={25} />
              <div>
                <strong>Phone:</strong>
                <br />
                <a href="tel:+447763607372" className="text-decoration-none text-dark">
                  +44 7763 607372
                </a>
              </div>
            </li>
            <li className="d-flex align-items-center mb-4">
              <FaWhatsapp className="me-3 text-success" size={25} />
              <div>
                <strong>WhatsApp:</strong>
                <br />
                <a href="https://wa.me/447763607372" className="text-decoration-none text-dark">
                  +44 7763 607372
                </a>
              </div>
            </li>
            <li className="d-flex align-items-center mb-4">
              <FaEnvelope className="me-3 text-danger" size={25} />
              <div>
                <strong>Email:</strong>
                <br />
                <a href="mailto:edmamalayaliassociation@gmail.com" className="text-decoration-none text-dark">
                  edmamalayalee@gmail.com
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="col-md-8 mt-4 mt-md-0">
          <h4 className="mb-4 text-primary">Send Us a Message</h4>
          <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Send Message</button>
            {status && <p className="mt-3 text-center text-muted">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
