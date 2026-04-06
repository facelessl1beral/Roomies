import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ token }) => {
  const [tab, setTab] = useState('matches');
  const [matches, setMatches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roomForm, setRoomForm] = useState({
    roomNumber: '', type: '', floor: '', bathroom: '', proximity: '', capacity: 2
  });
  const [formError, setFormError] = useState('');
  const [batchCount, setBatchCount] = useState(1);
  const [confirming, setConfirming] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('');

  const headers = { 'x-auth-token': token };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [mRes, rRes] = await Promise.all([
        axios.get('/api/hostels/matches', { headers }),
        axios.get('/api/hostels/rooms', { headers })
      ]);
      setMatches(mRes.data);
      setRooms(rRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!roomForm.roomNumber || !roomForm.type || !roomForm.floor || !roomForm.bathroom) {
      setFormError('Please fill in all required fields');
      return;
    }
    try {
      let res;
      const count = parseInt(batchCount) || 1;
      for (let i = 0; i < count; i++) {
        const roomData = count === 1
          ? roomForm
          : { ...roomForm, roomNumber: `${roomForm.roomNumber}${count > 1 ? String.fromCharCode(65 + i) : ''}` };
        res = await axios.post('/api/hostels/rooms', roomData, { headers });
      }
      setRooms(res.data);
      setRoomForm({ roomNumber: '', type: '', floor: '', bathroom: '', proximity: '', capacity: 2 });
      setBatchCount(1);
      setFormError('');
    } catch (err) {
      setFormError('Failed to add room');
    }
  };

  const handleDelete = async (roomId) => {
    try {
      const res = await axios.delete(`/api/hostels/rooms/${roomId}`, { headers });
      setRooms(res.data);
    } catch (err) {
      setError('Failed to delete room');
    }
  };

  const handleConfirm = async (studentAId, studentBId) => {
    if (!selectedRoom) return alert('Please select a room first');
    try {
      await axios.post('/api/hostels/matches/confirm', {
        studentAId, studentBId, roomId: selectedRoom
      }, { headers });
      setConfirming(null);
      setSelectedRoom('');
      fetchAll();
    } catch (err) {
      setError('Failed to confirm booking');
    }
  };

  const availableRooms = rooms.filter(r => r.status === 'available');

  const pill = (label, field, value) => (
    <button
      key={value}
      onClick={() => setRoomForm(f => ({ ...f, [field]: value }))}
      style={{
        padding: '6px 14px', borderRadius: '20px', border: '1px solid #ccc',
        marginRight: '8px', marginBottom: '8px', cursor: 'pointer',
        background: roomForm[field] === value ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'transparent',
        color: roomForm[field] === value ? '#fff' : 'inherit', fontSize: '0.85rem'
      }}
    >{label}</button>
  );

  const statusColor = s => s === 'available' ? '#48bb78' : s === 'pending' ? '#ed8936' : '#fc8181';

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '900px' }}>
      <h2 className="mb-1">Hostel Dashboard</h2>
      {error && <div className="alert alert-danger mt-2">{error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', margin: '20px 0', borderBottom: '2px solid #eee' }}>
        {['matches', 'rooms'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 24px', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: tab === t ? '700' : '400',
            borderBottom: tab === t ? '3px solid #667eea' : '3px solid transparent',
            fontSize: '1rem', textTransform: 'capitalize'
          }}>{t === 'matches' ? `Matches (${matches.length})` : `Rooms (${rooms.length})`}</button>
        ))}
      </div>

      {/* MATCHES TAB */}
      {tab === 'matches' && (
        matches.length === 0
          ? <div className="text-center mt-5" style={{ opacity: 0.5 }}>
              <h4>No matches yet</h4>
              <p>When two students mutually match and select your hostel, they appear here.</p>
            </div>
          : matches.map((match, i) => (
            <div key={i} className="card p-4 mb-4" style={{ borderRadius: '16px' }}>
              <div className="row">
                <div className="col-md-5">
                  <h6 style={{ opacity: 0.5, fontSize: '0.8rem', textTransform: 'uppercase' }}>Student A</h6>
                  <p style={{ marginBottom: '4px' }}><strong>{match.studentA.name}</strong></p>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '4px' }}>{match.studentA.email}</p>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>{match.studentA.course} — {match.studentA.sem}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[match.studentA.roomType, match.studentA.floorPref, match.studentA.bathroomPref, match.studentA.proximityPref].filter(Boolean).map((v, j) => (
                      <span key={j} style={{ background: '#f0f0f0', borderRadius: '12px', padding: '2px 10px', fontSize: '0.78rem' }}>{v}</span>
                    ))}
                  </div>
                </div>
                <div className="col-md-2 d-flex align-items-center justify-content-center">
                  <span style={{ fontSize: '1.5rem' }}>🤝</span>
                </div>
                <div className="col-md-5">
                  <h6 style={{ opacity: 0.5, fontSize: '0.8rem', textTransform: 'uppercase' }}>Student B</h6>
                  <p style={{ marginBottom: '4px' }}><strong>{match.studentB.name}</strong></p>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '4px' }}>{match.studentB.email}</p>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>{match.studentB.course} — {match.studentB.sem}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[match.studentB.roomType, match.studentB.floorPref, match.studentB.bathroomPref, match.studentB.proximityPref].filter(Boolean).map((v, j) => (
                      <span key={j} style={{ background: '#f0f0f0', borderRadius: '12px', padding: '2px 10px', fontSize: '0.78rem' }}>{v}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3" style={{ borderTop: '1px solid #eee' }}>
                {confirming === i ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <select
                      value={selectedRoom}
                      onChange={e => setSelectedRoom(e.target.value)}
                      className="form-control"
                      style={{ maxWidth: '220px' }}
                    >
                      <option value="">Select a room...</option>
                      {availableRooms.map(r => (
                        <option key={r._id} value={r._id}>
                          Room {r.roomNumber} — {r.type}, {r.floor}, {r.bathroom}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleConfirm(match.studentA._id, match.studentB._id)}
                      style={{ padding: '8px 20px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >Confirm Booking</button>
                    <button onClick={() => setConfirming(null)} style={{ background: 'none', border: 'none', opacity: 0.5, cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(i)}
                    style={{ padding: '8px 20px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  >Assign Room & Confirm</button>
                )}
              </div>
            </div>
          ))
      )}

      {/* ROOMS TAB */}
      {tab === 'rooms' && (
        <div>
          {/* Add room form */}
          <div className="card p-4 mb-4" style={{ borderRadius: '16px' }}>
            <h5 className="mb-3">Add a Room</h5>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <div className="form-group mb-3">
              <label style={{ fontSize: '0.85rem', opacity: 0.7 }}>Room Number *</label>
              <input
                type="text"
                className="form-control"
                value={roomForm.roomNumber}
                onChange={e => { const v = e.target.value; setRoomForm(f => ({ ...f, roomNumber: v })); }}
                placeholder="e.g. 4B, 101"
                style={{ maxWidth: '200px' }}
              />
            </div>
            <div className="mb-2">
              <label style={{ fontSize: '0.85rem', opacity: 0.7 }}>Room Type *</label><br />
              {['Single', 'Double', 'Dorm'].map(v => pill(v, 'type', v))}
            </div>
            <div className="mb-2">
              <label style={{ fontSize: '0.85rem', opacity: 0.7 }}>Floor *</label><br />
              {['Ground floor', 'First floor', 'Second floor'].map(v => pill(v, 'floor', v))}
            </div>
            <div className="mb-2">
              <label style={{ fontSize: '0.85rem', opacity: 0.7 }}>Bathroom *</label><br />
              {['En-suite', 'Shared'].map(v => pill(v, 'bathroom', v))}
            </div>
            <div className="mb-3">
              <label style={{ fontSize: '0.85rem', opacity: 0.7 }}>Proximity</label><br />
              {['Dining hall', 'Main gate', 'Library', 'None'].map(v => pill(v, 'proximity', v))}
            </div>
            <div className="form-group mb-3">
              <label style={{ fontSize: '0.85rem', opacity: 0.7 }}>Capacity</label>
              <input
                type="number"
                className="form-control"
                value={roomForm.capacity}
                onChange={e => { const v = e.target.value; setRoomForm(f => ({ ...f, capacity: v })); }}
                style={{ maxWidth: '100px' }}
                min="1" max="10"
              />
            </div>
            <button
              onClick={handleRoomSubmit}
              style={{ padding: '10px 28px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            onClick={(e) => handleRoomSubmit(e)}>Add Room</button>
            <div className="mt-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0 }}>Batch add:</label>
              <input
                type="number"
                min="1" max="20"
                value={batchCount}
                onChange={e => { const v = e.target.value; setBatchCount(v); }}
                style={{ width: '70px' }}
                className="form-control"
              />
              <span style={{ fontSize: '0.82rem', opacity: 0.6 }}>rooms with sequential suffixes (e.g. 4A, 4B, 4C)</span>
            </div>
          </div>

          {/* Room grid */}
          {rooms.length === 0
            ? <p style={{ opacity: 0.5 }}>No rooms added yet.</p>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '16px' }}>
                {rooms.map(room => (
                  <div key={room._id} className="card p-3" style={{ borderRadius: '12px', borderLeft: `4px solid ${statusColor(room.status)}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h5 style={{ margin: 0 }}>Room {room.roomNumber}</h5>
                      <button onClick={() => handleDelete(room._id)} style={{ background: 'none', border: 'none', opacity: 0.4, cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                    </div>
                    <p style={{ fontSize: '0.82rem', opacity: 0.7, margin: '8px 0 4px' }}>{room.type} · {room.floor}</p>
                    <p style={{ fontSize: '0.82rem', opacity: 0.7, margin: '0 0 8px' }}>{room.bathroom} · Cap: {room.capacity}</p>
                    <span style={{ fontSize: '0.78rem', padding: '2px 10px', borderRadius: '12px', background: statusColor(room.status), color: '#fff' }}>{room.status}</span>
                  </div>
                ))}
              </div>
          }
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
