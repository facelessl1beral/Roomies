import {
  GET_PROFILE,
  GET_RECOMMENDATIONS,
  RECOMMENDATIONS_ERROR,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  REJECT_PROFILE,
  ACCEPT_PROFILE,
  VIEW_PROFILE
} from '../actions/types';

const initialState = {
  profile: null,
  viewedProfile: null,
  profiles: [],
  recommendations: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return { ...state, profile: payload, loading: false };
    case VIEW_PROFILE:
      return { ...state, viewedProfile: payload, loading: false };
    case GET_PROFILES:
      return { ...state, profiles: Array.isArray(payload) ? payload : [], loading: false };
    case GET_RECOMMENDATIONS:
      return { ...state, recommendations: Array.isArray(payload) ? payload : [], loading: false };
    case ACCEPT_PROFILE:
    case REJECT_PROFILE:
      return {
        ...state,
        recommendations: Array.isArray(payload) ? payload : state.recommendations,
        loading: false
      };
    case PROFILE_ERROR:
    case RECOMMENDATIONS_ERROR:
      return { ...state, error: payload, loading: false, profile: null };
    case CLEAR_PROFILE:
      return { ...state, profile: null, viewedProfile: null, loading: false };
    default:
      return state;
  }
}
