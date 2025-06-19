// contexts/ImageURLContext.js
'use client';
import React, { createContext, useContext } from 'react';

const ImageURLContext = createContext();

export const ImageURLProvider = ({ children }) => {
  function fetchImages(url) {
    console.log("🔍 Input URL:", url);

    if (!url || typeof url !== 'string') {
      console.log("❌ Invalid URL provided. Returning placeholder.");
      return 'https://placehold.co/400';
    }

    const splitPart = url.split('tmp');
    console.log("🧩 URL split by 'tmp':", splitPart);

    if (splitPart.length < 2) {
      console.log("❌ 'tmp' not found or no content after 'tmp'. Returning placeholder.");
      return 'https://placehold.co/400';
    }

    let imagePath = splitPart[1];
    console.log("📁 Extracted path after 'tmp':", imagePath);

    imagePath = imagePath.replace(/^\/+/, '');
    console.log("🔧 Cleaned image path (removed leading slashes):", imagePath);

    const finalURL = `https://sleeping-owl-we0m.onrender.com/api/images/tmp/${imagePath}`;
    console.log("✅ Final constructed image URL:", finalURL);

    return finalURL;
  }

  return (
    <ImageURLContext.Provider value={{ fetchImages }}>
      {children}
    </ImageURLContext.Provider>
  );
};

// Custom hook
export const useImageURL = () => {
  const context = useContext(ImageURLContext);
  if (!context) {
    throw new Error("useImageURL must be used within an ImageURLProvider");
  }
  return context;
};
