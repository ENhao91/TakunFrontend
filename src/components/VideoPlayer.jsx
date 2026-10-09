function getGoogleDriveEmbedUrl(source) {
    try {
        const url = new URL(source)
        if (url.hostname !== 'drive.google.com') {
            return ''
        }

        const fileId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || url.searchParams.get('id')
        return fileId ? `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview` : ''
    } catch {
        return ''
    }
}

function VideoPlayer({ src, title, preview = false }) {
    const driveEmbedUrl = getGoogleDriveEmbedUrl(src)

    if (driveEmbedUrl) {
        return (
            <iframe
                className={`video-player${preview ? ' video-player-preview' : ''}`}
                src={driveEmbedUrl}
                title={`${title} - Google Drive 影片播放器`}
                allow={preview ? undefined : 'autoplay; encrypted-media; picture-in-picture'}
                allowFullScreen={!preview}
                loading={preview ? 'lazy' : 'eager'}
                tabIndex={preview ? -1 : 0}
                aria-hidden={preview ? 'true' : undefined}
            />
        )
    }

    if (!src) {
        return null
    }

    return (
        <video
            controls={!preview}
            muted={preview}
            playsInline
            preload={preview ? 'metadata' : 'auto'}
            className={`video-player${preview ? ' video-player-preview' : ''}`}
            src={src}
            aria-label={preview ? `${title} 預覽` : title}
        >
            {!preview ? <track kind="captions" /> : null}
        </video>
    )
}

export default VideoPlayer
