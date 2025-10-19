import { Routes, Route } from 'react-router-dom';
import ContactsUpload from './pages/ContactsUpload';
import ContactJobStatus from './pages/ContactJobStatus';
import ContactsLists from './pages/ContactsLists';
import FixMetadataPage from './pages/FixMetadataPage';
import ExclusionList from './pages/ExclusionList';

const ContactsModule = () => {
  return (
    <Routes>
      <Route index element={<ContactsLists />} />
      <Route path="upload" element={<ContactsUpload />} />
      <Route path="jobs/:jobId" element={<ContactJobStatus />} />
      <Route path="fix-metadata" element={<FixMetadataPage />} />
      <Route path="exclusion" element={<ExclusionList />} />
    </Routes>
  );
};

export default ContactsModule;
