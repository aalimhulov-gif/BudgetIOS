import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Trash2, Calendar } from 'lucide-react';

export default function TransactionList({ transactions }) {
  
  const handleDelete = async (transactionId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      try {
        await deleteDoc(doc(db, 'transactions', transactionId));
      } catch (error) {
        console.error('Ошибка при удалении транзакции:', error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date.seconds * 1000).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">Пока нет операций</p>
        <p className="text-sm">Добавьте первую операцию, чтобы начать отслеживать бюджет</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.category}
                  </p>
                  {transaction.description && (
                    <p className="text-sm text-gray-600">
                      {transaction.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {transaction.amount.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => handleDelete(transaction.id)}
            className="ml-4 p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}