import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MainLayout from '../../layout/mainLayout';
import { fetchDocuments, createDocument, removeDocument } from '../../store/documents/actions';
import { fetchConsultations } from '../../store/consultations/actions';
import '../../styles/dashboard.css'; // reuse styles

export default function DocumentsPage() {
  const dispatch = useDispatch();
  const { documents } = useSelector((state) => state.documents);
  const { consultations } = useSelector((state) => state.consultations);
  const [newDocument, setNewDocument] = useState({ name: '', type: '', consultationId: '' });

  useEffect(() => {
    dispatch(fetchDocuments());
    dispatch(fetchConsultations());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument({ ...newDocument, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocument({
        ...newDocument,
        name: file.name,
        type: file.type.split('/')[1], // pdf or image type
        data: 'fake-base64-data' // simulate
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDocument.name && newDocument.consultationId) {
      dispatch(createDocument(newDocument));
      setNewDocument({ name: '', type: '', consultationId: '' });
    }
  };

  const handleDelete = (id) => {
    dispatch(removeDocument(id));
  };

  const getConsultationName = (id) => {
    const cons = consultations.find(c => c.id === id);
    return cons ? `Consultation ${cons.id}` : 'Unknown';
  };

  return (
    <MainLayout>
      <div className="documents-page">
        <h2>Documents</h2>

        <div className="upload-form">
          <h3>Upload Document</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              required
            />
            <select
              name="consultationId"
              value={newDocument.consultationId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Consultation</option>
              {consultations.map((cons) => (
                <option key={cons.id} value={cons.id}>
                  Consultation {cons.id} - {cons.date}
                </option>
              ))}
            </select>
            <button type="submit">Upload</button>
          </form>
        </div>

        <div className="documents-list">
          <h3>Documents List</h3>
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                <span>{doc.name} ({doc.type}) - {getConsultationName(doc.consultationId)}</span>
                <button onClick={() => handleDelete(doc.id)}>Delete</button>
                <button onClick={() => alert('Download: ' + doc.data)}>Download</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}