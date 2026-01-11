import { listDocuments, uploadDocument, deleteDocument } from '../../api/documents.api';

export const FETCH_DOCUMENTS_SUCCESS = 'FETCH_DOCUMENTS_SUCCESS';
export const ADD_DOCUMENT_SUCCESS = 'ADD_DOCUMENT_SUCCESS';
export const DELETE_DOCUMENT_SUCCESS = 'DELETE_DOCUMENT_SUCCESS';

export const fetchDocumentsSuccess = (documents) => ({
  type: FETCH_DOCUMENTS_SUCCESS,
  payload: documents,
});

export const addDocumentSuccess = (document) => ({
  type: ADD_DOCUMENT_SUCCESS,
  payload: document,
});

export const deleteDocumentSuccess = (id) => ({
  type: DELETE_DOCUMENT_SUCCESS,
  payload: id,
});

export const fetchDocuments = () => async (dispatch) => {
  try {
    const res = await listDocuments();
    dispatch(fetchDocumentsSuccess(res.data));
  } catch (error) {
    console.error(error);
  }
};

export const createDocument = (document) => async (dispatch) => {
  try {
    // document doit contenir consultation_id, title, file
    const newDocument = await uploadDocument(document.consultation_id, document);
    dispatch(addDocumentSuccess(newDocument));
  } catch (error) {
    console.error(error);
  }
};

export const removeDocument = (id) => async (dispatch) => {
  try {
    await deleteDocument(id);
    dispatch(deleteDocumentSuccess(id));
  } catch (error) {
    console.error(error);
  }
};