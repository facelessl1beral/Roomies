import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_PROFILE,
  VIEW_PROFILE,
  GET_PROFILES,
  GET_RECOMMENDATIONS,
  RECOMMENDATIONS_ERROR,
  PROFILE_ERROR,
  REJECT_PROFILE,
  ACCEPT_PROFILE,
  CLEAR_PROFILE
  
} from './types';

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

export const getProfiles = () => async dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get('/api/profile');
    dispatch({ type: GET_PROFILES, payload: res.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

export const getRecommendations = () => async dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get('/api/profile/recommended');
    dispatch({ type: GET_RECOMMENDATIONS, payload: res.data });
  } catch (err) {
    dispatch({
      type: RECOMMENDATIONS_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

export const rejectUser = (id) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const res = await axios.post('/api/profile/reject', { id }, config);
    dispatch({ type: REJECT_PROFILE, payload: res.data });
    dispatch(setAlert('User Rejected!', 'danger'));
  } catch (err) {
    dispatch({
      type: RECOMMENDATIONS_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

export const acceptUser = (id) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const res = await axios.post('/api/profile/accept', { id }, config);
    dispatch({ type: ACCEPT_PROFILE, payload: res.data });
    dispatch(setAlert('User Accepted!', 'success'));
  } catch (err) {
    dispatch({
      type: RECOMMENDATIONS_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

export const getProfileById = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);
    dispatch({ type: VIEW_PROFILE, payload: res.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const res = await axios.post('/api/profile', formData, config);
    dispatch({ type: GET_PROFILE, payload: res.data });
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
    history.push('/dashboard');
  } catch (err) {
    const errors = err.response?.data?.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};
