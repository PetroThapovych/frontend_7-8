import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/inventory/Navbar';
import InventoryGallery from './pages/InventoryGallery';
import AdminInventory from './pages/AdminInventory';
import AdminInventoryCreate from './pages/AdminInventoryCreate';


function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 15px' }}>
        <Routes>
          {/* Користувацька частина */}
          <Route path="/" element={<InventoryGallery />} />
          <Route path="/favorites" element={<div><h1>⭐ Ваші улюблені</h1></div>} />
          
          {/* Адміністративна частина */}
          <Route path="/admin" element={<AdminInventory />} />
          <Route path="/admin/create" element={<AdminInventoryCreate />} />
          {/* :id — це динамічний параметр для редагування конкретного товару */}
          <Route path="/admin/edit/:id" element={<div><h1>Редагування (В розробці)</h1></div>} />
          
          <Route path="*" element={<h1>404: Сторінку не знайдено</h1>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;