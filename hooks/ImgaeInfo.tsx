import { useState, useEffect, useMemo } from 'react';
import { encode } from 'blurhash';

type ImageMetadata = {
  url: string | null;
  dimensions: { width: number; height: number } | null;
  blurHash: string | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
};

const useImageFile = (file: File | null): ImageMetadata => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [blurHash, setBlurHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create memoized blob URL
  const url = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  // Main effect for loading image dimensions and generating BlurHash
  useEffect(() => {
    if (!file || !url) {
      setDimensions(null);
      setBlurHash(null);
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let isMounted = true;

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        img.onload = () => {
          if (!isMounted || !ctx) return;

          // Set dimensions
          const { naturalWidth: width, naturalHeight: height } = img;
          setDimensions({ width, height });

          // Draw image to canvas
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Get image data and generate BlurHash
          const imageData = ctx.getImageData(0, 0, width, height);
          const hash = encode(imageData.data, imageData.width, imageData.height, 4, 4);
          setBlurHash(hash);

          setIsLoading(false);
        };

        img.onerror = () => {
          if (!isMounted) return;
          setError('Failed to load image');
          setIsLoading(false);
        };

        img.src = url;
      } catch (err) {
        if (!isMounted) return;
        setError('Error processing image');
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [file, url]);

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);

  const reset = () => {
    setDimensions(null);
    setBlurHash(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    url,
    dimensions,
    blurHash,
    isLoading,
    error,
    reset
  };
};

export default useImageFile;