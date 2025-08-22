import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-secondary/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 text-center">
      <h2 className="text-3xl font-bold mb-4 text-white">Upload Your Study Material</h2>
      <p className="text-light/70 mb-8">Upload a PDF or your notes, and let Izabi work its magic.</p>

      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative border-4 border-dashed rounded-lg p-10 transition-all duration-300 ${
          isDragging ? 'border-cyan bg-cyan/10' : 'border-white/20'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleFileChange(e.target.files)}
          accept=".pdf,.txt,.md,.docx"
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg className="w-16 h-16 text-light/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <p className="text-lg text-light">
            {isDragging ? 'Drop file here!' : 'Drag & drop a file here, or'}
          </p>
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-cyan hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
          >
            Browse File
          </label>
        </div>
      </div>
      <p className="mt-4 text-sm text-light/50">Supported files: PDF, TXT, DOCX</p>
    </div>
  );
};

export default FileUpload;
