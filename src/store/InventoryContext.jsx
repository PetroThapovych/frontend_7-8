import { createContext, useState, useContext, useEffect } from 'react';
import { inventoryApi } from '../services/inventoryApi';

const InventoryContext = createContext();

const mockInventory = [
  {
    id: 1,
    inventory_name: 'Ноутбук Dell',
    description: 'Потужний ноутбук для роботи',
    photo: 'https://via.placeholder.com/200x150?text=Dell+Laptop'
  },
  {
    id: 2,
    inventory_name: 'Миша Logitech',
    description: 'Бездротова миша',
    photo: 'https://via.placeholder.com/200x150?text=Logitech+Mouse'
  },
  {
    id: 3,
    inventory_name: 'Клавіатура',
    description: 'Механічна клавіатура',
    photo: 'https://via.placeholder.com/200x150?text=Keyboard'
  }
];

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState(mockInventory); // Початкові дані
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
  const fetchInventory = async () => {
    setLoading(true);
    try {
 
      const response = await inventoryApi.getAll();
      setInventory(response.data);
      setError(null);
    } catch (err) {
      console.warn('API недоступний, використовуємо mock дані:', err.message);
      setInventory(mockInventory);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await inventoryApi.delete(id);
      setInventory(prev => prev.filter(item => item.id !== id));
   
      setFavorites(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Помилка при видаленні" };
    }
  };

 
  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const isExist = prev.find(fav => fav.id === item.id);
      if (isExist) {
        return prev.filter(fav => fav.id !== item.id);
      }
      return [...prev, item];
    });
  };

 

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
