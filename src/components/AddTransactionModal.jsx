import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { X, Plus } from 'lucide-react';

export default function AddTransactionModal({ isOpen, onClose, categories }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    owner: 'artur', // По умолчанию Артур
    date: new Date().toISOString().split('T')[0]
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);

      let categoryToUse = formData.category;

      // Если нужно создать новую категорию
      if (newCategory.trim() && showNewCategory) {
        await addDoc(collection(db, 'categories'), {
          name: newCategory.trim(),
          userId: currentUser.uid,
          createdAt: new Date()
        });
        categoryToUse = newCategory.trim();
      }

      // Добавление транзакции
      await addDoc(collection(db, 'transactions'), {
        ...formData,
        category: categoryToUse,
        amount: parseFloat(formData.amount),
        userId: currentUser.uid,
        createdAt: new Date(),
        date: new Date(formData.date)
      });

      // Сброс формы
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setNewCategory('');
      setShowNewCategory(false);
      onClose();
    } catch (error) {
      console.error('Ошибка при добавлении транзакции:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Фильтрация категорий по типу
  const filteredCategories = categories.filter(cat => {
    if (formData.type === 'income') {
      return ['Зарплата', 'Подработка', 'Инвестиции', 'Другое'].includes(cat.name);
    } else {
      return !['Зарплата', 'Подработка', 'Инвестиции'].includes(cat.name);
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Добавить операцию
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Тип операции */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип операции
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'expense', category: ''})}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.type === 'expense'
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Расход
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'income', category: ''})}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.type === 'income'
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Доход
              </button>
            </div>
          </div>

          {/* Владелец */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Владелец
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, owner: 'artur'})}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.owner === 'artur'
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Артур
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, owner: 'valeria'})}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.owner === 'valeria'
                    ? 'border-purple-300 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Валерия
              </button>
            </div>
          </div>

          {/* Сумма */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Сумма (₽)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="input-field"
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          {/* Категория */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            {!showNewCategory ? (
              <div className="space-y-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {filteredCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus size={16} />
                  Создать новую категорию
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="input-field"
                  placeholder="Название новой категории"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategory('');
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание (необязательно)
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Комментарий к операции"
            />
          </div>

          {/* Дата */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                'Добавить'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}