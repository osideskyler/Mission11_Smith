export type BookListResume = {
    page: number;
    categories: string[];
    sortBy: "title" | "id";
    resultsPerPage: number;
};

export const BOOK_LIST_RESUME_KEY = "bookListResume";
