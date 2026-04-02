import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ token, onLogout }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('/api/hostels/matches', {
          headers: { 'x-auth-token': token }
        });
        setMatches(res.data);
      } catch (err) {
        setError('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [token]);

  if (loading) return <div className="text-center mt-5">Loading matches...</div>;

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2>Roommate Match Requests</h2>
        <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>When two students mutually match and select your hostel, their details appear here.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {matches.length === 0 ? (
        <div className="text-center mt-5" style={{ opacity: 0.5 }}>
          <h4>No matches yet</h4>
          <p>When two students mutually match and select your hostel, they'll appear here.</p>
        </div>
      ) : (
        matches.map((match, i) => (
          <div key={i} className="card mb-4 p-4" style={{ borderRadius: '16px' }}>
            <h5 className="mb-3">Match #{i + 1}</h5>
            <div className="row">
              <div className="col-md-6">
                <h6>Student A</h6>
                <p>
                  <strong>{match.studentA.name}</strong><br />
                  {match.studentA.email}<br />
                  {match.studentA.course} — {match.studentA.sem}<br />
                  <span className="badge bg-secondary me-1">{match.studentA.roomType}</span>
                  <span className="badge bg-secondary me-1">{match.studentA.floorPref}</span>
                  <span className="badge bg-secondary me-1">{match.studentA.bathroomPref}</span>
                  <span className="badge bg-secondary">{match.studentA.proximityPref}</span>
                </p>
              </div>
              <div className="col-md-6">
                <h6>Student B</h6>
                <p>
                  <strong>{match.studentB.name}</strong><br />
                  {match.studentB.email}<br />
                  {match.studentB.course} — {match.studentB.sem}<br />
                  <span className="badge bg-secondary me-1">{match.studentB.roomType}</span>
                  <span className="badge bg-secondary me-1">{match.studentB.floorPref}</span>
                  <span className="badge bg-secondary me-1">{match.studentB.bathroomPref}</span>
                  <span className="badge bg-secondary">{match.studentB.proximityPref}</span>
                </p>
              </div>
            </div>
            <div className="mt-2" style={{ fontSize: '0.85rem', opacity: 0.6 }}>
              Both selected: <strong>{match.studentA.preferredHostel}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
