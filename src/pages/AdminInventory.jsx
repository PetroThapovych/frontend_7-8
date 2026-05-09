import { useEffect } from 'react';
import { useInventory } from '../store/InventoryContext';
import { inventoryApi } from '../services/inventoryApi';
import { Link } from 'react-router-dom';

export default function AdminInventory() {
  const { inventory, setInventory } = useInventory();

  useEffect(() => {
    inventoryApi.getAll().then(res => setInventory(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Видалити?")) {
      await inventoryApi.delete(id);
      setInventory(inventory.filter(i => i.id !== id));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Адмін-панель</h1>
      <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Прев'ю</th>
            <th>Назва</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td><img src={item.photo} width="50" alt="" /></td>
              <td>{item.inventory_name}</td>
              <td>
                <Link to={`/admin/edit/${item.id}`}>📝 Редагувати</Link>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '10px', color: 'red' }}>🗑️ Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}