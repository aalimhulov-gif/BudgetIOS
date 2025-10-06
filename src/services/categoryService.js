import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

// Создание базовых категорий для нового пользователя
export const createDefaultCategories = async (userId) => {
  console.log('Создаю базовые категории для пользователя:', userId);
  
  const defaultCategories = [
    // Категории доходов
    { name: 'Зарплата', type: 'income', userId },
    { name: 'Подработка', type: 'income', userId },
    { name: 'Инвестиции', type: 'income', userId },
    
    // Категории расходов
    { name: 'Продукты', type: 'expense', userId },
    { name: 'Транспорт', type: 'expense', userId },
    { name: 'Развлечения', type: 'expense', userId },
    { name: 'Здоровье', type: 'expense', userId },
    { name: 'Образование', type: 'expense', userId },
    { name: 'Одежда', type: 'expense', userId },
    { name: 'Коммунальные услуги', type: 'expense', userId },
    { name: 'Другое', type: 'expense', userId }
  ];

  try {
    // Проверяем, есть ли уже категории у пользователя
    const existingCategories = await getDocs(
      query(collection(db, 'categories'), where('userId', '==', userId))
    );

    console.log('Существующие категории:', existingCategories.size);

    if (existingCategories.empty) {
      console.log('Создаю базовые категории...');
      // Добавляем категории по умолчанию
      const promises = defaultCategories.map(category =>
        addDoc(collection(db, 'categories'), {
          ...category,
          createdAt: new Date()
        })
      );
      
      await Promise.all(promises);
      console.log('Базовые категории созданы успешно!');
    } else {
      console.log('Категории уже существуют');
    }
  } catch (error) {
    console.error('Ошибка при создании базовых категорий:', error);
  }
};