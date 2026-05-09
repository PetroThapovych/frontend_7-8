import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/inventory/Navbar';
import InventoryGallery from './pages/InventoryGallery';
import AdminInventory from './pages/AdminInventory';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<InventoryGallery />} />
          <Route path="/admin" element={<AdminInventory />} />
          <Route path="/favorites" element={<div style={{padding: '20px'}}><h1>⭐ Ваші улюблені товари</h1></div>} />
          {/* Сторінка 404 - якщо маршрут не знайдено */}
          <Route path="*" element={<h1>404: Сторінку не знайдено</h1>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;