
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/SearchBar.css";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/") {
            setSearchQuery("");
        }
    }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            navigate(`/search?query=${encodeURIComponent(q)}`);
        }
    };

    return (
        <form className="search-bar" onSubmit={handleSearch} role="search">
            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search products"
            />
            <button type="submit" className="search-btn" aria-label="Search">
                🔍
            </button>
        </form>
    );
};

export default SearchBar;
