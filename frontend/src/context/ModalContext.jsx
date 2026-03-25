import { createContext, useContext, useState } from 'react';
import TaskModal from '../components/tasks/TaskModal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const openTaskModal = (task = null) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openTaskModal, closeTaskModal }}>
      {children}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={closeTaskModal} 
        task={editingTask} 
      />
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModals must be used within a ModalProvider');
  return context;
};
