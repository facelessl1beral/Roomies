import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <section className='landing'>
      <div className='landing-inner'>
        <h1>Find Your Perfect Hostel Roommate</h1>
        <h2>
          AI-powered matching across 15+ lifestyle factors.<br />
          No more random pairings. Just compatible humans.
        </h2>

        <div className='landing-stats'>
          <div className='landing-stat'>
            <div className='landing-stat-num'>85%</div>
            <div className='landing-stat-label'>Match accuracy</div>
          </div>
          <div className='landing-stat'>
            <div className='landing-stat-num'>15+</div>
            <div className='landing-stat-label'>Compatibility factors</div>
          </div>
          <div className='landing-stat'>
            <div className='landing-stat-num'>3</div>
            <div className='landing-stat-label'>Algorithms</div>
          </div>
        </div>

        <div className='buttons'>
          <Link to='/register' className='btn btn-primary'>
            Get started →
          </Link>
          <Link to='/login' className='btn btn-secondary'>
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
