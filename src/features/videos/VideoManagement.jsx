import { useEffect, useMemo, useState } from 'react'
import { createCategory } from '../../api/categoryApi.js'
import { createVideo, deleteVideo, updateVideo } from '../../api/videoApi.js'

const CREATE_CATEGORY_OPTION = '__create_category__'

const emptyForm = {
    id: '',
    title: '',
    description: '',
    categoryId: '',
    sortOrder: 0,
    driveUrl: '',
}

export function VideoManagement({ categories = [], currentCategoryId = null, onSaved }) {
    const [form, setForm] = useState(emptyForm)
    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isCreatingCategory, setIsCreatingCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [isSavingCategory, setIsSavingCategory] = useState(false)

    const defaultCategoryId = useMemo(() => {
        if (currentCategoryId) {
            return currentCategoryId
        }

        return categories[0]?.id || ''
    }, [categories, currentCategoryId])

    useEffect(() => {
        setForm((current) => ({
            ...current,
            categoryId: current.categoryId || defaultCategoryId,
        }))
    }, [defaultCategoryId])

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((current) => ({
            ...current,
            [name]: name === 'sortOrder' ? Number(value) : value,
        }))
    }

    const handleCategoryChange = (event) => {
        if (event.target.value === CREATE_CATEGORY_OPTION) {
            setIsCreatingCategory(true)
            setErrorMessage('')
            setMessage('')
            return
        }

        setIsCreatingCategory(false)
        setForm((current) => ({ ...current, categoryId: event.target.value }))
    }

    const handleCreateCategory = async () => {
        const name = newCategoryName.trim()
        if (!name) {
            setErrorMessage('請輸入新分類名稱。')
            setMessage('')
            return
        }

        try {
            setIsSavingCategory(true)
            const createdCategory = await createCategory({ name })
            if (!createdCategory?.id) {
                throw new Error('分類已建立，但回傳資料缺少分類編號。')
            }

            setForm((current) => ({ ...current, categoryId: String(createdCategory.id) }))
            setNewCategoryName('')
            setIsCreatingCategory(false)
            setErrorMessage('')
            setMessage(`分類「${createdCategory.name || name}」建立成功，已選取。`)
            if (onSaved) {
                await onSaved()
            }
        } catch (saveError) {
            setErrorMessage(saveError.message || '分類建立失敗。')
            setMessage('')
        } finally {
            setIsSavingCategory(false)
        }
    }

    const validate = () => {
        if (!form.title.trim()) {
            return '影片標題為必填欄位。'
        }

        if (!form.categoryId) {
            return '請選擇分類。'
        }

        if (!form.driveUrl.trim()) {
            return 'Google Drive 影片分享網址為必填欄位。'
        }

        return ''
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const validationError = validate()

        if (validationError) {
            setErrorMessage(validationError)
            setMessage('')
            return
        }

        try {
            const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                categoryId: Number(form.categoryId),
                driveUrl: form.driveUrl.trim(),
            }

            if (form.id) {
                await updateVideo(form.id, payload)
                setMessage('影片更新成功。')
            } else {
                await createVideo(payload)
                setMessage('影片新增成功。')
            }

            setErrorMessage('')
            setForm(emptyForm)
            if (onSaved) {
                onSaved()
            }
        } catch (saveError) {
            setErrorMessage(saveError.message || '影片儲存失敗。')
            setMessage('')
        }
    }

    const handleDelete = async () => {
        if (!form.id) {
            setErrorMessage('請先選擇要刪除的影片。')
            return
        }

        if (!window.confirm('確定要刪除此影片嗎？')) {
            return
        }

        try {
            await deleteVideo(form.id)
            setMessage('影片已刪除。')
            setErrorMessage('')
            setForm(emptyForm)
            if (onSaved) {
                onSaved()
            }
        } catch (deleteError) {
            setErrorMessage(deleteError.message || '刪除失敗。')
            setMessage('')
        }
    }

    return (
        <div className="management-card">
            <h3>影片管理</h3>
            {message ? <p className="success-message">{message}</p> : null}
            {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

            <form className="management-form" onSubmit={handleSubmit}>
                <label>
                    影片標題
                    <input name="title" value={form.title} onChange={handleChange} />
                </label>

                <label>
                    影片描述
                    <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
                </label>

                <label>
                    分類
                    <select
                        name="categoryId"
                        value={isCreatingCategory ? CREATE_CATEGORY_OPTION : form.categoryId}
                        onChange={handleCategoryChange}
                    >
                        <option value="">請選擇分類</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                        <option value={CREATE_CATEGORY_OPTION}>＋ 建立新分類</option>
                    </select>
                </label>

                {isCreatingCategory ? (
                    <div className="new-category-controls">
                        <label>
                            新分類名稱
                            <input
                                value={newCategoryName}
                                onChange={(event) => setNewCategoryName(event.target.value)}
                                disabled={isSavingCategory}
                                autoFocus
                            />
                        </label>
                        <div className="form-actions">
                            <button
                                type="button"
                                className="primary-button"
                                onClick={handleCreateCategory}
                                disabled={isSavingCategory}
                            >
                                {isSavingCategory ? '建立中…' : '建立並選取分類'}
                            </button>
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => {
                                    setIsCreatingCategory(false)
                                    setNewCategoryName('')
                                    setErrorMessage('')
                                }}
                                disabled={isSavingCategory}
                            >
                                取消
                            </button>
                        </div>
                    </div>
                ) : null}

                <label>
                    Google Drive 影片分享網址
                    <input
                        name="driveUrl"
                        type="url"
                        value={form.driveUrl}
                        onChange={handleChange}
                        placeholder="https://drive.google.com/file/d/.../view"
                        required
                    />
                </label>

                <div className="form-actions">
                    <button type="submit" className="primary-button">{form.id ? '更新影片' : '新增影片'}</button>
                    <button type="button" className="secondary-button" onClick={() => setForm(emptyForm)}>
                        清除
                    </button>
                    {/* <button type="button" className="danger-button" onClick={handleDelete}>
                        刪除
                    </button> */}
                </div>
            </form>
        </div>
    )
}
