import * as constants from './constants';
import initialState from './initialState';

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case constants.APPLICATION_LOGIN_TO_VK: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case constants.APPLICATION_LOGIN_TO_VK_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        userData: payload,
      };
    }
    case constants.GET_GENRES: {
      return {
        ...state,
        genres: payload,
      };
    }
    case constants.CHANGE_LANGUAGE: {
      return {
        ...state,
        language: payload,
      };
    }
    default: {
      return state;
    }
  }
}
