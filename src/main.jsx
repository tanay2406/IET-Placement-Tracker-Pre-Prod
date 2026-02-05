import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { store } from './redux/store'
import App from './App'
import BatchPage from './components/BatchPage'
import CompanyDetails from './components/CompanyDetails'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/batch/:batch" element={<BatchPage />} />
          <Route path="/company/:id" element={<CompanyDetails  />} />

        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
)
