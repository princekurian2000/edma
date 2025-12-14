import React, { useEffect, useState } from 'react';
import './Members.css';
import placeholderImg from '../assets/placeholder.jpg';

const Members = () => {
  const [families, setFamilies] = useState([]);
  const [filteredFamilies, setFilteredFamilies] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    otherLocation: '',
    name: '',
    age: '',
    membershipType: '',
    otherMembership: ''
  });
  const [expandedFamily, setExpandedFamily] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('https://edmamalayalee.co.uk/api/get_families.php')
      .then(res => res.json())
      .then(data => {
        setFamilies(data.families);
        setFilteredFamilies(data.families);
      })
      .catch(err => console.error(err));
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    const locationFilter = updated.location === 'Other'
      ? updated.otherLocation.toLowerCase()
      : updated.location.toLowerCase();

    const membershipFilter = updated.membershipType === 'Other'
      ? updated.otherMembership.toLowerCase()
      : updated.membershipType.toLowerCase();

    const filtered = families.filter(family => {
      const locationMatch = family.location.toLowerCase().includes(locationFilter);
      const membershipMatch = family.membership_type.toLowerCase().includes(membershipFilter);
      const memberMatch = family.members.some(member => {
        const nameMatch = member.name.toLowerCase().includes(updated.name.toLowerCase());
        const ageMatch = updated.age === '' || calculateAge(member.dob) === parseInt(updated.age);
        return nameMatch && ageMatch;
      });
      return locationMatch && membershipMatch && memberMatch;
    });

    setFilteredFamilies(filtered);
    setCurrentPage(1);
  };

  const handleFamilyClick = (familyId) => {
    setExpandedFamily(prev => (prev === familyId ? null : familyId));
  };

  const totalPages = Math.ceil(filteredFamilies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFamilies = filteredFamilies.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Age Group Count (Updated as per your latest instruction)
  const getAgeGroupCounts = () => {
    let babies = 0, kids = 0, teens = 0, adults = 0;

    filteredFamilies.forEach(family => {
      family.members.forEach(member => {
        const age = calculateAge(member.dob);
        if (age === null) return;
        if (age <= 5) babies++;
        else if (age <= 12) kids++;
        else if (age <= 18) teens++;
        else adults++;
      });
    });

    return { babies, kids, teens, adults };
  };

  const totalMembers = filteredFamilies.reduce((sum, family) => sum + family.members.length, 0);
  const { babies, kids, teens, adults } = getAgeGroupCounts();

  return (
    <div className="families-container">
      <h2>Family Members</h2>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <select name="location" value={filters.location} onChange={handleFilterChange}>
          <option value="">Select Location</option>
          <option value="Seaton">Seaton</option>
          <option value="Honiton">Honiton</option>
          <option value="Axminster">Axminster</option>
          <option value="Sidmouth">Sidmouth</option>
          <option value="Other">Other</option>
        </select>
        {filters.location === 'Other' && (
          <input
            type="text"
            name="otherLocation"
            placeholder="Specify other location"
            value={filters.otherLocation}
            onChange={handleFilterChange}
          />
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={filters.name}
          onChange={handleFilterChange}
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={filters.age}
          onChange={handleFilterChange}
        />

        <select name="membershipType" value={filters.membershipType} onChange={handleFilterChange}>
          <option value="">Select Membership</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
          <option value="Other">Other</option>
        </select>
        {filters.membershipType === 'Other' && (
          <input
            type="text"
            name="otherMembership"
            placeholder="Specify other type"
            value={filters.otherMembership}
            onChange={handleFilterChange}
          />
        )}
      </div>

      {/* Total Counts */}
      <p style={{ marginBottom: '1rem' }}>
        <strong>{filteredFamilies.length}</strong> families, <strong>{totalMembers}</strong> members:&nbsp;
        👶 Babies: <strong>{babies}</strong>, 🧒 Kids: <strong>{kids}</strong>, 🧑‍🎓 Teenagers: <strong>{teens}</strong>, 👨‍🦳 Adults: <strong>{adults}</strong>
      </p>

      {/* Family Cards */}
      {currentFamilies.length > 0 ? (
        currentFamilies.map((family, index) => (
          <div key={index} className="family-card" onClick={() => handleFamilyClick(family.id)}>
            <div className="family-header">
              <p><strong>Head:</strong> {family.members[0]?.name || 'N/A'}</p>
              <p><strong>Location:</strong> {family.location}</p>
              <p><strong>Membership:</strong> {family.membership_type}</p>
            </div>
            <div className={`family-body ${expandedFamily === family.id ? 'expanded' : ''}`}>
              <div className="members-grid">
                {family.members.map((member, i) => (
                  <div key={i} className="member-card">
                    <img
                      src={member.photo_path ? `https://edmamalayalee.co.uk/api/${member.photo_path}` : placeholderImg}
                      alt={member.name}
                      className="member-photo"
                    />
                    <div className="member-info">
                      <p><strong>{member.name}</strong></p>
                      {/* <p>Age: {calculateAge(member.dob)}</p> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No families found.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              style={{ fontWeight: currentPage === i + 1 ? 'bold' : 'normal' }}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Members;
