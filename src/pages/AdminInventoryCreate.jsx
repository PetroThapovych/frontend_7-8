import { useState, useEffect } from 'react';
import { inventoryApi } from '../services/inventoryApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useInventory } from '../store/InventoryContext';

export default function AdminInventoryCreate() {
  const { inventory, setInventory } = useInventory();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit) return;

    const item = inventory.find(item => String(item.id) === String(id));
    if (item) {
      setName(item.inventory_name);
      setDesc(item.description);
      setCurrentPhoto(item.photo);
      return;
    }

    const loadItem = async () => {
      try {
        const response = await inventoryApi.getById(id);
        setName(response.data.inventory_name);
        setDesc(response.data.description);
        setCurrentPhoto(response.data.photo);
      } catch (err) {
        console.error(err);
        alert('Товар не знайдено');
        navigate('/admin');
      }
    };

    loadItem();
  }, [id, inventory, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("Назва обов'язкова!");

    setLoading(true);

    try {
      if (isEdit) {
        const updatedPhoto = file ? URL.createObjectURL(file) : currentPhoto;

        setInventory(prev => prev.map(item => {
          if (String(item.id) !== String(id)) return item;
          return {
            ...item,
            inventory_name: name,
            description: desc,
            photo: updatedPhoto,
          };
        }));

        try {
          await inventoryApi.updateText(id, {
            inventory_name: name,
            description: desc,
          });

          if (file) {
            const formData = new FormData();
            formData.append('photo', file);
            await inventoryApi.updatePhoto(id, formData);
          }
        } catch (apiErr) {
          console.warn('API недоступний, оновлення здійснюється локально:', apiErr.message);
        }

        navigate('/admin');
        return;
      }

      const formData = new FormData();
      formData.append('inventory_name', name);
      formData.append('description', desc);
      if (file) formData.append('photo', file);

      try {
        const response = await inventoryApi.create(formData);
        const createdItem = response.data;
        if (createdItem && createdItem.id) {
          setInventory(prev => [...prev, createdItem]);
        }
      } catch (apiErr) {
        console.warn('API недоступний, товар додається локально:', apiErr.message);
        const newItem = {
          id: Math.max(...inventory.map(i => i.id), 0) + 1,
          inventory_name: name,
          description: desc,
          photo: file ? URL.createObjectURL(file) : 'https://via.placeholder.com/200x150?text=No+Photo'
        };
        setInventory(prev => [...prev, newItem]);
      }

      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert(isEdit ? "Помилка при оновленні" : "Помилка при створенні");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Редагувати товар' : 'Додати новий товар'}</h2>
      <input 
        type="text" 
        placeholder="Назва*" 
        value={name} 
        onChange={e => setName(e.target.value)} 
        required
      />
      <textarea 
        placeholder="Опис" 
        value={desc} 
        onChange={e => setDesc(e.target.value)} 
      />
      <label className="file-picker">
        <span>{file ? file.name : currentPhoto ? 'Змінити файл' : 'Обрати файл'}</span>
        <input 
          type="file" 
          onChange={e => setFile(e.target.files[0])} 
        />
      </label>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {isEdit ? 'Оновити' : 'Зберегти'}
      </button>
    </form>
  );
}
