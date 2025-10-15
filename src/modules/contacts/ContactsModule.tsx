import { Routes, Route } from 'react-router-dom';
import ContactsUpload from './pages/ContactsUpload';
import ContactJobStatus from './pages/ContactJobStatus';

const ContactsModule = () => {
  return (
    <Routes>
      <Route index element={<ContactsUpload />} />
      <Route path="jobs/:jobId" element={<ContactJobStatus />} />
    </Routes>
  );
};

export default ContactsModule;
