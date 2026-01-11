import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './auth/reducer';
import ownersReducer from './owners/reducer';
import animalsReducer from './animals/reducer';
import consultationsReducer from './consultations/reducer';
import documentsReducer from './documents/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  owners: ownersReducer,
  animals: animalsReducer,
  consultations: consultationsReducer,
  documents: documentsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;