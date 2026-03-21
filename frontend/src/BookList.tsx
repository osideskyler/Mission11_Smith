import { useEffect, useState } from "react";
import type { Book } from "./types/Book";

function BookList() {

    const [books, setBooks] = useState<Book[]>([]);


    useEffect(() => {
        const fetchBooks = async () => {
            // Use Vite dev-server proxy (see vite.config.ts)
            const response = await fetch("/api/book");
            if (!response.ok) {
                const text = await response.text().catch(() => "");
                throw new Error(`GET /api/book failed: ${response.status} ${response.statusText} ${text}`);
            }
            const data = await response.json();
            setBooks(data);
        };
        fetchBooks();
    }, []);

    return (
        <>
            <h1>Book List</h1>
            <br/>
            {books.map((b) => (
                <div key={b.bookId} className="card mb-3">
                    <div className="card-body">
                        <h2>{b.title}</h2>
                        <p>{b.author}</p>
                        <p>{b.publisher}</p>
                        <p>{b.isbn}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

export default BookList;