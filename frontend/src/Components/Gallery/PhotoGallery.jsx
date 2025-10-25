import React, { useState } from 'react';
import './PhotoGallery.css';
import bg1 from '../../assets/bg1.jpg';
import bg2 from '../../assets/bg2.jpg';
import bg3 from '../../assets/bg3.jpg';
import bg4 from '../../assets/bg4.jpg';

const galleryImages = [
  { id: 1, src: bg1, title: 'Annual Sports Day', category: 'Sports', year: '2024', month: 'March' },
  { id: 2, src: bg2, title: 'Science Exhibition', category: 'Academic', year: '2024', month: 'February' },
  { id: 3, src: bg3, title: 'Cultural Festival', category: 'Cultural', year: '2024', month: 'January' },
  { id: 4, src: bg4, title: 'Graduation Ceremony', category: 'Ceremony', year: '2023', month: 'December' },
  { id: 5, src: bg1, title: 'Art Competition', category: 'Arts', year: '2023', month: 'November' },
  { id: 6, src: bg2, title: 'Math Olympiad', category: 'Academic', year: '2023', month: 'October' },
  { id: 7, src: bg3, title: 'Independence Day', category: 'Cultural', year: '2023', month: 'August' },
  { id: 8, src: bg4, title: 'Teachers Day', category: 'Cultural', year: '2023', month: 'September' },
  { id: 9, src: bg1, title: 'Field Trip', category: 'Educational', year: '2023', month: 'July' },
];

const years = ['All Years', '2024', '2023', '2022', '2021'];
const months = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function PhotoGallery() {
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const filteredImages = galleryImages.filter(image => {
    const matchesYear = selectedYear === 'All Years' || image.year === selectedYear;
    const matchesMonth = selectedMonth === 'All Months' || image.month === selectedMonth;
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || image.category === selectedCategory;
    
    return matchesYear && matchesMonth && matchesSearch && matchesCategory;
  });

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div className="photo-gallery-page">
      {/* Header with Breadcrumbs */}
      <div className="gallery-header">
        <div className="container">
          <nav className="breadcrumbs">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">Media</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">Gallery</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Photo Gallery</span>
          </nav>
        </div>
      </div>

      {/* Panoramic Banner */}
      <div className="panoramic-banner">
        <div className="banner-images">
          <div className="banner-image" style={{ backgroundImage: `url(${bg1})` }}>
            <div className="banner-overlay">
              <h2>School Campus</h2>
              <p>Playground & Sports Facilities</p>
            </div>
          </div>
          <div className="banner-image" style={{ backgroundImage: `url(${bg2})` }}>
            <div className="banner-overlay">
              <h2>Academic Building</h2>
              <p>Modern Classrooms & Labs</p>
            </div>
          </div>
          <div className="banner-image" style={{ backgroundImage: `url(${bg3})` }}>
            <div className="banner-overlay">
              <h2>Learning Spaces</h2>
              <p>Interactive Classrooms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="gallery-content">
        <div className="container">
          {/* Section Title */}
          <div className="section-title">
            <h1>Photo Gallery</h1>
            <p>Explore our school's memorable moments and events</p>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-group">
              <label htmlFor="year-select">Select Year</label>
              <select 
                id="year-select" 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="month-select">Select Month</label>
              <select 
                id="month-select" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div className="filter-group search-group">
              <label htmlFor="search-input">Album Title or Description</label>
              <input 
                id="search-input"
                type="text" 
                placeholder="Search photos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Gallery Section Title */}
          <div className="gallery-section-title">
            <h2>Memorable Moments & Events</h2>
            <p>Capturing the spirit of learning, growth, and celebration at our school</p>
          </div>

          {/* Image Grid */}
          <div className="image-grid">
            {filteredImages.map((image, index) => (
              <div 
                key={image.id} 
                className="gallery-item"
                onClick={() => openLightbox(index)}
              >
                <img src={image.src} alt={image.title} />
                <div className="image-overlay">
                  <div className="overlay-content">
                    <h3>{image.title}</h3>
                    <p>{image.category} • {image.month} {image.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="no-results">
              <h3>No photos found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <button className="lightbox-nav prev" onClick={prevImage}>‹</button>
            <img src={filteredImages[currentImageIndex].src} alt={filteredImages[currentImageIndex].title} />
            <button className="lightbox-nav next" onClick={nextImage}>›</button>
            <div className="lightbox-info">
              <h3>{filteredImages[currentImageIndex].title}</h3>
              <p>{filteredImages[currentImageIndex].category} • {filteredImages[currentImageIndex].month} {filteredImages[currentImageIndex].year}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
