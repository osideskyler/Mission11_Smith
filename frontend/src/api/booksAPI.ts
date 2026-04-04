import type { Book } from "../types/Book";
// give me a fall back for the API_URL if it is not set
export const API_URL = (import.meta.env.VITE_API_URL ?? "https://abookaday-api.azurewebsites.net/Book").replace(/\/$/, "");

export type SortBy = "title" | "id";

export interface FetchBooksResponse {
    books: Book[];
    totalNumBooks: number;
}

function buildCategoryQuery(categories: string[]): string {
    if (categories.length === 0) return "";
    return (
        "&" +
        categories.map((c) => `categories=${encodeURIComponent(c)}`).join("&")
    );
}

export async function fetchBooks(
    page: number,
    pageSize: number,
    sortBy: SortBy,
    selectedCategories: string[]
): Promise<Book[]> {
    const categoryParams = buildCategoryQuery(selectedCategories);
    const response = await fetch(
        `${API_URL}/api/book?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}${categoryParams}`
    );
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `GET /api/book failed: ${response.status} ${response.statusText} ${text}`
        );
    }
    return response.json();
}

export async function fetchBookCount(
    selectedCategories: string[]
): Promise<number> {
    const categoryParams =
        selectedCategories.length > 0
            ? "?" +
              selectedCategories
                  .map((c) => `categories=${encodeURIComponent(c)}`)
                  .join("&")
            : "";
    const response = await fetch(`${API_URL}/api/book/count${categoryParams}`);
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `GET /api/book/count failed: ${response.status} ${response.statusText} ${text}`
        );
    }
    return response.json();
}

export async function fetchBookTypes(): Promise<string[]> {
    const response = await fetch(`${API_URL}/api/book/types`);
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `GET /api/book/types failed: ${response.status} ${response.statusText} ${text}`
        );
    }
    return response.json();
}

export async function fetchBooksPage(
    page: number,
    pageSize: number,
    sortBy: SortBy,
    selectedCategories: string[]
): Promise<FetchBooksResponse> {
    const [books, totalNumBooks] = await Promise.all([
        fetchBooks(page, pageSize, sortBy, selectedCategories),
        fetchBookCount(selectedCategories),
    ]);
    return { books, totalNumBooks };
}

export type BookInput = Omit<Book, "bookId">;

export async function addBook(book: BookInput): Promise<Book> {
    const response = await fetch(`${API_URL}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...book, bookId: 0 }),
    });
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `POST /api/book failed: ${response.status} ${response.statusText} ${text}`
        );
    }
    return response.json();
}

export async function updateBook(id: number, book: Book): Promise<void> {
    const response = await fetch(`${API_URL}/api/book/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
    });
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `PUT /api/book/${id} failed: ${response.status} ${response.statusText} ${text}`
        );
    }
}

export async function deleteBook(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/book/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `DELETE /api/book/${id} failed: ${response.status} ${response.statusText} ${text}`
        );
    }
}
