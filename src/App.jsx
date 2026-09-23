// frontend/src/App.jsx
import React from 'react';
// Yahan se Router hata diya hai, sirf Routes aur Route rakha hai
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Floating interactive helpers
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    // Yahan se <Router> tag hata diya gaya hai kyunki wo main.jsx me lag chuka hai
    <div className="flex flex-col min-h-screen">
      <Navbar /> 
      
      {/* Main content area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/terms" element={<Terms />} />
          
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* 404 ERROR PAGE */}
          <Route 
            path="*" 
            element={
              <div className="py-32 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-7xl font-black text-blue-600 mb-4">404</h1>
                <p className="text-2xl font-bold text-slate-800 mb-6">Oops! Page Not Found</p>
                <p className="text-slate-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
                <a href="#/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">
                  Go Back Home
                </a>
              </div>
            } 
          />
        </Routes>
      </main>

      <Footer /> 
      <WhatsAppButton />
      <ScrollToTop /> 
    </div>
  );
}

export default App;