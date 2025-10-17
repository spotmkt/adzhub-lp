import { Routes, Route } from 'react-router-dom';
import TaskGenerator from './pages/TaskGenerator';
import TaskInbox from './pages/TaskInbox';
import TaskHistory from './pages/TaskHistory';

const TasksModule = () => {
  return (
    <Routes>
      <Route index element={<TaskInbox />} />
      <Route path="generator" element={<TaskGenerator />} />
      <Route path="history" element={<TaskHistory />} />
    </Routes>
  );
};

export default TasksModule;
