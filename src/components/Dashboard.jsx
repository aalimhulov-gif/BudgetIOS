import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  LogOut, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Settings
} from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';
import TransactionList from './TransactionList';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Подписка на транзакции в реальном времени
  useEffect(() => {
    if (!currentUser) return;

    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
      const transactionsList = [];
      snapshot.forEach((doc) => {
        transactionsList.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsList);
      setLoading(false); // Загрузка завершена даже если транзакций нет
    }, (error) => {
      console.error('Ошибка получения транзакций:', error);
      setLoading(false); // Завершаем загрузку даже при ошибке
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Подписка на категории в реальном времени
  useEffect(() => {
    if (!currentUser) return;

    const categoriesQuery = query(
      collection(db, 'categories'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
      const categoriesList = [];
      snapshot.forEach((doc) => {
        categoriesList.push({ id: doc.id, ...doc.data() });
      });
      setCategories(categoriesList);
    }, (error) => {
      console.error('Ошибка получения категорий:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Вычисление баланса и статистики
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = income - expenses;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">₽</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">BudgetIOS</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Баланс</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {balance.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Доходы</p>
                <p className="text-2xl font-bold text-blue-600">
                  {income.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Расходы</p>
                <p className="text-2xl font-bold text-red-600">
                  {expenses.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Добавить операцию
          </button>
          
          {categories.length === 0 && (
            <button
              onClick={async () => {
                const { createDefaultCategories } = await import('../services/categoryService');
                await createDefaultCategories(currentUser.uid);
              }}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Settings size={20} />
              Создать категории
            </button>
          )}
          
          {transactions.length === 0 && categories.length > 0 && (
            <button
              onClick={async () => {
                const { addDoc, collection } = await import('firebase/firestore');
                const { db } = await import('../firebase');
                
                // Создаем примеры операций
                const sampleTransactions = [
                  { type: 'income', amount: 50000, category: 'Зарплата', description: 'Зарплата за октябрь', date: new Date() },
                  { type: 'expense', amount: 1200, category: 'Продукты', description: 'Покупки в магазине', date: new Date() },
                  { type: 'expense', amount: 800, category: 'Транспорт', description: 'Проезд на автобусе', date: new Date() }
                ];
                
                for (const transaction of sampleTransactions) {
                  await addDoc(collection(db, 'transactions'), {
                    ...transaction,
                    userId: currentUser.uid,
                    createdAt: new Date()
                  });
                }
              }}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              📊 Добавить примеры
            </button>
          )}
        </div>

        {/* Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
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