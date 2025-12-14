import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Dashboard = () => {
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isEditingFamily, setIsEditingFamily] = useState(false);
  const [familyForm, setFamilyForm] = useState({});
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const familyId = query.get('familyId');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('You must be logged in to view this page.');
      navigate('/login');
      return;
    }

    if (!familyId) return;

    const fetchFamilyData = async () => {
      try {
        const response = await fetch(`https://edmamalayalee.co.uk/api/get_family_from_id.php?familyId=${familyId}`);
        const data = await response.json();
        if (data.success) {
          setFamily(data.family);
          setMembers(
            data.members.map((m) => ({
              ...m,
              dob: m.dob ? new Date(m.dob) : null,
            }))
          );
          setFamilyForm(data.family);
        } else {
          alert('Failed to load family data.');
        }
      } catch (error) {
        alert('Error fetching family data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, [familyId, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFamilyInputChange = (e) => {
    const { name, value } = e.target;
    setFamilyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFamilySave = async () => {
    const formData = new FormData();
    formData.append('familyId', familyId);
    for (const key in familyForm) {
      formData.append(key, familyForm[key]);
    }

    try {
      const response = await fetch(`https://edmamalayalee.co.uk/api/update_family.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('Family updated successfully.');
        setFamily(familyForm);
        setIsEditingFamily(false);
      } else {
        alert('Family update failed.');
      }
    } catch (error) {
      alert('Error updating family.');
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditForm({ ...members[index] });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setEditForm((prev) => ({ ...prev, newPhoto: e.target.files[0] }));
  };

  const handleDateChange = (date) => {
    setEditForm((prev) => ({ ...prev, dob: date }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (editForm.id) formData.append('id', editForm.id);

    for (const key in editForm) {
      if (key === 'dob' && editForm[key] instanceof Date) {
        formData.append(key, editForm[key].toISOString().split('T')[0]);
      } else if (!['photo_path', 'newPhoto', 'id'].includes(key)) {
        formData.append(key, editForm[key]);
      }
    }

    if (editForm.newPhoto) {
      formData.append('newPhoto', editForm.newPhoto);
    }

    try {
      const response = await fetch(`https://edmamalayalee.co.uk/api/update_member.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('Member updated successfully.');
        setMembers(members.map((m, i) =>
          i === editingIndex ? { ...editForm, photo_path: data.photo_path || m.photo_path } : m
        ));
        handleCancelEdit();
      } else {
        alert('Update failed.');
      }
    } catch (error) {
      alert('Error updating member.');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4 mb-5 px-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-success">Dashboard</h3>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
      </div>

      {/* Family Info */}
      <div className="mb-4 p-3 border rounded shadow-sm bg-light position-relative">
        <h4 className="text-primary mb-3">
          Family Information
          {!isEditingFamily && (
            <span
              className="ms-2 text-primary float-end"
              role="button"
              onClick={() => setIsEditingFamily(true)}
              title="Edit Family"
            >
              <i className="bi bi-pencil-square fs-5"></i>
            </span>
          )}
        </h4>

        {isEditingFamily ? (
          <>
            <input type="text" name="house_no" className="form-control mb-2" value={familyForm.house_no || ''} onChange={handleFamilyInputChange} placeholder="House No" />
            <input type="text" name="address_line" className="form-control mb-2" value={familyForm.address_line || ''} onChange={handleFamilyInputChange} placeholder="Address Line" />
            <input type="text" name="location" className="form-control mb-2" value={familyForm.location || ''} onChange={handleFamilyInputChange} placeholder="Location" />
            <input type="text" name="postal_code" className="form-control mb-2" value={familyForm.postal_code || ''} onChange={handleFamilyInputChange} placeholder="Postal Code" />
            <select name="membership_type" value={familyForm.membership_type || ''} onChange={handleFamilyInputChange} className="form-select mb-3">
              <option value="">Select Membership</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Other">Other</option>
            </select>
            <div className="d-flex gap-2">
              <button className="btn btn-success btn-sm w-100" onClick={handleFamilySave}>Save</button>
              <button className="btn btn-secondary btn-sm w-100" onClick={() => setIsEditingFamily(false)}>Cancel</button>
            </div>
          </>
        ) : (
          family && (
            <div>
              <p><strong>House No:</strong> {family.house_no}</p>
              <p><strong>Address:</strong> {family.address_line}, {family.location}, {family.postal_code}</p>
              <p><strong>Membership Type:</strong> {family.membership_type}</p>
            </div>
          )
        )}
      </div>

      {/* Members */}
      <h5 className="text-success mb-4">Family Members</h5>
      <div className="row">
        {members.map((member, i) => (
          <div key={i} className="col-12 col-md-6 col-lg-4 mb-4 position-relative">
            <div className="card h-100 shadow-sm text-center p-3">
              {editingIndex === i ? (
                <>
                  {member.photo_path && !editForm.newPhoto && (
                    <img src={`https://edmamalayalee.co.uk/api/${member.photo_path}`} alt={member.name} className="rounded-circle mb-3 mx-auto d-block" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  )}
                  {editForm.newPhoto && (
                    <img src={URL.createObjectURL(editForm.newPhoto)} alt="New" className="rounded-circle mb-3 mx-auto d-block" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  )}
                  <input type="file" className="form-control mb-2" onChange={handlePhotoChange} />
                  <input type="text" name="name" className="form-control mb-2" value={editForm.name || ''} onChange={handleInputChange} placeholder="Name" />
                  <input type="email" name="email" className="form-control mb-2" value={editForm.email || ''} onChange={handleInputChange} placeholder="Email" />
                  <input type="text" name="phone" className="form-control mb-2" value={editForm.phone || ''} onChange={handleInputChange} placeholder="Phone" />
                  <div className="form-group mb-3">
                    <label>Date of Birth</label>
                    <DatePicker
                      selected={editForm.dob}
                      onChange={handleDateChange}
                      dateFormat="yyyy-MM-dd"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      maxDate={new Date()}
                      className="form-control"
                    />
                  </div>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-between">
                    <button className="btn btn-success btn-sm w-100 me-md-2 mb-2" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary btn-sm w-100" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <span className="position-absolute top-0 end-0 m-2 text-primary" role="button" onClick={() => handleEditClick(i)} title="Edit">
                    <i className="bi bi-pencil-square fs-5"></i>
                  </span>
                  {member.photo_path && (
                    <img src={`https://edmamalayalee.co.uk/api/${member.photo_path}`} alt={member.name} className="rounded-circle mb-3 mx-auto d-block" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  )}
                  <h6 className="card-title">{member.name}</h6>
                  <p className="card-text mb-2">
                    <strong>Email:</strong> {member.email}<br />
                    <strong>Phone:</strong> {member.phone}<br />
                    <strong>DOB:</strong> {member.dob ? member.dob.toISOString().split('T')[0] : ''}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
