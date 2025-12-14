import React, { useState, useEffect } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";
import emailjs from "@emailjs/browser"; // ✅ EmailJS import

export default function Onam2025Register() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [membershipType, setMembershipType] = useState("");
  const [familyId, setFamilyId] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    adults: "",
    kids: "",
    guestAdults: "",
    guestKids: "",
    additionalFamilyAdults: 0,
    AdditionalFamilyKids: 0,
  });

  const [totalCost, setTotalCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      setUser(loggedUser);

      const response = await fetch(
        `https://edmamalayalee.co.uk/api/get_users_from_email.php?email=${encodeURIComponent(
          loggedUser.email
        )}`
      );
      const data = await response.json();

      if (data.exists) {
        setMembers(data.members || []);
        setMembershipType(data.membership_type || "");
        setFamilyId(data.family_id || null);

        if (data.already_registered) {
          // ✅ Family already registered
          setAlreadyRegistered(true);
          setRegistrationDetails(data.registration_details);
        } else {
          // ✅ Not registered yet
          setFormData({
            name: loggedUser.displayName,
            email: loggedUser.email,
            adults: data.total_adults || 0,
            kids: data.total_kids || 0,
            guestAdults: 0,
            guestKids: 0,
            additionalFamilyAdults: 0,
            AdditionalFamilyKids: 0,
          });
        }
      } else {
        setShowConfirmModal(true);
      }
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      alert("Google Sign-in failed. Please try again.");
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setMembers([]);
    setMembershipType("");
    setFamilyId(null);
    setAlreadyRegistered(false);
    setRegistrationDetails(null);
    setFormData({
      name: "",
      email: "",
      adults: "",
      kids: "",
      guestAdults: 0,
      guestKids: 0,
      additionalFamilyAdults: 0,
      AdditionalFamilyKids: 0,
    });
    setTotalCost(0);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cost calculation
  useEffect(() => {
    let cost = 0;

    const adults = parseInt(formData.adults) || 0;
    const kids = parseInt(formData.kids) || 0;
    const guestAdults = parseInt(formData.guestAdults) || 0;
    const additionalAdults = parseInt(formData.additionalFamilyAdults) || 0;

    if (membershipType === "Gold") {
      cost = 0;
      cost += guestAdults * 20;
    } else if (membershipType === "Silver") {
      cost += adults * 15;
      cost += guestAdults * 20;
      cost += additionalAdults * 15;
    } else if (membershipType === "Other") {
      cost += adults * 20;
      cost += guestAdults * 20;
      cost += additionalAdults * 20;
    }

    setTotalCost(cost);
  }, [
    formData.adults,
    formData.kids,
    formData.guestAdults,
    formData.guestKids,
    formData.additionalFamilyAdults,
    formData.AdditionalFamilyKids,
    membershipType,
  ]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://edmamalayalee.co.uk/api/onam2025_register.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            familyId: familyId,
            name: formData.name,
            email: formData.email,
            membershipType: membershipType,
            totalAdults: formData.adults,
            totalKids: formData.kids,
            totalGuestAdults: formData.guestAdults,
            totalGuestKids: formData.guestKids,
            totalAdditionalAdults: formData.additionalFamilyAdults,
            totalAdditionalKids: formData.AdditionalFamilyKids,
            totalAmount: totalCost,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setShowModal(true);

        // ✅ Send confirmation email via EmailJS
        emailjs
          .send(
            "service_vt04h2f", // 🔁 replace with your EmailJS service ID
            "template_s3bci89", // 🔁 replace with your EmailJS template ID
            {
              name: formData.name,
              email: formData.email,
              adults: formData.adults,
              kids: formData.kids,
              guestAdults: formData.guestAdults,
              guestKids: formData.guestKids,
              additionalFamilyAdults: formData.additionalFamilyAdults,
              AdditionalFamilyKids: formData.AdditionalFamilyKids,
              totalAmount: totalCost,
            },
            "x8yLke-spZRWZfo3L" // 🔁 replace with your EmailJS public key
          )
          .then(
            () => {
              console.log("✅ Confirmation email sent to registrant");
            },
            (error) => {
              console.error("❌ Failed to send confirmation email:", error);
            }
          );

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        alert(data.message || "Registration failed!");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed due to network/server error.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg rounded-4 border-top border-warning">
            <div className="card-header bg-warning text-center text-dark">
              <h3 className="mb-0">Onam 2025 Registration</h3>
            </div>
            <div className="card-body">
              {!user ? (
                // Not logged in
                <div className="d-grid gap-3">
                  <button
                    onClick={handleGoogleSignIn}
                    className="btn btn-danger btn-lg d-flex align-items-center justify-content-center"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      alt="Google"
                      width="20"
                      height="20"
                      className="me-2"
                    />
                    Continue with Google
                  </button>
                </div>
              ) : alreadyRegistered ? (
                // ✅ Already Registered
            <div className="alert alert-info">
                <h5>You have already registered for Onam 2025 🎉</h5>
                <p><strong>Name:</strong> {registrationDetails.name}</p>
                <p><strong>Email:</strong> {registrationDetails.email}</p>
                <p><strong>Members:</strong> {registrationDetails.total_adults}</p>
                <p><strong>Kids:</strong> {registrationDetails.total_kids}</p>
                <p>
                  <strong>Guests:</strong> {registrationDetails.total_guest_adults} Members,{" "}
                  {registrationDetails.total_guest_kids} Kids
                </p>
                <p>
                  <strong>Additional Family:</strong> {registrationDetails.total_additional_adults} Members,{" "}
                  {registrationDetails.total_additional_kids} Kids
                </p>
                <p><strong>Total Amount To Pay:</strong> £{registrationDetails.total_amount}</p>

                {/* Note added here */}
                <p className="text-danger mt-2">
                  Note: Members means persons aged &gt; 10
                </p>

                <button onClick={handleLogout} className="btn btn-secondary mt-3">
                  Logout
                </button>
              </div>

              ) : (
                // ✅ Registration Form
                <form onSubmit={handleSubmit}>
                  {/* Name & Email */}
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="form-control"
                    />
                  </div>

                  {/* Membership Type */}
                  <div className="mb-3">
                    <label className="form-label">Membership Type</label>
                    <select
                      name="membershipType"
                      value={membershipType}
                      onChange={(e) => setMembershipType(e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">Select Membership Type</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Family Members */}
                  {members.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label">Family Members</label>
                      <ul className="list-group">
                        {members.map((m) => (
                          <li key={m.id} className="list-group-item">
                            {m.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Adults & Kids */}
                  <div className="mb-3 p-3 border border-primary rounded bg-light">
                    <label className="form-label fw-bold">Family Members</label>
                    <div className="row">
                      <div className="col mb-2">
                        <label className="form-label">Total Members (age ≥10)</label>
                        <input
                          type="number"
                          name="adults"
                          value={formData.adults}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col mb-2">
                        <label className="form-label">Total Kids (age &lt;10)</label>
                        <input
                          type="number"
                          name="kids"
                          value={formData.kids}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Family */}
                  <div className="mb-3 p-3 border border-danger rounded bg-light">
                    <label className="form-label fw-bold">
                      Additional Family (Father, Mother, Brother, Sister etc.)
                    </label>
                    <div className="row">
                      <div className="col mb-2">
                        <label className="form-label">age ≥10</label>
                        <input
                          type="number"
                          name="additionalFamilyAdults"
                          value={formData.additionalFamilyAdults}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col mb-2">
                        <label className="form-label">age &lt;10</label>
                        <input
                          type="number"
                          name="AdditionalFamilyKids"
                          value={formData.AdditionalFamilyKids}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guest Adults & Kids */}
                  <div className="mb-3 p-3 border border-danger rounded bg-light">
                    <label className="form-label fw-bold">Others(Friends, Colleagues,Ralatives etc)</label>
                    <div className="row">
                      <div className="col mb-2">
                        <label className="form-label">age ≥10</label>
                        <input
                          type="number"
                          name="guestAdults"
                          value={formData.guestAdults}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col mb-2">
                        <label className="form-label">age &lt;10</label>
                        <input
                          type="number"
                          name="guestKids"
                          value={formData.guestKids}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Cost */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Total Cost (£)</label>
                    <input
                      type="text"
                      value={totalCost}
                      readOnly
                      className="form-control fw-bold text-success"
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Register"}
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="btn btn-secondary btn-lg"
                    >
                      Logout
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-success">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Thanks for Registering!</h5>
              </div>
              <div className="modal-body">
                <p>
                  See you at <strong>Luppitt Village Hall, Honiton</strong> on{" "}
                  <strong>20 Sep 2025</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-warning">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">Registration Not Found</h5>
              </div>
              <div className="modal-body">
                <p>
                  Your records are not found in our system. <br />
                  Would you like to <strong>register now with EDMA</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setMembers([]);
                    setMembershipType("");
                    setFamilyId(null);
                    setFormData({
                      name: user.displayName,
                      email: user.email,
                      adults: "",
                      kids: "",
                      guestAdults: 0,
                      guestKids: 0,
                      additionalFamilyAdults: 0,
                      AdditionalFamilyKids: 0,
                    });
                  }}
                >
                  No, I Like to Give Count Only
                </button>
                <button
                  className="btn btn-warning"
                  onClick={async () => {
                    window.location.href =
                      "https://edmamalayalee.co.uk/register";
                    await signOut(auth);
                    setUser(null);
                    setMembers([]);
                    setMembershipType("");
                    setFamilyId(null);
                    setFormData({
                      name: "",
                      email: "",
                      adults: "",
                      kids: "",
                      guestAdults: 0,
                      guestKids: 0,
                      additionalFamilyAdults: 0,
                      AdditionalFamilyKids: 0,
                    });
                    setTotalCost(0);
                  }}
                >
                  Yes, Register Me with EDMA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
