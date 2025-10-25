import React from 'react';
import './AboutBanner.css';

// Import placeholder images from assets
import bg1 from '../../assets/bg1.jpg';
import bg2 from '../../assets/bg2.jpg';
import bg3 from '../../assets/bg3.jpg';
import bg4 from '../../assets/bg4.jpg';

const campusImages = [
  { src: bg1, alt: 'School Building' },
  { src: bg2, alt: 'Playground' },
  { src: bg3, alt: 'Classroom' },
  { src: bg4, alt: 'Activity Area' },
  { src: bg1, alt: 'Library' },
  { src: bg2, alt: 'Science Lab' }
];

export default function AboutBanner({ pageName, breadcrumb = [] }) {
  const defaultBreadcrumb = ['Home', 'About', pageName];
  const breadcrumbItems = breadcrumb.length > 0 ? breadcrumb : defaultBreadcrumb;

  return (
    <div className="about-banner">
      <div className="banner-container">
        {/* Dynamic Image Collage */}
        <div className="image-collage">
          {campusImages.map((image, index) => (
            <div 
              key={index} 
              className={`collage-item collage-item-${index + 1}`}
              style={{
                backgroundImage: `url(${image.src})`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="image-overlay"></div>
            </div>
          ))}
        </div>

        {/* Banner Content */}
        <div className="banner-content">
          <div className="banner-text">
            <h1 className="banner-title">{pageName}</h1>
            <p className="banner-subtitle">
              Discover more about our institution, values, and commitment to excellence
            </p>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="breadcrumb-container">
          <nav className="breadcrumb">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <span className={`breadcrumb-item ${index === breadcrumbItems.length - 1 ? 'active' : ''}`}>
                  {item}
                </span>
                {index < breadcrumbItems.length - 1 && (
                  <span className="breadcrumb-separator">/</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
