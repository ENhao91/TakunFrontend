import { useNavigate } from 'react-router-dom'
import defaultThumbnail from '../assets/default-thumbnail.svg'
import VideoPlayer from './VideoPlayer.jsx'

function VideoCard({ video, from }) {
    const navigate = useNavigate()

    const handleVideoClick = () => {
        navigate(`/videos/${video.id}`, {
            state: {
                from,
            },
        })
    }

    const playbackSource = video.playbackUrl || video.videoUrl || video.url || video.sourceUrl || ''
    const thumbnail = video.thumbnailUrl || video.thumbnail || video.image || defaultThumbnail

    return (
        <button type="button" className="video-card" onClick={handleVideoClick}>
            {playbackSource ? (
                <VideoPlayer src={playbackSource} title={video.title} preview />
            ) : (
                <img
                    src={thumbnail}
                    alt={video.title}
                    onError={(event) => {
                        event.currentTarget.src = defaultThumbnail
                        event.currentTarget.onerror = null
                    }}
                />
            )}
            <span>{video.title}</span>
        </button>
    )
}

export default VideoCard
