import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

// Создание базовых категорий для нового пользователя
export const createDefaultCategories = async (userId) => {
  console.log('🏷️ Создаю базовые категории для пользователя:', userId);
  
  if (!userId) {
    throw new Error('userId не предоставлен');
  }
  
  const defaultCategories = [
    // Категории доходов
    { name: 'Зарплата', type: 'income', userId },
    { name: 'Подработка', type: 'income', userId },
    { name: 'Инвестиции', type: 'income', userId },
    { name: 'Другое', type: 'income', userId },
    
    // Категории расходов
    { name: 'Продукты', type: 'expense', userId },
    { name: 'Транспорт', type: 'expense', userId },
    { name: 'Развлечения', type: 'expense', userId },
    { name: 'Здоровье', type: 'expense', userId },
    { name: 'Образование', type: 'expense', userId },
    { name: 'Одежда', type: 'expense', userId },
    { name: 'Коммунальные услуги', type: 'expense', userId },
    { name: 'Кафе и рестораны', type: 'expense', userId },
    { name: 'Другое', type: 'expense', userId }
  ];

  try {
    // Проверяем, есть ли уже категории у пользователя
    const existingCategories = await getDocs(
      query(collection(db, 'categories'), where('userId', '==', userId))
    );

    console.log('📊 Найдено существующих категорий:', existingCategories.size);

    if (existingCategories.empty) {
      console.log('➕ Создаю базовые категории...');
      
      // Добавляем категории по одной для лучшего отслеживания ошибок
      for (let i = 0; i < defaultCategories.length; i++) {
        const category = defaultCategories[i];
        console.log(`📝 Создаю категорию ${i + 1}/${defaultCategories.length}: ${category.name}`);
        
        await addDoc(collection(db, 'categories'), {
          ...category,
          createdAt: new Date()
        });
      }
      
      console.log('✅ Все базовые категории созданы успешно!');
      return `Создано ${defaultCategories.length} категорий`;
    } else {
      console.log('ℹ️ Категории уже существуют, пропускаю создание');
      return 'Категории уже существуют';
    }
  } catch (error) {
    console.error('❌ Ошибка при создании базовых категорий:', error);
    console.error('❌ Код ошибки:', error.code);
    console.error('❌ Сообщение:', error.message);
    throw error;
  }
};