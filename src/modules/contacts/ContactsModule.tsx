import { Routes, Route } from 'react-router-dom';
import ContactsUpload from './pages/ContactsUpload';
import ContactJobStatus from './pages/ContactJobStatus';
import ContactsLists from './pages/ContactsLists';

const ContactsModule = () => {
  return (
    <Routes>
      <Route index element={<ContactsLists />} />
      <Route path="upload" element={<ContactsUpload />} />
      <Route path="jobs/:jobId" element={<ContactJobStatus />} />
    </Routes>
  );
};

export default ContactsModule;
