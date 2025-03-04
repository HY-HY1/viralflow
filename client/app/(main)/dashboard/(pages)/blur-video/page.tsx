"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Video, Play, Download, Link as LinkIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Caption {
  text: string;
  start: number;
  end: number;
}

export default function BlurVideoPage() {
  // State for video source (file or YouTube URL)
  const [videoSource, setVideoSource] = useState<File | string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Time selection state
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(100);
  const [videoDuration, setVideoDuration] = useState(0);
  
  // Captions state
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [currentCaption, setCurrentCaption] = useState({ text: "", start: 0, end: 5 });
  
  // Settings state
  const [blurRadius, setBlurRadius] = useState(30);
  const [autoDetectFaces, setAutoDetectFaces] = useState(true);
  const [quality, setQuality] = useState("1080p");

  // Video preview ref
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setVideoSource(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      // Reset time selection when new video is loaded
      setStartTime(0);
      if (videoRef.current) {
        setVideoDuration(videoRef.current.duration);
        setEndTime(videoRef.current.duration);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  // Handle YouTube URL input
  const handleYouTubeUrlSubmit = async () => {
    if (!videoUrl) return;
    setVideoSource(videoUrl);
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/video/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: videoUrl,
          startTime,
          endTime,
          blurRadius,
          autoDetectFaces,
          quality,
          captions
        })
      });
      
      if (!response.ok) throw new Error('Failed to process YouTube video');
      
      const data = await response.json();
      setProcessedVideoUrl(data.url);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing YouTube video:', error);
      setIsProcessing(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = async () => {
    if (!videoSource || typeof videoSource === 'string') return;
    
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('video', videoSource);
    formData.append('startTime', startTime.toString());
    formData.append('endTime', endTime.toString());
    formData.append('blurRadius', blurRadius.toString());
    formData.append('autoDetectFaces', autoDetectFaces.toString());
    formData.append('quality', quality);
    formData.append('captions', JSON.stringify(captions));
    
    try {
      const response = await fetch('/api/video/process', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to process video');
      
      const data = await response.json();
      setProcessedVideoUrl(data.url);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
    }
  };

  // Handle caption addition
  const handleAddCaption = () => {
    if (currentCaption.text) {
      setCaptions([...captions, currentCaption]);
      setCurrentCaption({ text: "", start: endTime, end: endTime + 5 });
    }
  };

  return (
    <div className="container space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Editor</h1>
          <p className="text-muted-foreground mt-2">
            Upload a video or paste a YouTube URL to start editing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {previewUrl ? (
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    controls
                    className="w-full h-full rounded-lg"
                  />
                ) : processedVideoUrl ? (
                  <video
                    src={processedVideoUrl}
                    controls
                    className="w-full h-full rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Video className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground mt-2">
                      Upload a video or paste a YouTube URL to start
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <Button
                  onClick={handleVideoUpload}
                  disabled={!videoSource || isProcessing}
                  className="flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>{isProcessing ? "Processing..." : "Process Video"}</span>
                </Button>
                {processedVideoUrl && (
                  <Button
                    onClick={() => window.open(processedVideoUrl)}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline & Captions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Video Timeline (seconds)</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    value={startTime}
                    onChange={(e) => setStartTime(Number(e.target.value))}
                    min={0}
                    max={endTime}
                  />
                  <Slider
                    value={[startTime, endTime]}
                    min={0}
                    max={videoDuration || 100}
                    step={0.1}
                    onValueChange={(values: number[]) => {
                      setStartTime(values[0]);
                      setEndTime(values[1]);
                    }}
                  />
                  <Input
                    type="number"
                    value={endTime}
                    onChange={(e) => setEndTime(Number(e.target.value))}
                    min={startTime}
                    max={videoDuration}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Captions</Label>
                <div className="space-y-2">
                  <Textarea
                    value={currentCaption.text}
                    onChange={(e) => setCurrentCaption({
                      ...currentCaption,
                      text: e.target.value
                    })}
                    placeholder="Enter caption text..."
                  />
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={currentCaption.start}
                      onChange={(e) => setCurrentCaption({
                        ...currentCaption,
                        start: Number(e.target.value)
                      })}
                      placeholder="Start time"
                    />
                    <Input
                      type="number"
                      value={currentCaption.end}
                      onChange={(e) => setCurrentCaption({
                        ...currentCaption,
                        end: Number(e.target.value)
                      })}
                      placeholder="End time"
                    />
                    <Button onClick={handleAddCaption}>Add Caption</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {captions.map((caption, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-muted p-2 rounded">
                      <span>{caption.text}</span>
                      <span className="text-sm text-muted-foreground">
                        ({caption.start}s - {caption.end}s)
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCaptions(captions.filter((_, i) => i !== index));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Source</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload">
                <TabsList className="w-full">
                  <TabsTrigger value="upload" className="w-1/2">Upload</TabsTrigger>
                  <TabsTrigger value="youtube" className="w-1/2">YouTube</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {isDragActive
                        ? "Drop the video here"
                        : "Drag and drop your video here, or click to browse"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Supported formats: MP4, MOV, AVI (max 500MB)
                  </p>
                </TabsContent>
                <TabsContent value="youtube">
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Paste YouTube URL here"
                      />
                      <Button onClick={handleYouTubeUrlSubmit}>
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Blur Radius</Label>
                <Slider
                  value={[blurRadius]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={(values: number[]) => setBlurRadius(values[0])}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>None</span>
                  <span>Maximum</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="face-detection"
                  checked={autoDetectFaces}
                  onChange={(e) => setAutoDetectFaces(e.target.checked)}
                />
                <Label htmlFor="face-detection">
                  Automatically detect and center faces
                </Label>
              </div>

              <div>
                <Label>Output Quality</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                >
                  <option value="1080p">High (1080p)</option>
                  <option value="720p">Medium (720p)</option>
                  <option value="480p">Low (480p)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 