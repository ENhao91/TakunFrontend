function ErrorState({ message, onRetry }) {
    return (
        <div className="state-box error-box">
            <p>{message || '資料載入失敗。'}</p>
            {onRetry ? (
                <button type="button" onClick={onRetry} className="secondary-button">
                    重試
                </button>
            ) : null}
        </div>
    )
}

export default ErrorState
