import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function WelcomePage() {
  const [attendedFamilies, setAttendedFamilies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 Fetch attended families every 10 seconds
  useEffect(() => {
    const fetchAttended = async () => {
      try {
        const response = await fetch(
          "https://edmamalayalee.co.uk/api/get_latest_attended.php"
        );
        const data = await response.json();

        if (data.success && data.families) {
          setAttendedFamilies((prev) => {
            // Merge new families with existing, avoiding duplicates
            const allFamilies = [...data.families, ...prev];
            const uniqueFamilies = allFamilies.filter(
              (f, index, self) => index === self.findIndex((t) => t.id === f.id)
            );
            return uniqueFamilies;
          });
        }
      } catch (err) {
        console.error("Error fetching attended families:", err);
      }
    };

    fetchAttended(); // initial fetch
    const intervalFetch = setInterval(fetchAttended, 10000); // refresh every 10s

    return () => clearInterval(intervalFetch);
  }, []);

  // 🔹 Rotate through families every 5 seconds
  useEffect(() => {
    if (attendedFamilies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % attendedFamilies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [attendedFamilies]);

  const currentFamily =
    attendedFamilies.length > 0 ? attendedFamilies[currentIndex] : null;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white text-center">
      {currentFamily ? (
        <>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
          <h1 className="fw-bold display-2 text-warning mb-4 animate__animated animate__fadeInDown">
            🎉 Welcome 🎉
          </h1>
          <h2 className="fw-bold display-4 animate__animated animate__zoomIn">
            {currentFamily.name} Family
          </h2>
          <p className="mt-3 text-light fst-italic">
            Thank you for joining Onam 2025!
          </p>
        </>
      ) : (
        <h2 className="text-muted">Waiting for families to attend...</h2>
      )}
    </div>
  );
}
