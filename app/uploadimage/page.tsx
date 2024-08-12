"use client"
import React, { useState } from 'react';

const UploadImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!image) {
      console.error("No image selected.");
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    // Log FormData content
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const response = await fetch('http://localhost:3000/api/post/upload/30', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        return;
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleChange} />
      <button type="submit">Upload Image</button>
    </form>
  );
};

export default UploadImage;
