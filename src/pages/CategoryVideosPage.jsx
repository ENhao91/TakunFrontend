import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useParams, useSearchParams } from 'react-router-dom'
import { fetchVideosByCategory } from '../api/videoApi.js'
import ErrorState from '../components/ErrorState.jsx'
import LoadingState from '../components/LoadingState.jsx'
import Pagination from '../components/Pagination.jsx'
import VideoCard from '../components/VideoCard.jsx'

function CategoryVideosPage() {
    const { categoryId } = useParams()
    const { categories = [] } = useOutletContext()
    const [searchParams, setSearchParams] = useSearchParams()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [page, setPage] = useState(Number(searchParams.get('page') || 0))
    const [totalPages, setTotalPages] = useState(1)

    const categoryName = useMemo(
        () => categories.find((category) => String(category.id) === String(categoryId))?.name || '分類影片',
        [categories, categoryId],
    )

    useEffect(() => {
        const nextPage = Number(searchParams.get('page') || 0)
        setPage(nextPage)
    }, [searchParams])

    useEffect(() => {
        const loadVideos = async () => {
            if (!categoryId) {
                return
            }

            try {
                setLoading(true)
                setError('')
                const result = await fetchVideosByCategory({ categoryId: Number(categoryId), page, limit: 20 })
                const list = Array.isArray(result?.items) ? result.items : []
                setVideos(list)
                setTotalPages(Number(result?.totalPages ?? 1))
            } catch (loadError) {
                setError(loadError.message || '影片載入失敗。')
                setVideos([])
            } finally {
                setLoading(false)
            }
        }

        loadVideos()
    }, [categoryId, page])

    const handlePageChange = (nextPage) => {
        setSearchParams({ page: String(nextPage) })
    }

    if (loading) {
        return <LoadingState message="載入影片中…" />
    }

    if (error) {
        return <ErrorState message={error} onRetry={() => setPage((current) => current)} />
    }

    return (
        <div className="page-shell">
            <div className="page-header">
                <h2>{categoryName}</h2>
            </div>

            {videos.length === 0 ? (
                <div className="state-box empty-box">此分類目前沒有影片。</div>
            ) : (
                <>
                    <div className="video-grid">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} from={`/categories/${categoryId}?page=${page}`} />
                        ))}
                    </div>
                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    )
}

export default CategoryVideosPage
