import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProfileById } from "../../actions/profile";

const Profile = ({
  getProfileById,
  profile: { viewedProfile, loading },
  auth,
  match,
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  const profile = viewedProfile;

  const displayName = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.name
    : '';

  const isOwnProfile =
    auth.isAuthenticated && auth.loading === false && auth.user && profile &&
    (auth.user._id === profile._id || auth.user.id === profile._id);

  if (loading || !profile) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#7c3aed',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1.5rem'
        }} />
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>Loading profile...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const Tag = ({ val, emoji }) => !val ? null : (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
      padding: '0.3rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem',
      fontWeight: 500, background: 'rgba(124,58,237,0.15)',
      color: 'var(--accent-purple)', border: '1px solid rgba(124,58,237,0.3)',
      margin: '0.2rem 0.15rem 0 0',
    }}>{emoji && `${emoji} `}{val}</span>
  );

  const Row = ({ label, value, emoji }) => !value ? null : (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.6rem 0', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{
        color: 'var(--text-muted)', fontSize: '0.75rem',
        textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 500,
      }}>{emoji && `${emoji} `}{label}</span>
      <span style={{
        color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.88rem',
        textAlign: 'right', maxWidth: '60%',
      }}>{value}</span>
    </div>
  );

  const Card = ({ children, style = {} }) => (
    <div style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border)', borderRadius: '20px',
      padding: '1.75rem', ...style
    }}>{children}</div>
  );

  const SectionTitle = ({ title }) => (
    <h3 style={{
      fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 600,
      color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em',
      marginBottom: '1rem', paddingBottom: '0.75rem',
      borderBottom: '1px solid var(--border)',
    }}>{title}</h3>
  );

  return (
    <div style={{
      maxWidth: 820, margin: '0 auto',
      padding: 'calc(var(--navbar-height, 72px) + 1.5rem) 1.5rem 3rem',
    }}>
      {/* Nav buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <Link to="/recommendations" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.5rem 1.1rem', borderRadius: '99px',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none',
        }}>← Back</Link>
        {isOwnProfile && (
          <Link to="/edit-profile" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '0.5rem 1.1rem', borderRadius: '99px',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            color: '#fff', fontSize: '0.85rem', fontWeight: 600,
            textDecoration: 'none', boxShadow: '0 2px 12px rgba(124,58,237,0.3)',
          }}>Edit profile</Link>
        )}
      </div>

      {/* Hero card */}
      <Card style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {profile.avatar ? (
            <img src={profile.avatar} alt={displayName} style={{
              width: 100, height: 100, borderRadius: '50%', objectFit: 'cover',
              flexShrink: 0, border: '3px solid rgba(124,58,237,0.4)',
              boxShadow: '0 0 0 6px rgba(124,58,237,0.08)',
            }} />
          ) : (
            <div style={{
              width: 100, height: 100, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 700, color: '#fff',
              fontFamily: 'var(--font-display)',
              boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
            }}>{initials}</div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', letterSpacing: '-0.02em',
              color: 'var(--text-primary)', marginBottom: '0.3rem', lineHeight: 1.1,
            }}>{displayName}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '0.75rem' }}>
              {profile.city}{profile.country && `, ${profile.country}`}
              {profile.univ && <span style={{ color: 'var(--text-muted)' }}> · {profile.univ}</span>}
            </p>
            <div>
              <Tag val={profile.gender} emoji="👤" />
              <Tag val={profile.age} emoji="🎂" />
              <Tag val={profile.course} emoji="📚" />
              <Tag val={profile.sem} emoji="🗓" />
            </div>
            {profile.notes && (
              <p style={{
                color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic',
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderLeft: '3px solid #7c3aed',
                padding: '0.75rem 1rem', borderRadius: '0 10px 10px 0', marginTop: '0.75rem',
              }}>"{profile.notes}"</p>
            )}
          </div>
        </div>
      </Card>

      {/* Two-column detail */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <Card>
          <SectionTitle title="Lifestyle" />
          <Row label="Food"        value={profile.food}          emoji="🍽" />
          <Row label="Smoking"     value={profile.smoke}         emoji="🚬" />
          <Row label="Drinking"    value={profile.drink}         emoji="🍷" />
          <Row label="Cooking"     value={profile.cook}          emoji="👨‍🍳" />
          <Row label="Sleep"       value={profile.sleepSchedule} emoji="🌙" />
          <Row label="Study"       value={profile.studyPref}     emoji="📖" />
          <Row label="Cleanliness" value={profile.cleanliness}   emoji="✨" />
          <Row label="Social"      value={profile.social}        emoji="👥" />
          <Row label="Noise"       value={profile.noise}         emoji="🔊" />
          <Row label="Guests"      value={profile.guests}        emoji="🚪" />
          <Row label="Exercise"    value={profile.exercise}      emoji="🏃" />
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              marginTop: '1rem', padding: '0.5rem 1.1rem', borderRadius: '99px',
              background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
              color: '#93c5fd', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none',
            }}>LinkedIn →</a>
          )}
        </Card>

        <Card>
          <SectionTitle title="Looking for" />
          <Row label="Gender"     value={profile.roomieGender}  emoji="👤" />
          <Row label="Age"        value={profile.roomieAge}     emoji="🎂" />
          <Row label="Country"    value={profile.roomieCountry} emoji="🌍" />
          <Row label="University" value={profile.roomieUniv}    emoji="🎓" />
          <Row label="Course"     value={profile.roomieCourse}  emoji="📚" />
          <Row label="Semester"   value={profile.roomieSem}     emoji="🗓" />
          <Row label="Food"       value={profile.roomieFood}    emoji="🍽" />
          <Row label="Smoking"    value={profile.roomieSmoke}   emoji="🚬" />
          <Row label="Drinking"   value={profile.roomieDrink}   emoji="🍷" />
          <Row label="Cooking"    value={profile.roomieCook}    emoji="👨‍🍳" />
        </Card>
      </div>
    </div>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
