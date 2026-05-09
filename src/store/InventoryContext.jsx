import { createContext, useState, useContext, useEffect } from 'react';
import { inventoryApi } from '../services/inventoryApi';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Отримання списку з сервера
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await inventoryApi.getAll();
      setInventory(response.data);
      setError(null);
    } catch (err) {
      setError("Не вдалося завантажити дані з сервера.");
    } finally {
      setLoading(false);
    }
  };

  // Видалення товару
  const deleteItem = async (id) => {
    try {
      await inventoryApi.delete(id);
      setInventory(prev => prev.filter(item => item.id !== id));
      // Також видаляємо з улюблених, якщо він там був
      setFavorites(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Помилка при видаленні" };
    }
  };

  // Робота з улюбленими (локально)
  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const isExist = prev.find(fav => fav.id === item.id);
      if (isExist) {
        return prev.filter(fav => fav.id !== item.id);
      }
      return [...prev, item];
    });
  };

  // Завантажуємо дані при першому запуску додатка
  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <InventoryContext.Provider value={{ 
      inventory, 
      favorites, 
      loading, 
      error, 
      fetchInventory, 
      deleteItem, 
      toggleFavorite,
      setInventory 
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);