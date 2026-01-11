import { listOwners, createOwner, updateOwner, deleteOwner } from '../../api/owners.api';

export const FETCH_OWNERS_SUCCESS = 'FETCH_OWNERS_SUCCESS';
export const ADD_OWNER_SUCCESS = 'ADD_OWNER_SUCCESS';
export const UPDATE_OWNER_SUCCESS = 'UPDATE_OWNER_SUCCESS';
export const DELETE_OWNER_SUCCESS = 'DELETE_OWNER_SUCCESS';

export const fetchOwnersSuccess = (owners) => ({
  type: FETCH_OWNERS_SUCCESS,
  payload: owners,
});

export const addOwnerSuccess = (owner) => ({
  type: ADD_OWNER_SUCCESS,
  payload: owner,
});

export const updateOwnerSuccess = (owner) => ({
  type: UPDATE_OWNER_SUCCESS,
  payload: owner,
});

export const deleteOwnerSuccess = (id) => ({
  type: DELETE_OWNER_SUCCESS,
  payload: id,
});

export const fetchOwners = () => async (dispatch) => {
  try {
    const res = await listOwners();
    dispatch(fetchOwnersSuccess(res.data));
  } catch (error) {
    console.error(error);
  }
};

export const createOwnerThunk = (owner) => async (dispatch) => {
  try {
    const newOwner = await createOwner(owner);
    dispatch(addOwnerSuccess(newOwner));
  } catch (error) {
    console.error(error);
  }
};

export const editOwner = (id, owner) => async (dispatch) => {
  try {
    const updatedOwner = await updateOwner(id, owner);
    dispatch(updateOwnerSuccess(updatedOwner));
  } catch (error) {
    console.error(error);
  }
};

export const removeOwner = (id) => async (dispatch) => {
  try {
    await deleteOwner(id);
    dispatch(deleteOwnerSuccess(id));
  } catch (error) {
    console.error(error);
  }
};