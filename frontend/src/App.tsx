
import BookPage from './pages/BookPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DonatePage from './pages/DonatePage';
import CartPage from './pages/CartPage';
import AdminBooksPage from './pages/AdminBooksPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookPage />} />
        <Route path="/donate/:bookTitle/:bookId" element={<DonatePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin-books" element={<AdminBooksPage />} />
      </Routes>
    </BrowserRouter>
    </CartProvider>
  )
}
export default App;
