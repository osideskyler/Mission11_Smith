
import BookPage from './pages/BookPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DonatePage from './pages/DonatePage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookPage />} />
        <Route path="/donate/:bookTitle" element={<DonatePage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
