import { useState, useEffect } from "react";
import "./CategoryFilter.css";
import { fetchBookTypes } from "../api/booksAPI";

function CategoryFilter({selectedCategories, onCategoryChange}: {selectedCategories: string[], onCategoryChange: (categories: string[]) => void}) {
    const [bookTypes, setBookTypes] = useState<string[]>([]);
    useEffect(() => {
        fetchBookTypes()
            .then(setBookTypes)
            .catch((err) => console.error(err));
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
                        <input
                            type="checkbox"
                            id={type}
                            name={type}
                            value={type}
                            checked={selectedCategories.includes(type)}
                            onChange={handleChange}
                        />
                        <label htmlFor={type}>{type}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryFilter;