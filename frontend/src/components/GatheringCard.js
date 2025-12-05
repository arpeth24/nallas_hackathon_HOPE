import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './GatheringCard.css';

function GatheringCard({ gathering, currentUser, onDelete, onUpdate }) {
  const [isParticipating, setIsParticipating] = useState(gathering.participants?.includes(currentUser?.uid));
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    gatheringName: gathering.gatheringName || '',
    organizerName: gathering.organizerName || '',
    eventType: gathering.eventType || '',
    date: gathering.date || '',
    time: gathering.time || '',
    venue: gathering.venue || '',
    location: gathering.location || '',
    description: gathering.description || ''
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleParticipate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/gatherings/${gathering.id}/participate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.uid })
      });
      if (response.ok) {
        setIsParticipating(prev => !prev);
      }
    } catch (err) {
      console.error('Error participating:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this gathering? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/gatherings/${gathering.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (onDelete) onDelete(gathering.id);
      } else {
        const d = await res.json();
        alert('Delete failed: ' + (d.message || res.statusText));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      const res = await fetch(`http://localhost:5000/api/gatherings/${gathering.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        // notify parent to update list
        if (onUpdate) onUpdate({ id: gathering.id, ...payload });
        setEditing(false);
      } else {
        alert('Update failed: ' + (data.message || res.statusText));
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gathering-card">
      {editing ? (
        <div className="edit-form">
          <input name="gatheringName" value={form.gatheringName} onChange={handleEditChange} placeholder="Gathering name" />
          <input name="organizerName" value={form.organizerName} onChange={handleEditChange} placeholder="Organizer" />
          <select name="eventType" value={form.eventType} onChange={handleEditChange}>
            <option value="">Select type</option>
            <option>Religious</option>
            <option>Sports</option>
            <option>Club</option>
            <option>Education</option>
            <option>Get Together</option>
          </select>
          <input name="date" type="date" value={form.date} onChange={handleEditChange} />
          <input name="time" type="time" value={form.time} onChange={handleEditChange} />
          <input name="venue" value={form.venue} onChange={handleEditChange} placeholder="Venue" />
          <input name="location" value={form.location} onChange={handleEditChange} placeholder="Location" />
          <textarea name="description" value={form.description} onChange={handleEditChange} placeholder="Description" />
          <div className="card-buttons">
            <button onClick={handleSave} disabled={saving} className="details-btn">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setEditing(false)} className="participate-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3>{gathering.gatheringName}</h3>
          <p><strong>Organizer:</strong> {gathering.organizerName}</p>
          <p><strong>Event Type:</strong> {gathering.eventType}</p>
          <p><strong>Date:</strong> {gathering.date}</p>
          <p><strong>Time:</strong> {gathering.time}</p>
          <p><strong>Venue:</strong> {gathering.venue}</p>
          <p><strong>Location:</strong> {gathering.location}</p>
          <div className="card-buttons">
            <Link to={`/gathering/${gathering.id}`} className="details-btn">View Details</Link>
            <button onClick={handleParticipate} className={`participate-btn ${isParticipating ? 'active' : ''}`}>
              {isParticipating ? '✓ I am there' : 'I am there'}
            </button>
          </div>

          <div className="card-actions" style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button onClick={() => setEditing(true)} className="edit-btn">Edit</button>
            <button onClick={handleDelete} disabled={deleting} className="delete-btn">{deleting ? 'Deleting...' : 'Delete'}</button>
          </div>
        </>
      )}
    </div>
  );
}

export default GatheringCard;
