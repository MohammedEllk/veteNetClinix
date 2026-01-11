import {
  FETCH_ANIMALS_SUCCESS,
  ADD_ANIMAL_SUCCESS,
  UPDATE_ANIMAL_SUCCESS,
  DELETE_ANIMAL_SUCCESS,
} from './actions';

const initialState = {
  animals: [],
};

const animalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ANIMALS_SUCCESS:
      return {
        ...state,
        animals: action.payload,
      };
    case ADD_ANIMAL_SUCCESS:
      return {
        ...state,
        animals: [...state.animals, action.payload],
      };
    case UPDATE_ANIMAL_SUCCESS:
      return {
        ...state,
        animals: state.animals.map((animal) =>
          animal.id === action.payload.id ? action.payload : animal
        ),
      };
    case DELETE_ANIMAL_SUCCESS:
      return {
        ...state,
        animals: state.animals.filter((animal) => animal.id !== action.payload),
      };
    default:
      return state;
  }
};

export default animalsReducer;