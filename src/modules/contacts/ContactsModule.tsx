import { Routes, Route } from 'react-router-dom';
import ContactsUpload from './pages/ContactsUpload';

const ContactsModule = () => {
  return (
    <Routes>
      <Route index element={<ContactsUpload />} />
    </Routes>
  );
};

export default ContactsModule;
