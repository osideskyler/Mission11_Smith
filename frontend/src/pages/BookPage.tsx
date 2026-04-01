import WelcomeBand from "../components/WelcomeBand";
import CategoryFilter from "../components/CategoryFilter";
import BookList from "../components/BookList";
import CartSummary from "../components/CartSummary";
import { useState } from "react";

function BookPage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    return (
    <>
    <div className="container">
      <WelcomeBand />
      <div className="row">
        <div className="col-12 col-md-4">
          <CategoryFilter selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories}/>
        </div>
        <div className="col-12 col-md-8">
          <CartSummary />
          <BookList
            selectedCategories={selectedCategories}
            onRestoreCategories={setSelectedCategories}
          />
        </div>
      </div>
    </div>
    </>
    )
}

export default BookPage;