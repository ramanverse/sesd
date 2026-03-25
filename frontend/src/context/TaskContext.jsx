import { createContext, useContext, useReducer } from 'react';
import api from '../api/axios';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  archivedTasks: [],
  loading: false,
  error: null,
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_TASKS_START':
      return { ...state, loading: true };
    case 'FETCH_TASKS_SUCCESS':
      return { ...state, loading: false, tasks: action.payload };
    case 'FETCH_ARCHIVED_SUCCESS':
      return { ...state, loading: false, archivedTasks: action.payload };
    case 'FETCH_TASKS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
        archivedTasks: state.archivedTasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        archivedTasks: state.archivedTasks.filter((t) => t.id !== action.payload),
      };
    case 'ARCHIVE_TASK_SUCCESS':
      // If archived, move from tasks to archivedTasks. If restored, vice versa.
      if (action.payload.isArchived) {
        return {
          ...state,
          tasks: state.tasks.filter(t => t.id !== action.payload.id),
          archivedTasks: [action.payload, ...state.archivedTasks]
        };
      } else {
        return {
          ...state,
          archivedTasks: state.archivedTasks.filter(t => t.id !== action.payload.id),
          tasks: [action.payload, ...state.tasks]
        };
      }
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = async (query = {}) => {
    dispatch({ type: 'FETCH_TASKS_START' });
    try {
      const res = await api.get('/tasks', { params: query });
      const data = res.data.data || res.data;
      dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: Array.isArray(data) ? data : [] });
    } catch (err) {
      dispatch({ type: 'FETCH_TASKS_FAILURE', payload: err.message });
    }
  };

  const fetchArchivedTasks = async () => {
    dispatch({ type: 'FETCH_TASKS_START' });
    try {
      const res = await api.get('/tasks/archived');
      const data = res.data.data || res.data;
      dispatch({ type: 'FETCH_ARCHIVED_SUCCESS', payload: Array.isArray(data) ? data : [] });
    } catch (err) {
      dispatch({ type: 'FETCH_TASKS_FAILURE', payload: err.message });
    }
  };

  const createTask = async (taskData) => {
    const res = await api.post('/tasks', taskData);
    const data = res.data.data || res.data;
    dispatch({ type: 'ADD_TASK', payload: data });
    return data;
  };

  const updateTask = async (id, taskData) => {
    const res = await api.put(`/tasks/${id}`, taskData);
    const data = res.data.data || res.data;
    dispatch({ type: 'UPDATE_TASK', payload: data });
    return data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const cycleStatus = async (id) => {
    const res = await api.patch(`/tasks/${id}/status`);
    const data = res.data.data || res.data;
    dispatch({ type: 'UPDATE_TASK', payload: data });
    return data;
  };

  const archiveTask = async (id, isArchived = true) => {
    const res = await api.patch(`/tasks/${id}/archive`, { isArchived });
    const data = res.data.data || res.data;
    dispatch({ type: 'ARCHIVE_TASK_SUCCESS', payload: data });
    return data;
  };

  return (
    <TaskContext.Provider value={{ 
      ...state, 
      fetchTasks, 
      fetchArchivedTasks, 
      createTask, 
      updateTask, 
      deleteTask, 
      cycleStatus,
      archiveTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};
