import { useState, useRef } from "react";
import { Upload, File, Image, X, Download } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Progress } from "src/components/ui/progress";
import { Card, CardContent } from "src/components/ui/card";

interface FileUploadProps {
  onFileUpload: (file: File, type: 'image' | 'document') => void;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadProgress: number;
}

export default function FileUpload({ 
  onFileUpload, 
  maxFileSize = 10,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt']
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
        return;
      }

      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const fileType = file.type.startsWith('image/') ? 'image' : 'document';
      
      // Create file URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        uploadProgress: 0
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, uploadProgress: Math.min(f.uploadProgress + 10, 100) }
              : f
          )
        );
      }, 200);

      // Complete upload after 2 seconds
      setTimeout(() => {
        clearInterval(uploadInterval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, uploadProgress: 100 }
              : f
          )
        );
        onFileUpload(file, fileType);
      }, 2000);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={acceptedTypes.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Upload birth charts, documents, or images
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-xs text-gray-400">
          Supports: Images, PDF, DOC, TXT (Max {maxFileSize}MB each)
        </p>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose Files
        </Button>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
          {uploadedFiles.map((file) => (
            <Card key={file.id} className="p-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {file.type.startsWith('image/') ? (
                    <div className="w-10 h-10 rounded overflow-hidden">
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <File className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {file.uploadProgress < 100 && (
                    <Progress value={file.uploadProgress} className="mt-2 h-1" />
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.uploadProgress === 100 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = file.url;
                        link.download = file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}