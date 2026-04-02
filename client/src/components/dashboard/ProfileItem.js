import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const ProfileItem = ({ profile }) => {
  const {
    _id, firstName, lastName, name,
    gender, age, univ, city, country,
    avatar, course, sem, food, smoke,
    sleepSchedule, cleanliness, notes
  } = profile;

  const displayName = `${firstName || ''} ${lastName || ''}`.trim() || name || 'Anonymous';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const tag = (emoji, val) => val ? (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
      padding: '0.22rem 0.65rem', borderRadius: '99px',
      fontSize: '0.75rem', fontWeight: 500,
      background: 'rgba(124,58,237,0.1)',
      color: 'var(--accent-purple)',
      border: '1px solid rgba(124,58,237,0.18)',
      margin: '0.15rem 0.1rem 0 0',
    }}>{emoji} {val}</span>
  ) : null;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '1.5rem',
      marginBottom: '1rem',
      display: 'flex',
      gap: '1.25rem',
      alignItems: 'flex-start',
      transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.15)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '120px', height: '120px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {avatar ? (
        <img src={avatar} alt={displayName} style={{
          width: 64, height: 64, borderRadius: '50%',
          objectFit: 'cover', flexShrink: 0,
          border: '2px solid rgba(124,58,237,0.3)',
          boxShadow: '0 0 0 4px rgba(124,58,237,0.08)',
        }} />
      ) : (
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', fontWeight: 700, color: '#fff',
          flexShrink: 0, fontFamily: 'var(--font-display)',
          boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
        }}>{initials}</div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.15rem',
              fontWeight: 700, color: 'var(--text-primary)',
              letterSpacing: '-0.01em', marginBottom: '0.15rem',
            }}>{displayName}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {city}{country && `, ${country}`}
              {univ && <span style={{ color: 'var(--text-muted)' }}> · {univ}</span>}
            </p>
          </div>
          <Link to={`/profile/${_id}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            padding: '0.45rem 1rem', borderRadius: '99px',
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.25)',
            color: 'var(--accent-purple)', fontSize: '0.8rem',
            fontWeight: 600, flexShrink: 0,
            transition: 'all 0.18s', textDecoration: 'none',
          }}>View →</Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {tag('👤', gender)}
          {tag('🎂', age)}
          {tag('📚', course)}
          {tag('🗓', sem)}
          {tag('🍽', food)}
          {tag('🌙', sleepSchedule)}
          {tag('✨', cleanliness)}
          {smoke === 'Non-smoker' && tag('🚭', 'Non-smoker')}
        </div>

        {notes && (
          <p style={{
            marginTop: '0.65rem', fontSize: '0.82rem',
            color: 'var(--text-muted)', fontStyle: 'italic',
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
            borderLeft: '2px solid rgba(124,58,237,0.3)',
            paddingLeft: '0.6rem',
          }}>{notes}</p>
        )}
      </div>
    </div>
  );
};

ProfileItem.propTypes = { profile: PropTypes.object.isRequired };
export default connect()(ProfileItem);
