import { createContext, useContext, useReducer } from 'react';
import api from '../api/axios';

const CategoryContext = createContext();

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categoryReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_START':
      return { ...state, loading: true };
    case 'FETCH_CATEGORIES_SUCCESS':
      return { ...state, loading: false, categories: action.payload };
    case 'FETCH_CATEGORIES_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
      };
    default:
      return state;
  }
};

export const CategoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  const fetchCategories = async () => {
    dispatch({ type: 'FETCH_CATEGORIES_START' });
    try {
      const res = await api.get('/categories');
      const data = res.data.data || res.data;
      dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: Array.isArray(data) ? data : [] });
    } catch (err) {
      dispatch({ type: 'FETCH_CATEGORIES_FAILURE', payload: err.message });
    }
  };

  const createCategory = async (categoryData) => {
    const res = await api.post('/categories', categoryData);
    const data = res.data.data || res.data;
    dispatch({ type: 'ADD_CATEGORY', payload: data });
    return data;
  };

  const updateCategory = async (id, categoryData) => {
    const res = await api.put(`/categories/${id}`, categoryData);
    const data = res.data.data || res.data;
    dispatch({ type: 'UPDATE_CATEGORY', payload: data });
    return data;
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  return (
    <CategoryContext.Provider value={{ ...state, fetchCategories, createCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategories must be used within a CategoryProvider');
  return context;
};
