import { useCallback, useEffect, useState } from 'react'
import { fetchCategories } from '../api/categoryApi.js'

export function useCategories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true)
            setError('')
            const result = await fetchCategories()
            const list = Array.isArray(result?.categories)
                ? result.categories
                : Array.isArray(result)
                    ? result
                    : []
            setCategories(list)
        } catch (loadError) {
            setError(loadError.message || '分類資料載入失敗。')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadCategories()
    }, [loadCategories])

    return {
        categories,
        loading,
        error,
        refresh: loadCategories,
    }
}
