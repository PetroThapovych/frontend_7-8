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
    <div className="admin-panel">
      <h1>Адмін-панель</h1>
      <Link to="/admin/create" className="btn btn-primary" style={{ marginBottom: '2rem', display: 'inline-block', marginLeft: 'auto', marginRight: 'auto', display: 'block', width: 'fit-content' }}>
        Додати новий товар
      </Link>
      <table>
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
              <td><img src={item.photo} width="50" alt="" style={{ borderRadius: '8px' }} /></td>
              <td>{item.inventory_name}</td>
              <td>
                <Link to={`/admin/edit/${item.id}`} className="btn btn-primary" style={{ marginRight: '10px' }}>
                  Редагувати
                </Link>
                <button onClick={() => handleDelete(item.id)} className="btn btn-danger">
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
