// Простой тест Firebase подключения
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const testFirebaseConnection = () => {
  console.log('🔥 Тестируем подключение к Firebase...');
  
  // Проверяем Auth
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('✅ Auth работает, пользователь:', user.uid);
      
      // Тестируем Firestore
      testFirestore(user.uid);
    } else {
      console.log('❌ Пользователь не авторизован');
    }
  });
};

const testFirestore = async (userId) => {
  try {
    console.log('📊 Тестируем Firestore...');
    
    const testDoc = {
      test: true,
      userId: userId,
      timestamp: new Date(),
      message: 'Тестовый документ'
    };
    
    const docRef = await addDoc(collection(db, 'test'), testDoc);
    console.log('✅ Firestore работает! ID документа:', docRef.id);
    
  } catch (error) {
    console.error('❌ Ошибка Firestore:', error);
    console.error('Код ошибки:', error.code);
    console.error('Сообщение:', error.message);
  }
};