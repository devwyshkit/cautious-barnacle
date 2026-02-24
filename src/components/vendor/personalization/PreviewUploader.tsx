'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Camera, Image as ImageIcon, Loader2, SwitchCamera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { upload_preview } from '@/lib/actions/vendor/vendor-actions';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logging/logger';
import imageCompression from 'browser-image-compression';

interface PreviewUploaderProps {
  orderId: string;
  orderItemId: string; // Relational Mapping
  orderNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Mode = 'select' | 'upload' | 'camera';

export function PreviewUploader({ orderId, orderItemId, orderNumber, isOpen, onClose, onSuccess }: PreviewUploaderProps) {
  const [mode, setMode] = useState<Mode>('select');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMode('camera');
    } catch (error) {
      logger.error('Camera error in PreviewUploader', error);
      toast.error('Could not access camera');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const switchCamera = async () => {
    stopCamera();
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      logger.error('Camera switch error in PreviewUploader', error);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPreview(dataUrl);

      // Convert to file
      canvas.toBlob((blob) => {
        if (blob) {
          const capturedFile = new File([blob], `preview-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setFile(capturedFile);
        }
      }, 'image/jpeg', 0.9);

      stopCamera();
      setMode('upload');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      toast.info("Compressing image...");
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      const finalFile = new File([compressedFile], file.name, { type: file.type });

      const supabase = createClient();
      const fileName = `previews/${orderId}/${Date.now()}-${file.name}`;

      toast.info("Uploading image...");
      const { data, error } = await supabase.storage
        .from('order-assets')
        .upload(fileName, finalFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('order-assets')
        .getPublicUrl(data.path);

      const result = await upload_preview(orderId, orderItemId, publicUrl);

      if (result.success) {
        toast.success('Preview uploaded');
        onSuccess();
        handleClose();
      } else {
        toast.error(result.error || 'Failed to upload');
      }
    } catch (error) {
      logger.error('Upload error in PreviewUploader', error, { orderId });
      toast.error('Failed to upload preview');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setFile(null);
    setPreview(null);
    setMode('select');
    onClose();
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setMode('select');
  };

  return (
    <ResponsiveSurface
      open={isOpen}
      onOpenChange={handleClose}
      title={`Upload preview for #${orderNumber}`}
      className="sm:max-w-md"
    >
      <div className="flex flex-col h-full mt-4">
        <div className="flex-1 space-y-4">
          {/* Mode Selection */}
          {mode === 'select' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('upload')}
                className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-zinc-200 rounded-xl hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                <div className="size-12 rounded-full bg-zinc-100 flex items-center justify-center">
                  <Upload className="size-5 text-zinc-500" />
                </div>
                <span className="text-sm font-medium text-zinc-700">Upload file</span>
              </button>
              <button
                onClick={startCamera}
                className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-zinc-200 rounded-xl hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                <div className="size-12 rounded-full bg-zinc-100 flex items-center justify-center">
                  <Camera className="size-5 text-zinc-500" />
                </div>
                <span className="text-sm font-medium text-zinc-700">Take photo</span>
              </button>
            </div>
          )}

          {/* Camera View */}
          {mode === 'camera' && (
            <div className="space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-3 right-3 size-10 rounded-full bg-white/80 backdrop-blur"
                  onClick={switchCamera}
                >
                  <SwitchCamera className="size-5" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => { stopCamera(); setMode('select'); }}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={capturePhoto}>
                  <Camera className="size-4 mr-2" />
                  Capture
                </Button>
              </div>
            </div>
          )}

          {/* Upload View */}
          {mode === 'upload' && !preview && (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                isDragActive ? "border-zinc-400 bg-zinc-50" : "border-zinc-200 hover:border-zinc-300"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                <div className="size-12 rounded-full bg-zinc-100 flex items-center justify-center">
                  <ImageIcon className="size-5 text-zinc-500" />
                </div>
                <p className="text-sm font-medium text-zinc-700">
                  {isDragActive ? 'Drop image here' : 'Drag image or click to browse'}
                </p>
                <p className="text-xs text-zinc-500">PNG, JPG up to 5MB</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-3 right-3 size-8"
                onClick={clearFile}
              >
                <X className="size-4" />
              </Button>
            </div>
          )}

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {(mode === 'upload' || preview) && (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6 shrink-0">
            <Button variant="outline" onClick={handleClose} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload preview'
              )}
            </Button>
          </div>
        )}
      </div>
    </ResponsiveSurface>
  );
}
