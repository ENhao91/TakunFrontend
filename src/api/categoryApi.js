import { apiRequest } from './client.js'

export function fetchCategories() {
    return apiRequest('/api/categories/list', {}).catch(() => apiRequest('/api/categories', {}))
}

export function createCategory(category) {
    return apiRequest('/api/categories/create', category)
}

export function updateCategory(categoryId, category) {
    return apiRequest('/api/categories/update', { categoryId, ...category })
}

export function deleteCategory(categoryId) {
    return apiRequest('/api/categories/delete', { categoryId })
}

export function reorderCategory(categoryId, sortOrder) {
    return apiRequest('/api/categories/reorder', { categoryId, sortOrder })
}
