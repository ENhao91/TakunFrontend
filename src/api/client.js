const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function apiRequest(endpoint, payload = {}, options = {}) {
    const method = options.method || 'POST'
    const isJsonRequest = method !== 'GET'

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(options.headers || {}),
        },
        body: isJsonRequest ? JSON.stringify(payload) : undefined,
    })

    const contentType = response.headers.get('content-type') || ''
    const parsed = contentType.includes('application/json')
        ? await response.json()
        : await response.text()

    if (!response.ok) {
        const message =
            typeof parsed === 'object' && parsed !== null
                ? parsed.message || parsed.error || 'API 請求失敗。'
                : parsed || 'API 請求失敗。'

        throw new Error(message)
    }

    return parsed
}
