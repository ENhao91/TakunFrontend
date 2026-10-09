import { apiRequest } from './client.js'

export function fetchVideosByCategory({ categoryId, page = 0, limit = 20 }) {
    return apiRequest('/api/videos/list', { categoryId, page, size: limit })
}

export function searchVideos({ query, page = 0, limit = 20 }) {
    return apiRequest('/api/videos/search', { keyword: query, page, size: limit })
}

export function fetchVideoDetail(videoId) {
    return apiRequest('/api/videos/detail', { videoId })
}

export function createVideo(video) {
    return apiRequest('/api/videos/create', video)
}

export function updateVideo(videoId, video) {
    return apiRequest('/api/videos/update', { ...video, id: Number(videoId) })
}

export function deleteVideo(videoId) {
    return apiRequest('/api/videos/delete', { videoId })
}
