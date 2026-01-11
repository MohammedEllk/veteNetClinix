import { listAnimals, createAnimal, updateAnimal, deleteAnimal } from '../../api/animals.api';

export const FETCH_ANIMALS_SUCCESS = 'FETCH_ANIMALS_SUCCESS';
export const ADD_ANIMAL_SUCCESS = 'ADD_ANIMAL_SUCCESS';
export const UPDATE_ANIMAL_SUCCESS = 'UPDATE_ANIMAL_SUCCESS';
export const DELETE_ANIMAL_SUCCESS = 'DELETE_ANIMAL_SUCCESS';

export const fetchAnimalsSuccess = (animals) => ({
  type: FETCH_ANIMALS_SUCCESS,
  payload: animals,
});

export const addAnimalSuccess = (animal) => ({
  type: ADD_ANIMAL_SUCCESS,
  payload: animal,
});

export const updateAnimalSuccess = (animal) => ({
  type: UPDATE_ANIMAL_SUCCESS,
  payload: animal,
});

export const deleteAnimalSuccess = (id) => ({
  type: DELETE_ANIMAL_SUCCESS,
  payload: id,
});

export const fetchAnimals = () => async (dispatch) => {
  try {
    const res = await listAnimals();
    dispatch(fetchAnimalsSuccess(res.data));
  } catch (error) {
    console.error(error);
  }
};

export const createAnimalThunk = (animal) => async (dispatch) => {
  try {
    const newAnimal = await createAnimal(animal);
    dispatch(addAnimalSuccess(newAnimal));
  } catch (error) {
    console.error(error);
  }
};

export const editAnimal = (id, animal) => async (dispatch) => {
  try {
    const updatedAnimal = await updateAnimal(id, animal);
    dispatch(updateAnimalSuccess(updatedAnimal));
  } catch (error) {
    console.error(error);
  }
};

export const removeAnimal = (id) => async (dispatch) => {
  try {
    await deleteAnimal(id);
    dispatch(deleteAnimalSuccess(id));
  } catch (error) {
    console.error(error);
  }
};