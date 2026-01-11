import {
  FETCH_DOCUMENTS_SUCCESS,
  ADD_DOCUMENT_SUCCESS,
  DELETE_DOCUMENT_SUCCESS,
} from './actions';

const initialState = {
  documents: [],
};

const documentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DOCUMENTS_SUCCESS:
      return {
        ...state,
        documents: action.payload,
      };
    case ADD_DOCUMENT_SUCCESS:
      return {
        ...state,
        documents: [...state.documents, action.payload],
      };
    case DELETE_DOCUMENT_SUCCESS:
      return {
        ...state,
        documents: state.documents.filter((document) => document.id !== action.payload),
      };
    default:
      return state;
  }
};

export default documentsReducer;