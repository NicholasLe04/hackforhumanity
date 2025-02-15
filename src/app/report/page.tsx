'use client';

import Image from "next/image";
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';

export default function ReportPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedImage(file);
    
    // Create preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you'll add the logic to submit the report
    console.log('Submitting:', { selectedImage, description, location });
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <nav className="mb-8">
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          ← Back to Map
        </Link>
      </nav>
      
      <h1 className="text-3xl font-bold mb-8">Report an Incident</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="block font-medium">Upload Image</label>
          <div 
            {...getRootProps()} 
            className={`w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
          >
            <input {...getInputProps()} />
            {imagePreview ? (
              <div className="flex flex-col items-center gap-4">
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  width={300} 
                  height={300} 
                  style={{ objectFit: 'contain' }}
                />
                <p>Drop a new image to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/file.svg"
                  alt="Upload icon"
                  width={48}
                  height={48}
                />
                <p>Drag and drop an image here, or click to select</p>
                <p className="text-sm text-gray-500">Supports JPG, PNG, GIF, WEBP</p>
              </div>
            )}
          </div>
        </div>

        {/* Location Input */}
        <div className="space-y-2">
          <label htmlFor="location" className="block font-medium">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter incident location"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg h-32"
            placeholder="Describe the incident..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={!selectedImage}
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}