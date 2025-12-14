import React, { useEffect, useState } from "react";

export default function Onam2025RegistrationsList() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [search, setSearch] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch(
          "https://edmamalayalee.co.uk/api/get_onam2025_registrations.php"
        );
        const data = await response.json();

        if (data.success) {
          setRegistrations(data.registrations);
        } else {
          setError(data.message || "Failed to fetch registrations.");
        }
      } catch (err) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const calculateTotalMembers = (reg) => {
    return (
      (parseInt(reg.total_adults) || 0) +
      (parseInt(reg.total_kids) || 0) +
      (parseInt(reg.total_additional_adults) || 0) +
      (parseInt(reg.total_additional_kids) || 0) +
      (parseInt(reg.total_guest_adults) || 0) +
      (parseInt(reg.total_guest_kids) || 0)
    );
  };

  const totalAdults = registrations.reduce(
    (sum, reg) =>
      sum +
      (parseInt(reg.total_adults) || 0) +
      (parseInt(reg.total_additional_adults) || 0) +
      (parseInt(reg.total_guest_adults) || 0),
    0
  );

  const totalKids = registrations.reduce(
    (sum, reg) =>
      sum +
      (parseInt(reg.total_kids) || 0) +
      (parseInt(reg.total_additional_kids) || 0) +
      (parseInt(reg.total_guest_kids) || 0),
    0
  );

  const filteredRegistrations = registrations
    .filter((reg) => {
      const matchesSearch =
        reg.name.toLowerCase().includes(search.toLowerCase()) ||
        reg.membership_type.toLowerCase().includes(search.toLowerCase());

      const matchesMembership =
        membershipFilter === "All" ||
        reg.membership_type === membershipFilter;

      return matchesSearch && matchesMembership;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      let aValue, bValue;

      if (sortConfig.key === "members") {
        aValue = calculateTotalMembers(a);
        bValue = calculateTotalMembers(b);
      } else if (sortConfig.key === "amount") {
        aValue = parseFloat(a.total_amount);
        bValue = parseFloat(b.total_amount);
      } else {
        aValue = a[sortConfig.key].toLowerCase();
        bValue = b[sortConfig.key].toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <div className="text-center my-5">Loading registrations...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-danger my-5 fw-bold">{error}</div>
    );
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <i className="bi bi-caret-up-fill ms-1"></i>
    ) : (
      <i className="bi bi-caret-down-fill ms-1"></i>
    );
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Onam 2025 Registrations</h2>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-primary mb-3 shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Total Adults</h5>
              <h3 className="fw-bold">{totalAdults}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-success mb-3 shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Total Kids</h5>
              <h3 className="fw-bold">{totalKids}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or membership"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={membershipFilter}
            onChange={(e) => setMembershipFilter(e.target.value)}
          >
            <option value="All">All Memberships</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive shadow-sm">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-warning text-center">
            <tr>
              <th>#</th>
              <th style={{ cursor: "pointer" }} onClick={() => requestSort("name")}>
                Name {getSortIcon("name")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => requestSort("membership_type")}
              >
                Membership {getSortIcon("membership_type")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => requestSort("members")}
              >
                Members {getSortIcon("members")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => requestSort("amount")}
              >
                Amount (£) {getSortIcon("amount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((reg, index) => {
                const totalMembers = calculateTotalMembers(reg);
                const isExpanded = expandedRow === reg.id;

                return (
                  <React.Fragment key={reg.id}>
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      <td>{reg.name}</td>
                      <td className="text-center">{reg.membership_type}</td>
                      <td
                        className="text-center fw-bold text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setExpandedRow(isExpanded ? null : reg.id)
                        }
                      >
                        {totalMembers}{" "}
                        <i
                          className={`bi ${
                            isExpanded ? "bi-chevron-up" : "bi-chevron-down"
                          }`}
                        ></i>
                      </td>
                      <td className="text-center fw-bold text-success">
                        £{reg.total_amount}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-light">
                        <td colSpan="5">
                          <div className="p-2">
                            <p className="mb-1">
                              <strong>Family:</strong> {reg.total_adults} adults,{" "}
                              {reg.total_kids} kids
                            </p>
                            <p className="mb-1">
                              <strong>Additional:</strong>{" "}
                              {reg.total_additional_adults} adults,{" "}
                              {reg.total_additional_kids} kids
                            </p>
                            <p className="mb-0">
                              <strong>Guests:</strong>{" "}
                              {reg.total_guest_adults} adults,{" "}
                              {reg.total_guest_kids} kids
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-3">
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 