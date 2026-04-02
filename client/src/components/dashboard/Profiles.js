import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfiles } from '../../actions/profile';
import ProfileItem from "./ProfileItem";

const Profiles = ({
  getProfiles,
  profile: { profiles, loading },
}) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  const filtered = profiles ? profiles.filter(p => {
    const name = `${p.firstName || ''} ${p.lastName || ''} ${p.name || ''}`.toLowerCase();
    const loc = `${p.city || ''} ${p.country || ''} ${p.univ || ''}`.toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || loc.includes(q);
  }) : [];

  if (loading) return <Spinner />;

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 700, letterSpacing: '-0.02em',
          color: 'var(--text-primary)', marginBottom: '0.4rem',
        }}>People</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {profiles?.length || 0} people on Homies
        </p>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '1.75rem' }}>
        <span style={{
          position: 'absolute', left: '1rem', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-muted)',
          fontSize: '1rem', pointerEvents: 'none',
        }}>🔍</span>
        <input
          type="text"
          placeholder="Search by name, city, university..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '99px', color: 'var(--text-primary)',
            fontSize: '0.95rem', fontFamily: 'var(--font-body)',
            outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <>
          {search && (
            <p style={{
              fontSize: '0.82rem', color: 'var(--text-muted)',
              marginBottom: '1rem',
            }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
            </p>
          )}
          {filtered.map(profile => (
            <ProfileItem key={profile._id} profile={profile} />
          ))}
        </>
      ) : (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>👥</div>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.3rem',
            color: 'var(--text-primary)', marginBottom: '0.5rem',
          }}>
            {search ? 'No results found' : 'No people yet'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {search ? `Try a different search term` : 'Be the first to join!'}
          </p>
        </div>
      )}
    </div>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
