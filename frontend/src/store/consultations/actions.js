import { listConsultations, createConsultation, updateConsultation, deleteConsultation } from '../../api/consultations.api';

export const FETCH_CONSULTATIONS_SUCCESS = 'FETCH_CONSULTATIONS_SUCCESS';
export const ADD_CONSULTATION_SUCCESS = 'ADD_CONSULTATION_SUCCESS';
export const UPDATE_CONSULTATION_SUCCESS = 'UPDATE_CONSULTATION_SUCCESS';
export const DELETE_CONSULTATION_SUCCESS = 'DELETE_CONSULTATION_SUCCESS';

export const fetchConsultationsSuccess = (consultations) => ({
  type: FETCH_CONSULTATIONS_SUCCESS,
  payload: consultations,
});

export const addConsultationSuccess = (consultation) => ({
  type: ADD_CONSULTATION_SUCCESS,
  payload: consultation,
});

export const updateConsultationSuccess = (consultation) => ({
  type: UPDATE_CONSULTATION_SUCCESS,
  payload: consultation,
});

export const deleteConsultationSuccess = (id) => ({
  type: DELETE_CONSULTATION_SUCCESS,
  payload: id,
});

export const fetchConsultations = () => async (dispatch) => {
  try {
    const res = await listConsultations();
    dispatch(fetchConsultationsSuccess(res.data));
  } catch (error) {
    console.error(error);
  }
};

export const createConsultationThunk = (consultation) => async (dispatch) => {
  try {
    const newConsultation = await createConsultation(consultation);
    dispatch(addConsultationSuccess(newConsultation));
  } catch (error) {
    console.error(error);
  }
};

export const editConsultation = (id, consultation) => async (dispatch) => {
  try {
    const updatedConsultation = await updateConsultation(id, consultation);
    dispatch(updateConsultationSuccess(updatedConsultation));
  } catch (error) {
    console.error(error);
  }
};

export const removeConsultation = (id) => async (dispatch) => {
  try {
    await deleteConsultation(id);
    dispatch(deleteConsultationSuccess(id));
  } catch (error) {
    console.error(error);
  }
};