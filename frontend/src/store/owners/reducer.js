import {
  FETCH_OWNERS_SUCCESS,
  ADD_OWNER_SUCCESS,
  UPDATE_OWNER_SUCCESS,
  DELETE_OWNER_SUCCESS,
} from './actions';

const initialState = {
  owners: [],
};

const ownersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_OWNERS_SUCCESS:
      return {
        ...state,
        owners: action.payload,
      };
    case ADD_OWNER_SUCCESS:
      return {
        ...state,
        owners: [...state.owners, action.payload],
      };
    case UPDATE_OWNER_SUCCESS:
      return {
        ...state,
        owners: state.owners.map((owner) =>
          owner.id === action.payload.id ? action.payload : owner
        ),
      };
    case DELETE_OWNER_SUCCESS:
      return {
        ...state,
        owners: state.owners.filter((owner) => owner.id !== action.payload),
      };
    default:
      return state;
  }
};

export default ownersReducer;