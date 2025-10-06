import { Routes, Route } from 'react-router-dom';
import TaskGenerator from './pages/TaskGenerator';

const TasksModule = () => {
  return (
    <Routes>
      <Route index element={<TaskGenerator />} />
    </Routes>
  );
};

export default TasksModule;
