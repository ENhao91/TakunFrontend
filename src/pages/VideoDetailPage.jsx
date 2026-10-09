import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchVideoDetail, updateVideo } from '../api/videoApi.js'
import ErrorState from '../components/ErrorState.jsx'
import LoadingState from '../components/LoadingState.jsx'
import VideoPlayer from '../components/VideoPlayer.jsx'

function VideoDetailPage() {
    const { videoId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [descriptionDraft, setDescriptionDraft] = useState('')
    const [isSavingDescription, setIsSavingDescription] = useState(false)
    const [descriptionMessage, setDescriptionMessage] = useState('')

    useEffect(() => {
        const loadVideo = async () => {
            try {
                setLoading(true)
                setError('')
                const result = await fetchVideoDetail(Number(videoId))
                setVideo(result?.video || result || null)
            } catch (loadError) {
                setError(loadError.message || '影片資料載入失敗。')
            } finally {
                setLoading(false)
            }
        }

        if (videoId) {
            loadVideo()
        }
    }, [videoId])

    if (loading) {
        return <LoadingState message="載入影片中…" />
    }

    if (error) {
        return (
            <div className="page-shell">
                <ErrorState message={error} />
                <button type="button" className="primary-button" onClick={() => navigate(location.state?.from || '/')}>
                    返回列表
                </button>
            </div>
        )
    }

    if (!video) {
        return (
            <div className="page-shell">
                <div className="state-box empty-box">找不到影片資料。</div>
            </div>
        )
    }

    const videoSource = video.playbackUrl || video.videoUrl || video.url || video.sourceUrl || ''
    const description = video.description || ''

    const handleEditDescription = () => {
        setDescriptionDraft(description)
        setDescriptionMessage('')
        setIsEditingDescription(true)
    }

    const handleSaveDescription = async (event) => {
        event.preventDefault()

        try {
            setIsSavingDescription(true)
            setDescriptionMessage('')
            const updatedVideo = await updateVideo(video.id, { description: descriptionDraft })
            setVideo((current) => ({
                ...current,
                ...(updatedVideo?.video || updatedVideo || {}),
                description: descriptionDraft,
            }))
            setIsEditingDescription(false)
            setDescriptionMessage('簡述已更新。')
        } catch (saveError) {
            setDescriptionMessage(saveError.message || '簡述更新失敗。')
        } finally {
            setIsSavingDescription(false)
        }
    }

    return (
        <div className="page-shell detail-page">
            <header className="detail-header">
                <h2>{video.title}</h2>
                <button type="button" className="secondary-button" onClick={() => navigate(location.state?.from || '/')}>
                    返回列表
                </button>
            </header>

            {videoSource ? (
                <div className="video-player-wrap">
                    <VideoPlayer src={videoSource} title={video.title} />
                </div>
            ) : (
                <div className="state-box empty-box">此影片目前沒有可播放來源。</div>
            )}

            <section className="video-description-section" aria-label="影片簡述">
                <div className="video-description-heading">
                    <h3>簡述</h3>
                    {!isEditingDescription ? (
                        <button
                            type="button"
                            className="description-edit-button"
                            onClick={handleEditDescription}
                            aria-label="修改影片簡述"
                            title="修改簡述"
                        >
                            ✎
                        </button>
                    ) : null}
                </div>

                {isEditingDescription ? (
                    <form className="description-edit-form" onSubmit={handleSaveDescription}>
                        <textarea
                            value={descriptionDraft}
                            onChange={(event) => setDescriptionDraft(event.target.value)}
                            rows="4"
                            aria-label="影片簡述內容"
                            disabled={isSavingDescription}
                            autoFocus
                        />
                        <div className="form-actions">
                            <button type="submit" className="primary-button" disabled={isSavingDescription}>
                                {isSavingDescription ? '儲存中…' : '儲存'}
                            </button>
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => setIsEditingDescription(false)}
                                disabled={isSavingDescription}
                            >
                                取消
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="video-description">{description.trim() || '尚無簡述。'}</p>
                )}

                {descriptionMessage ? <p className="description-status">{descriptionMessage}</p> : null}
            </section>
        </div>
    )
}

export default VideoDetailPage
