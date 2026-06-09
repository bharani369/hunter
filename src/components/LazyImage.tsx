import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils'; // if you have it or standard class merging

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  wrapperClassName?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc = 'https://placehold.co/500x500?text=Loading...', 
  wrapperClassName = '',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            // Once we set it to in view, we can stop observing
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Load slightly before it comes into view
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`} ref={imgRef}>
      {inView ? (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      ) : (
        <div className={`bg-gray-100 flex items-center justify-center animate-pulse ${className || ''}`}>
          <span className="text-gray-400 text-sm">...</span>
        </div>
      )}
    </div>
  );
};
