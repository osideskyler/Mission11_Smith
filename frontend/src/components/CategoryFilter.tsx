import { useState, useEffect } from "react";
import './CategoryFilter.css';

function CategoryFilter({selectedCategories, onCategoryChange}: {selectedCategories: string[], onCategoryChange: (categories: string[]) => void}) {
    const [bookTypes, setBookTypes] = useState<string[]>([]);
    useEffect(() => {
        const fetchBookTypes = async () => {
            const categoryParams = selectedCategories.map(category => `category=${category}`).join('&');
            const response = await fetch(`/api/book/types?${categoryParams}`); 
            if (!response.ok) {
                const text = await response.text().catch(() => "");
                throw new Error(`GET /api/book/types failed: ${response.status} ${response.statusText} ${text}`);
            }
            const data = await response.json();
            setBookTypes(data);
        };
        fetchBookTypes();
    }, []);

    function handleChange({target}: {target: HTMLInputElement}) {
        const updatedCategories = selectedCategories.includes(target.value)
            ? selectedCategories.filter(category => category !== target.value)
            : [...selectedCategories, target.value];
        onCategoryChange(updatedCategories);
    }
    return (
        <div className="category-filter">
            <h2>Book Types</h2>
            <div className="category-list">
                {bookTypes.map((type) => (
                    <div className="category-item" key={type}>
                        <input type="checkbox" id={type} name={type} onChange={handleChange} />
                        <label htmlFor={type}>{type}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryFilter;