import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './MemberForm.css';

const MemberForm = () => {
  const navigate = useNavigate();

  const [familyDetails, setFamilyDetails] = useState({
    houseNo: '',
    addressLine: '',
    postalCode: '',
    location: '',
    membershipType: '',
    otherLocation: '',
    otherMembership: '',
  });

  const [members, setMembers] = useState([
    { name: '', email: '', phone: '', dob: null, photo: null }
  ]);

  const [submitting, setSubmitting] = useState(false);

  const handleFamilyChange = (e) => {
    const { name, value } = e.target;
    setFamilyDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedMembers = [...members];
    updatedMembers[index][name] = name === 'photo' ? files[0] : value;
    setMembers(updatedMembers);
  };

  const addMember = () => {
    setMembers([...members, { name: '', email: '', phone: '', dob: null, photo: null }]);
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    console.log('Submitting form...');
    console.log('Members count:', members.length);

    if (members.length === 1) {
      

      
        const isSingle = window.confirm('Single or Adding Family memebrs,click Ok to continue as single.');
        console.log('User confirmed single:', isSingle);
        if (!isSingle) {
          alert('Please add family member details.');
          return; // stop submission
        }
      
    }

    // Validate Gmail requirement if members > 0
    const hasGmail = members.some(
      (m) => m.email && m.email.trim().toLowerCase().endsWith('@gmail.com')
    );

    console.log('Has at least one Gmail?', hasGmail);

    if (members.length > 0 && !hasGmail) {
      alert('At least one family member must have a Gmail address.');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();

    Object.entries(familyDetails).forEach(([key, value]) => {
      formData.append(key, value);
    });

    members.forEach((member, index) => {
      Object.entries(member).forEach(([key, value]) => {
        if (key === 'photo' && value) {
          formData.append(`members[${index}][photo]`, value);
        } else if (key === 'dob' && value instanceof Date) {
          const formattedDate = value.toISOString().split('T')[0];
          formData.append(`members[${index}][dob]`, formattedDate);
        } else {
          formData.append(`members[${index}][${key}]`, value);
        }
      });
    });

    try {
      const response = await fetch('https://edmamalayalee.co.uk/api/save_family.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert('Family and members saved successfully!');
        setTimeout(() => {
          navigate('/members');
        }, 100);
      } else {
        alert('Error saving data. ' + (result.message || 'Please try again.'));
        setSubmitting(false);
      }
    } catch (error) {
      alert('Failed to submit. Check server connection.');
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="member-form">
      <h2 className="form-title">Family Details</h2>
      <div className="form-group">
        <label>House No</label>
        <input type="text" name="houseNo" value={familyDetails.houseNo} onChange={handleFamilyChange} required />
      </div>
      <div className="form-group">
        <label>Address Line</label>
        <input type="text" name="addressLine" value={familyDetails.addressLine} onChange={handleFamilyChange} required />
      </div>
      <div className="form-group">
        <label>Postal Code</label>
        <input type="text" name="postalCode" value={familyDetails.postalCode} onChange={handleFamilyChange} required />
      </div>
      <div className="form-group">
        <label>Location</label>
        <select name="location" value={familyDetails.location} onChange={handleFamilyChange} required>
          <option value="">Select Location</option>
          <option value="Seaton">Seaton</option>
          <option value="Honiton">Honiton</option>
          <option value="Axminster">Axminster</option>
          <option value="Sidmouth">Sidmouth</option>
          <option value="Other">Other</option>
        </select>
        {familyDetails.location === 'Other' && (
          <input type="text" name="otherLocation" placeholder="Specify other location" value={familyDetails.otherLocation} onChange={handleFamilyChange} />
        )}
      </div>
      <div className="form-group">
        <label>Type of Membership</label>
        <select name="membershipType" value={familyDetails.membershipType} onChange={handleFamilyChange} required>
          <option value="">Select Membership</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
          <option value="Other">Other</option>
        </select>
        {familyDetails.membershipType === 'Other' && (
          <input type="text" name="otherMembership" placeholder="Specify other type" value={familyDetails.otherMembership} onChange={handleFamilyChange} />
        )}
      </div>

      <h3 className="form-subtitle">Add Family Members</h3>
      {members.map((member, index) => (
        <div key={index} className="member-box">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={member.name} onChange={(e) => handleMemberChange(index, e)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={member.email} onChange={(e) => handleMemberChange(index, e)} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={member.phone} onChange={(e) => handleMemberChange(index, e)} />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <DatePicker
              selected={member.dob}
              onChange={(date) => {
                const updatedMembers = [...members];
                updatedMembers[index].dob = date;
                setMembers(updatedMembers);
              }}
              dateFormat="yyyy-MM-dd"
              placeholderText="Enter Date of Birth (YYYY-MM-DD)"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              maxDate={new Date()}
              className="datepicker-input"
              allowInput
              required
            />
          </div>
          <div className="form-group">
            <label>Photo</label>
            <input type="file" name="photo" accept="image/*" onChange={(e) => handleMemberChange(index, e)} />
          </div>
          {members.length > 1 && (
            <button type="button" onClick={() => removeMember(index)} className="btn btn-danger remove-btn">Delete Member</button>
          )}
        </div>
      ))}

      <button type="button" onClick={addMember} className="btn btn-secondary add-btn">+ Add Member</button>
      <button type="submit" className="btn btn-primary submit-btn" disabled={submitting}>
        {submitting ? 'Saving...' : 'Submit'}
      </button>
    </form>
  );
};

export default MemberForm;
