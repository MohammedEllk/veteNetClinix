import {
  FETCH_CONSULTATIONS_SUCCESS,
  ADD_CONSULTATION_SUCCESS,
  UPDATE_CONSULTATION_SUCCESS,
  DELETE_CONSULTATION_SUCCESS,
} from './actions';

const initialState = {
  consultations: [],
};

const consultationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONSULTATIONS_SUCCESS:
      return {
        ...state,
        consultations: action.payload,
      };
    case ADD_CONSULTATION_SUCCESS:
      return {
        ...state,
        consultations: [...state.consultations, action.payload],
      };
    case UPDATE_CONSULTATION_SUCCESS:
      return {
        ...state,
        consultations: state.consultations.map((consultation) =>
          consultation.id === action.payload.id ? action.payload : consultation
        ),
      };
    case DELETE_CONSULTATION_SUCCESS:
      return {
        ...state,
        consultations: state.consultations.filter((consultation) => consultation.id !== action.payload),
      };
    default:
      return state;
  }
};

export default consultationsReducer;