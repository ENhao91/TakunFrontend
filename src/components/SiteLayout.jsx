import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import Sidebar from './Sidebar.jsx'
import { useCategories } from '../hooks/useCategories.js'
import { VideoManagement } from '../features/videos/VideoManagement.jsx'
import { CategoryManagement } from '../features/categories/CategoryManagement.jsx'

function SiteLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { categories, loading, error, refresh } = useCategories()
    const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [activeManagementTab, setActiveManagementTab] = useState('videos')

    useEffect(() => {
        const handleResize = () => {
            const nextDesktop = window.innerWidth >= 768
            setIsDesktop(nextDesktop)

            if (nextDesktop) {
                setMobileOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const selectedCategoryId = useMemo(() => {
        const match = location.pathname.match(/^\/categories\/(\d+)/)
        return match ? Number(match[1]) : null
    }, [location.pathname])

    const handleSearch = (query) => {
        setMobileOpen(false)
        navigate(`/search?q=${encodeURIComponent(query)}&page=0`)
    }

    return (
        <div className="app-shell">
            <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
                <div className="sidebar-search">
                    <SearchBar onSearch={handleSearch} />
                </div>
                <Sidebar
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onCategorySelect={(categoryId) => {
                        setMobileOpen(false)
                        navigate(`/categories/${categoryId}`)
                    }}
                />
            </aside>

            <div className="main-panel">
                <header className="topbar">
                    {!isDesktop ? (
                        <button
                            type="button"
                            className="menu-button"
                            onClick={() => setMobileOpen((current) => !current)}
                            aria-label="切換選單"
                        >
                            ☰
                        </button>
                    ) : null}

                    <div className="topbar-title">
                        <h1>教會影音</h1>
                    </div>

                    {isDesktop ? (
                        <button
                            type="button"
                            className={`edit-toggle ${editMode ? 'active' : ''}`}
                            onClick={() => setEditMode((current) => !current)}
                            aria-label="切換編輯模式"
                        >
                            ✎
                        </button>
                    ) : null}
                </header>

                {isDesktop && editMode ? (
                    <section className="management-panel">
                        <div className="management-tabs">
                            <button
                                type="button"
                                className={activeManagementTab === 'videos' ? 'active' : ''}
                                onClick={() => setActiveManagementTab('videos')}
                            >
                                影片管理
                            </button>
                            <button
                                type="button"
                                className={activeManagementTab === 'categories' ? 'active' : ''}
                                onClick={() => setActiveManagementTab('categories')}
                            >
                                分類管理
                            </button>
                        </div>

                        <div className="management-content">
                            {activeManagementTab === 'videos' ? (
                                <VideoManagement
                                    categories={categories}
                                    currentCategoryId={selectedCategoryId}
                                    onSaved={refresh}
                                />
                            ) : (
                                <CategoryManagement categories={categories} onSaved={refresh} />
                            )}
                        </div>
                    </section>
                ) : null}

                <main className="content-panel">
                    <Outlet context={{ categories, loading, error, refreshCategories: refresh, activeCategoryId: selectedCategoryId }} />
                </main>
            </div>
        </div>
    )
}

export default SiteLayout
