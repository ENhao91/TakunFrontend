import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar({ onSearch, initialValue = '' }) {
    const navigate = useNavigate()
    const [query, setQuery] = useState(initialValue)

    const handleSubmit = (event) => {
        event.preventDefault()
        const trimmedQuery = query.trim()

        if (!trimmedQuery) {
            return
        }

        if (onSearch) {
            onSearch(trimmedQuery)
            return
        }

        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}&page=0`)
    }

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜尋影片"
                aria-label="搜尋影片"
            />
            <button type="submit" aria-label="搜尋">⌕</button>
        </form>
    )
}

export default SearchBar
