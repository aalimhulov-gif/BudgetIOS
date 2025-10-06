import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase';
import { createDefaultCategories } from '../services/categoryService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Создаем базовые категории для нового пользователя
    try {
      await createDefaultCategories(result.user.uid);
      console.log('Категории созданы при регистрации');
    } catch (error) {
      console.error('Ошибка создания категорий при регистрации:', error);
    }
    return result;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Если пользователь только что вошел, проверим категории
      if (user) {
        try {
          const { createDefaultCategories } = await import('../services/categoryService');
          await createDefaultCategories(user.uid);
        } catch (error) {
          console.error('Ошибка проверки категорий:', error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}