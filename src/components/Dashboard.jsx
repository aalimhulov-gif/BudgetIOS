import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  LogOut, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  User,
  CreditCard,
  PieChart,
  Target,
  Settings
} from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';
import TransactionList from './TransactionList';
import { testFirebaseConnection } from '../services/firebaseTest';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Подписка на транзакции в реальном времени
  useEffect(() => {
    if (!currentUser) {
      console.log('❌ Dashboard: Пользователь не авторизован');
      return;
    }

    console.log('🔄 Dashboard: Подписываюсь на транзакции для пользователя:', currentUser.uid);
    
    // Запускаем тест Firebase подключения
    testFirebaseConnection();

    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
      console.log('📊 Dashboard: Получены транзакции, количество:', snapshot.size);
      const transactionsList = [];
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        console.log('📝 Dashboard: Транзакция:', data);
        transactionsList.push(data);
      });
      setTransactions(transactionsList);
      setLoading(false);
    }, (error) => {
      console.error('❌ Dashboard: Ошибка получения транзакций:', error);
      console.error('❌ Dashboard: Код ошибки:', error.code);
      console.error('❌ Dashboard: Сообщение:', error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Подписка на категории в реальном времени
  useEffect(() => {
    if (!currentUser) {
      console.log('❌ Dashboard: Пользователь не авторизован для категорий');
      return;
    }

    console.log('🏷️ Dashboard: Подписываюсь на категории для пользователя:', currentUser.uid);

    const categoriesQuery = query(
      collection(db, 'categories'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
      console.log('📋 Dashboard: Получены категории, количество:', snapshot.size);
      const categoriesList = [];
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        console.log('🏷️ Dashboard: Категория:', data);
        categoriesList.push(data);
      });
      setCategories(categoriesList);
    }, (error) => {
      console.error('❌ Dashboard: Ошибка получения категорий:', error);
      console.error('❌ Dashboard: Код ошибки:', error.code);
      console.error('❌ Dashboard: Сообщение:', error.message);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Вычисление балансов для Артур и Валерия
  const arturTransactions = transactions.filter(t => t.owner === 'artur' || (!t.owner && t.type));
  const valeriaTransactions = transactions.filter(t => t.owner === 'valeria');

  const arturIncome = arturTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const arturExpenses = arturTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const arturBalance = arturIncome - arturExpenses;

  const valeriaIncome = valeriaTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const valeriaExpenses = valeriaTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const valeriaBalance = valeriaIncome - valeriaExpenses;

  const totalBalance = arturBalance + valeriaBalance;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const addSampleData = async () => {
    try {
      // Сначала создаем категории, если их нет
      if (categories.length === 0) {
        const { createDefaultCategories } = await import('../services/categoryService');
        await createDefaultCategories(currentUser.uid);
      }

      const sampleTransactions = [
        { type: 'income', amount: 80000, category: 'Зарплата', description: 'Зарплата Артур', owner: 'artur', date: new Date() },
        { type: 'income', amount: 60000, category: 'Зарплата', description: 'Зарплата Валерия', owner: 'valeria', date: new Date() },
        { type: 'expense', amount: 15000, category: 'Продукты', description: 'Покупки в Перекрестке', owner: 'artur', date: new Date() },
        { type: 'expense', amount: 8000, category: 'Развлечения', description: 'Кино и ресторан', owner: 'valeria', date: new Date() },
        { type: 'expense', amount: 25000, category: 'Коммунальные услуги', description: 'Квартплата', owner: 'artur', date: new Date() }
      ];
      
      for (const transaction of sampleTransactions) {
        await addDoc(collection(db, 'transactions'), {
          ...transaction,
          userId: currentUser.uid,
          createdAt: new Date()
        });
      }
      
      alert('Примеры данных успешно добавлены!');
    } catch (error) {
      console.error('Ошибка при добавлении примеров:', error);
      alert('Ошибка при добавлении примеров. Попробуйте еще раз.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-lg font-bold">₽</span>
              </div>
              <h1 className="text-2xl font-bold text-white">BudgetIOS</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                {currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Personal Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Артур */}
          <div className="profile-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Артур</h3>
                  <p className="text-sm text-gray-300">{arturTransactions.length} операций</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-400">Доходы:</span>
                <span className="font-semibold text-green-400">{arturIncome.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400">Расходы:</span>
                <span className="font-semibold text-red-400">{arturExpenses.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="border-t border-white/20 pt-2">
                <div className="flex justify-between">
                  <span className="text-white font-medium">Баланс:</span>
                  <span className={`font-bold text-xl ${arturBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {arturBalance.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Валерия */}
          <div className="profile-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Валерия</h3>
                  <p className="text-sm text-gray-300">{valeriaTransactions.length} операций</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-400">Доходы:</span>
                <span className="font-semibold text-green-400">{valeriaIncome.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400">Расходы:</span>
                <span className="font-semibold text-red-400">{valeriaExpenses.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="border-t border-white/20 pt-2">
                <div className="flex justify-between">
                  <span className="text-white font-medium">Баланс:</span>
                  <span className={`font-bold text-xl ${valeriaBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {valeriaBalance.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Общий баланс */}
          <div className="profile-card bg-gradient-to-r from-yellow-500/20 to-orange-600/20 border-yellow-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mr-3">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Семейный</h3>
                  <p className="text-sm text-gray-300">Общий баланс</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalBalance.toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-gray-300 text-sm mt-1">
                {transactions.length} всего операций
              </p>
            </div>
          </div>
        </div>

        {/* Инструкции для пользователя */}
        {transactions.length === 0 && (
          <div className="card mb-8 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500/30">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">🚀 Начните использовать BudgetIOS</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p><strong>1. Создать категории</strong> - добавит основные категории доходов и расходов</p>
                <p><strong>2. Тестовые данные</strong> - добавит примеры операций для Артур и Валерия</p>
                <p><strong>3. Добавить операцию</strong> - создать новую операцию (доход или расход)</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Добавить операцию
          </button>
          
          <button
            onClick={async () => {
              try {
                const { createDefaultCategories } = await import('../services/categoryService');
                await createDefaultCategories(currentUser.uid);
                alert('Категории созданы! Теперь можете добавлять операции.');
              } catch (error) {
                console.error('Ошибка при создании категорий:', error);
                alert('Ошибка создания категорий: ' + error.message);
              }
            }}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Settings size={20} />
            Создать категории
          </button>
          
          <button
            onClick={addSampleData}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <PieChart size={20} />
            Добавить примеры
          </button>
        </div>

        {/* Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CreditCard size={24} />
              Последние операции
            </h2>
          </div>
          
          <TransactionList 
            transactions={transactions}
          />
        </div>
      </main>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          categories={categories}
        />
      )}
    </div>
  );
}