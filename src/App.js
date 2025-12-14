import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import WhatsAppButton from './components/WhatsAppButton'; // WhatsApp button import
import Contact from './pages/Contact';
import Events from './pages/Events';
import GalleryPage from './pages/GalleryPage';
import ExecutiveCommittee from './pages/ExecutiveCommittee';
import Members from './pages/Members';
import Calendar from './pages/CalendarComponent';
import MemberForm from './pages/MemberForm';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SpinningWheel from './pages/SpinningWheel';
import SpinningWheelB from './pages/SpinningWheelB';
import SpinningWheelC from './pages/SpinningWheelC';
import SpinningWheelD from './pages/SpinningWheelD';
import Onam2025Register from './pages/Onam2025';
import Onam2025RegistrationsList from './pages/Onam2025RegistrationsList';
import Onam2025AttendanceCounter from './pages/Onam2025AttendanceCounter';
import WelcomePage from './pages/WelcomePage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/committee" element={<ExecutiveCommittee />} />
        <Route path="/members" element={<Members />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/register" element={<MemberForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chitti-A" element={<SpinningWheel />} />
        <Route path="/chitti-B" element={<SpinningWheelB/>} />
        <Route path="/chitti-C" element={<SpinningWheelC />} />
        <Route path="/chitti-D" element={<SpinningWheelD />} />
        <Route path="/onam-2025-closed" element={<Onam2025Register />} />
        <Route path="/onamList" element={<Onam2025RegistrationsList/>} />
        <Route path="/registrationCounter" element={<Onam2025AttendanceCounter />} />
        <Route path="/welcome" element={<WelcomePage/>} />
        
      </Routes>
      <Footer />
      <WhatsAppButton /> {/* WhatsApp Button should be here */}
    </Router>
  );
}

export default App;
