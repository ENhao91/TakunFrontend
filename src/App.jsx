import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import CategoryVideosPage from './pages/CategoryVideosPage.jsx'
import SearchResultsPage from './pages/SearchResultsPage.jsx'
import VideoDetailPage from './pages/VideoDetailPage.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="categories/:categoryId" element={<CategoryVideosPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="videos/:videoId" element={<VideoDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
