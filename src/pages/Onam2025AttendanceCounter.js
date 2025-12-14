import React, { useEffect, useState } from "react";

export default function Onam2025AttendanceCounter() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [accessGranted, setAccessGranted] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const correctPassword = "Edma"; // 🔒 Password

  // 🔹 Password submit handler
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === correctPassword) {
      setAccessGranted(true);
    } else {
      alert("Incorrect password!");
      setPasswordInput("");
    }
  };

  // 🔹 Fetch registrations only if access is granted
  useEffect(() => {
    if (!accessGranted) return;

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
  }, [accessGranted]);

  // 🔹 Mark attendance
  const markAttendance = async (id) => {
    try {
      const response = await fetch(
        "https://edmamalayalee.co.uk/api/mark_attendance.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setRegistrations((prev) =>
          prev.map((reg) => (reg.id === id ? { ...reg, attended: 1 } : reg))
        );
      } else {
        alert(data.message || "Failed to mark attendance");
      }
    } catch (err) {
      alert("Error updating attendance");
    }
  };

  // 🔹 Unmark attendance
  const unmarkAttendance = async (id) => {
    try {
      const response = await fetch(
        "https://edmamalayalee.co.uk/api/unmark_attendance.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setRegistrations((prev) =>
          prev.map((reg) => (reg.id === id ? { ...reg, attended: 0 } : reg))
        );
      } else {
        alert(data.message || "Failed to unmark attendance");
      }
    } catch (err) {
      alert("Error updating attendance");
    }
  };

  // 🔹 Sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <i className="bi bi-caret-up-fill ms-1"></i>
    ) : (
      <i className="bi bi-caret-down-fill ms-1"></i>
    );
  };

  // 🔹 Apply search & sort
  const filteredRegistrations = registrations
    .filter((reg) =>
      reg.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      let aValue, bValue;

      if (sortConfig.key === "members") {
        aValue =
          (parseInt(a.total_adults) || 0) +
          (parseInt(a.total_kids) || 0) +
          (parseInt(a.total_additional_adults) || 0) +
          (parseInt(a.total_additional_kids) || 0) +
          (parseInt(a.total_guest_adults) || 0) +
          (parseInt(a.total_guest_kids) || 0);
        bValue =
          (parseInt(b.total_adults) || 0) +
          (parseInt(b.total_kids) || 0) +
          (parseInt(b.total_additional_adults) || 0) +
          (parseInt(b.total_additional_kids) || 0) +
          (parseInt(b.total_guest_adults) || 0) +
          (parseInt(b.total_guest_kids) || 0);
      } else if (sortConfig.key === "amount") {
        aValue = parseFloat(a.total_amount);
        bValue = parseFloat(b.total_amount);
      } else {
        aValue = a[sortConfig.key]?.toString().toLowerCase();
        bValue = b[sortConfig.key]?.toString().toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  // 🔹 Totals - Registered
  const totalRegisteredAdults = filteredRegistrations.reduce(
    (sum, reg) =>
      sum +
      (parseInt(reg.total_adults) || 0) +
      (parseInt(reg.total_additional_adults) || 0) +
      (parseInt(reg.total_guest_adults) || 0),
    0
  );

  const totalRegisteredKids = filteredRegistrations.reduce(
    (sum, reg) =>
      sum +
      (parseInt(reg.total_kids) || 0) +
      (parseInt(reg.total_additional_kids) || 0) +
      (parseInt(reg.total_guest_kids) || 0),
    0
  );

  // 🔹 Totals - Attended only
  const totalAttendedAdults = filteredRegistrations.reduce(
    (sum, reg) =>
      Number(reg.attended) === 1
        ? sum +
          (parseInt(reg.total_adults) || 0) +
          (parseInt(reg.total_additional_adults) || 0) +
          (parseInt(reg.total_guest_adults) || 0)
        : sum,
    0
  );

  const totalAttendedKids = filteredRegistrations.reduce(
    (sum, reg) =>
      Number(reg.attended) === 1
        ? sum +
          (parseInt(reg.total_kids) || 0) +
          (parseInt(reg.total_additional_kids) || 0) +
          (parseInt(reg.total_guest_kids) || 0)
        : sum,
    0
  );

  // 🔹 Loading/Error
  if (!accessGranted) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <form
          className="p-4 bg-white shadow rounded"
          onSubmit={handlePasswordSubmit}
        >
          <h3 className="mb-3 text-center">Enter Password to Access</h3>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button className="btn btn-primary w-100" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  // 🔹 Render page
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Onam 2025 Attendance Counter</h2>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Totals */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="alert alert-info text-center fw-bold">
            Registered → Adults: {totalRegisteredAdults} | Kids:{" "}
            {totalRegisteredKids}
          </div>
        </div>
        <div className="col-md-6">
          <div className="alert alert-success text-center fw-bold">
            Attended → Adults: {totalAttendedAdults} | Kids: {totalAttendedKids}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive shadow-sm">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-primary text-center">
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
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((reg, index) => {
                const totalMembers =
                  (parseInt(reg.total_adults) || 0) +
                  (parseInt(reg.total_kids) || 0) +
                  (parseInt(reg.total_additional_adults) || 0) +
                  (parseInt(reg.total_additional_kids) || 0) +
                  (parseInt(reg.total_guest_adults) || 0) +
                  (parseInt(reg.total_guest_kids) || 0);

                return (
                  <tr
                    key={reg.id}
                    className={Number(reg.attended) === 1 ? "table-success" : ""}
                  >
                    <td className="text-center">{index + 1}</td>
                    <td>{reg.name}</td>
                    <td className="text-center">{reg.membership_type}</td>
                    <td className="text-center fw-bold">{totalMembers}</td>
                    <td className="text-center">£{reg.total_amount}</td>
                    <td className="text-center">
                      {Number(reg.attended) === 1 ? (
                        <>
                          <span className="badge bg-success me-2">Attended</span>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => unmarkAttendance(reg.id)}
                          >
                            Unmark
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => markAttendance(reg.id)}
                        >
                          Mark Attended
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted py-3">
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
