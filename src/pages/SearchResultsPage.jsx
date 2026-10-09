import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchVideos } from '../api/videoApi.js'
import ErrorState from '../components/ErrorState.jsx'
import LoadingState from '../components/LoadingState.jsx'
import Pagination from '../components/Pagination.jsx'
import VideoCard from '../components/VideoCard.jsx'

function SearchResultsPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [page, setPage] = useState(Number(searchParams.get('page') || 0))
    const [totalPages, setTotalPages] = useState(1)

    const query = searchParams.get('q') || ''

    useEffect(() => {
        const nextPage = Number(searchParams.get('page') || 0)
        setPage(nextPage)
    }, [searchParams])

    useEffect(() => {
        const currentQuery = (query || '').trim()

        if (!currentQuery) {
            setVideos([])
            setLoading(false)
            setError('請輸入搜尋關鍵字。')
            return
        }

        const loadResults = async () => {
            try {
                setLoading(true)
                setError('')
                const result = await searchVideos({ query: currentQuery, page, limit: 20 })
                const list = Array.isArray(result?.items) ? result.items : []
                setVideos(list)
                setTotalPages(Number(result?.totalPages ?? 1))
            } catch (searchError) {
                setError(searchError.message || '搜尋失敗。')
                setVideos([])
            } finally {
                setLoading(false)
            }
        }

        loadResults()
    }, [page, query])

    const handlePageChange = (nextPage) => {
        setSearchParams({ q: query, page: String(nextPage) })
    }

    if (loading) {
        return <LoadingState message="搜尋中…" />
    }

    if (error) {
        return <ErrorState message={error} onRetry={() => setPage((current) => current)} />
    }

    return (
        <div className="page-shell">
            <div className="page-header">
                <h2>搜尋結果：{query}</h2>
            </div>

            {videos.length === 0 ? (
                <div className="state-box empty-box">沒有符合「{query}」的影片。</div>
            ) : (
                <>
                    <div className="video-grid">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} from={`/search?q=${encodeURIComponent(query)}&page=${page}`} />
                        ))}
                    </div>
                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    )
}

export default SearchResultsPage
