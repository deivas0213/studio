"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageIcon, CameraIcon, Link2Icon, Loader2, UploadCloud } from "lucide-react";
import { ChangeEvent, useState, useRef } from "react";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileSchema = z.any()
  .refine((file): file is File => file instanceof File, "Image is required.")
  .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file?.type),
    "Only .jpg, .png, .webp, and .gif formats are supported."
  ).nullable();

const urlSchema = z.object({
  imageUrl: z.string().url("Please enter a valid URL.").min(1, "URL cannot be empty."),
});

type ImageUploaderProps = {
  onAnalyze: (data: { file?: File; url?: string }, type: 'file' | 'url') => void;
  isLoading: boolean;
};

export function ImageUploader({ onAnalyze, isLoading }: ImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<"gallery" | "camera" | "url">("gallery");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const {
    control: urlControl,
    handleSubmit: handleUrlSubmit,
    formState: { errors: urlErrors },
    reset: resetUrlForm,
  } = useForm<{ imageUrl: string }>({
    resolver: zodResolver(urlSchema),
    defaultValues: { imageUrl: "" },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationResult = fileSchema.safeParse(file);
      if (validationResult.success) {
        setFilePreview(URL.createObjectURL(file));
        // No direct submission here, user clicks "Analyze" button
      } else {
        // Display error, ideally using react-hook-form for file input too
        alert(validationResult.error.errors.map(e => e.message).join('\n'));
        setFilePreview(null);
        if (event.target) event.target.value = ""; // Clear the input
      }
    } else {
      setFilePreview(null);
    }
  };

  const onAnalyzeFile = () => {
    const currentFile = activeTab === 'gallery' 
      ? fileInputRef.current?.files?.[0]
      : cameraInputRef.current?.files?.[0];

    if (currentFile) {
      const validationResult = fileSchema.safeParse(currentFile);
      if (validationResult.success) {
        onAnalyze({ file: currentFile }, 'file');
      } else {
         alert(validationResult.error.errors.map(e => e.message).join('\n'));
      }
    } else {
      alert("Please select an image file.");
    }
  };
  
  const onAnalyzeUrl = (data: { imageUrl: string }) => {
    onAnalyze({ url: data.imageUrl }, 'url');
    setFilePreview(null); 
  };

  const clearPreviewAndInput = () => {
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    resetUrlForm();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <UploadCloud className="text-primary" />
          Upload Image for Analysis
        </CardTitle>
        <CardDescription>
          Choose an image from your gallery, capture one with your camera, or provide a URL.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gallery" className="w-full" onValueChange={(value) => {
          setActiveTab(value as "gallery" | "camera" | "url");
          clearPreviewAndInput();
        }}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="gallery"><ImageIcon className="mr-2" />Gallery</TabsTrigger>
            <TabsTrigger value="camera"><CameraIcon className="mr-2" />Camera</TabsTrigger>
            <TabsTrigger value="url"><Link2Icon className="mr-2" />URL</TabsTrigger>
          </TabsList>

          {filePreview && (activeTab === "gallery" || activeTab === "camera") && (
            <div className="mb-4 p-4 border rounded-md bg-muted/50 flex justify-center items-center max-h-60 overflow-hidden">
              <Image src={filePreview} alt="Selected preview" width={200} height={200} className="max-h-52 w-auto object-contain rounded-md" />
            </div>
          )}

          <TabsContent value="gallery">
            <div className="space-y-4">
              <Label htmlFor="gallery-file" className="text-base">Select from Gallery</Label>
              <Input id="gallery-file" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              {filePreview && <Button onClick={onAnalyzeFile} disabled={isLoading} className="w-full text-base py-3">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null} Analyze from Gallery
              </Button>}
            </div>
          </TabsContent>

          <TabsContent value="camera">
            <div className="space-y-4">
              <Label htmlFor="camera-file" className="text-base">Use Camera</Label>
              <Input id="camera-file" type="file" accept="image/*" capture="environment" onChange={handleFileChange} ref={cameraInputRef} className="text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              {filePreview && <Button onClick={onAnalyzeFile} disabled={isLoading} className="w-full text-base py-3">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null} Analyze from Camera
              </Button>}
            </div>
          </TabsContent>

          <TabsContent value="url">
            <form onSubmit={handleUrlSubmit(onAnalyzeUrl)} className="space-y-4">
              <div>
                <Label htmlFor="imageUrl" className="text-base">Image URL</Label>
                <Controller
                  name="imageUrl"
                  control={urlControl}
                  render={({ field }) => <Input id="imageUrl" type="url" placeholder="https://example.com/image.png" {...field} className="text-base" />}
                />
                {urlErrors.imageUrl && <p className="text-sm text-destructive mt-1">{urlErrors.imageUrl.message}</p>}
              </div>
              <Button type="submit" disabled={isLoading} className="w-full text-base py-3">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null} Fetch & Analyze URL
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
