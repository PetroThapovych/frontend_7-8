import { useInventory } from '../store/InventoryContext';

export default function InventoryGallery() {
  const { inventory, favorites, toggleFavorite } = useInventory();

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'var(--primary)', textShadow: '0 0 30px rgba(0, 217, 255, 0.3)' }}>Галерея інвентарю</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', textAlign: 'center' }}>Розповідь: {inventory.length}</p>
      <div className="gallery-grid">
        {inventory.map(item => {
          const isFav = favorites.some(fav => fav.id === item.id);
          return (
            <div key={item.id} className="card">
              <img src={item.photo} alt={item.inventory_name} />
              <h3 style={{ color: 'var(--primary)' }}>{item.inventory_name}</h3>
              <p>{item.description}</p>
              <button 
                onClick={() => toggleFavorite(item)}
                className={isFav ? 'btn btn-danger' : 'btn btn-primary'}
              >
                {isFav ? 'У улюблених' : 'Додати в улюблені'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
