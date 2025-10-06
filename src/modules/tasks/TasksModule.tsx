import { Routes, Route } from 'react-router-dom';
import TaskGenerator from './pages/TaskGenerator';
import TaskInbox from './pages/TaskInbox';

const TasksModule = () => {
  return (
    <Routes>
      <Route index element={<TaskInbox />} />
      <Route path="generator" element={<TaskGenerator />} />
    </Routes>
  );
};

export default TasksModule;
