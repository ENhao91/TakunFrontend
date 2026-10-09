import { useNavigate } from 'react-router-dom'

function Sidebar({ categories = [], selectedCategoryId = null, onCategorySelect }) {
    const navigate = useNavigate()

    const handleSelect = (categoryId) => {
        if (onCategorySelect) {
            onCategorySelect(categoryId)
            return
        }

        navigate(`/categories/${categoryId}`)
    }

    return (
        <nav className="category-nav" aria-label="分類導覽">
            <button
                type="button"
                className={`category-item ${selectedCategoryId === null ? 'selected' : ''}`}
                onClick={() => navigate('/')}
            >
                首頁
            </button>

            {categories.length === 0 ? (
                <p className="empty-text">尚無分類資料</p>
            ) : (
                categories.map((category) => (
                    <button
                        type="button"
                        key={category.id}
                        className={`category-item ${selectedCategoryId === category.id ? 'selected' : ''}`}
                        onClick={() => handleSelect(category.id)}
                    >
                        {category.name}
                    </button>
                ))
            )}
        </nav>
    )
}

export default Sidebar
