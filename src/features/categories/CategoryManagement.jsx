import { useState } from 'react'
import { createCategory, deleteCategory, reorderCategory, updateCategory } from '../../api/categoryApi.js'

const emptyForm = {
    id: '',
    name: '',
    sortOrder: 0,
}

export function CategoryManagement({ categories = [], onSaved }) {
    const [form, setForm] = useState(emptyForm)
    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((current) => ({
            ...current,
            [name]: name === 'sortOrder' ? Number(value) : value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!form.name.trim()) {
            setErrorMessage('分類名稱為必填欄位。')
            setMessage('')
            return
        }

        try {
            const payload = {
                name: form.name.trim(),
                sortOrder: Number(form.sortOrder || 0),
            }

            if (form.id) {
                await updateCategory(form.id, payload)
                setMessage('分類更新成功。')
            } else {
                await createCategory(payload)
                setMessage('分類新增成功。')
            }

            setErrorMessage('')
            setForm(emptyForm)
            if (onSaved) {
                onSaved()
            }
        } catch (saveError) {
            setErrorMessage(saveError.message || '分類儲存失敗。')
            setMessage('')
        }
    }

    const handleDelete = async (categoryId) => {
        const category = categories.find((item) => item.id === categoryId)

        if (!category) {
            return
        }

        if (category.videoCount > 0) {
            setErrorMessage('此分類仍有影片，請先處理後再刪除。')
            setMessage('')
            return
        }

        if (!window.confirm(`確定要刪除分類「${category.name}」嗎？`)) {
            return
        }

        try {
            await deleteCategory(categoryId)
            setMessage('分類已刪除。')
            setErrorMessage('')
            if (onSaved) {
                onSaved()
            }
        } catch (deleteError) {
            setErrorMessage(deleteError.message || '分類刪除失敗。')
            setMessage('')
        }
    }

    const handleReorder = async (categoryId, nextOrder) => {
        try {
            await reorderCategory(categoryId, nextOrder)
            setMessage('分類順序已更新。')
            setErrorMessage('')
            if (onSaved) {
                onSaved()
            }
        } catch (reorderError) {
            setErrorMessage(reorderError.message || '順序更新失敗。')
            setMessage('')
        }
    }

    return (
        <div className="management-card">
            <h3>分類管理</h3>
            {message ? <p className="success-message">{message}</p> : null}
            {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

            <form className="management-form" onSubmit={handleSubmit}>
                <label>
                    分類名稱
                    <input name="name" value={form.name} onChange={handleChange} />
                </label>

                <label>
                    顯示順序
                    <input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} />
                </label>

                <div className="form-actions">
                    <button type="submit" className="primary-button">{form.id ? '更新分類' : '新增分類'}</button>
                    <button type="button" className="secondary-button" onClick={() => setForm(emptyForm)}>
                        清除
                    </button>
                </div>
            </form>

            <div className="category-list">
                {categories.map((category) => (
                    <div className="category-item-row" key={category.id}>
                        <button type="button" className="category-edit" onClick={() => setForm({ id: category.id, name: category.name, sortOrder: category.sortOrder || 0 })}>
                            編輯
                        </button>
                        <span>{category.name}</span>
                        <span>順序：{category.sortOrder ?? 0}</span>
                        <input
                            type="number"
                            value={category.sortOrder ?? 0}
                            onChange={(event) => handleReorder(category.id, Number(event.target.value))}
                        />
                        <button type="button" className="danger-button" onClick={() => handleDelete(category.id)}>
                            刪除
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
