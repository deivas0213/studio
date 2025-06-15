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
import NextImage from "next/image"; 
import { useSubscription } from "@/contexts/SubscriptionContext";

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
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { canScan, showUpgradeModal } = useSubscription();

  const {
    control: urlControl,
    handleSubmit: handleUrlSubmit,
    formState: { errors: urlErrors },
    reset: resetUrlForm,
    setValue: setUrlValue,
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
        setFileName(file.name);
      } else {
        alert(validationResult.error.errors.map(e => e.message).join('\n'));
        setFilePreview(null);
        setFileName(null);
        if (event.target) event.target.value = ""; 
      }
    } else {
      setFilePreview(null);
      setFileName(null);
    }
  };

  const attemptAnalysis = (analysisFn: () => void) => {
    if (!canScan()) {
      showUpgradeModal();
      return;
    }
    analysisFn();
  };
  
  const onAnalyzeFile = () => {
    attemptAnalysis(() => {
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
    });
  };
  
  const onAnalyzeUrl = (data: { imageUrl: string }) => {
    attemptAnalysis(() => {
      onAnalyze({ url: data.imageUrl }, 'url');
      setFilePreview(null); 
      setFileName(null);
    });
  };

  const clearAllInputs = () => {
    setFilePreview(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    resetUrlForm();
    setUrlValue("imageUrl", "");
  };

  const commonButtonClass = "app-button text-lg py-3.5";
  const commonInputClass = "app-input h-12 text-base file:font-semibold file:border-0 file:bg-transparent file:text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg hover:file:bg-primary/10";


  return (
    <Card className="bg-card text-card-foreground shadow-lg rounded-20px border-0">
      <CardHeader className="pb-4 pt-6">
        <CardTitle className="text-2xl font-bold text-center text-primary flex items-center justify-center gap-2">
          <UploadCloud size={28} />
          Verify Image Source
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground pt-1">
          Upload from Gallery, use Camera, or paste a URL.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <Tabs defaultValue="gallery" className="w-full" onValueChange={(value) => {
          setActiveTab(value as "gallery" | "camera" | "url");
          clearAllInputs();
        }}>
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted p-1 rounded-lg">
            <TabsTrigger value="gallery" className="py-2.5 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md text-primary hover:bg-primary/10">
              <ImageIcon className="mr-2" />GALLERY
            </TabsTrigger>
            <TabsTrigger value="camera" className="py-2.5 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md text-primary hover:bg-primary/10">
              <CameraIcon className="mr-2" />CAMERA
            </TabsTrigger>
            <TabsTrigger value="url" className="py-2.5 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md text-primary hover:bg-primary/10">
              <Link2Icon className="mr-2" />LINK
            </TabsTrigger>
          </TabsList>

          <div className="space-y-6">
            {filePreview && (activeTab === "gallery" || activeTab === "camera") && (
              <div className="mb-4 p-3 border border-primary/20 rounded-lg bg-background flex flex-col justify-center items-center h-48 overflow-hidden">
                <NextImage src={filePreview} alt="Selected preview" width={180} height={180} className="max-h-40 w-auto object-contain rounded-md" data-ai-hint="upload preview" />
                {fileName && <p className="text-xs text-muted-foreground mt-2 truncate max-w-full px-2">{fileName}</p>}
              </div>
            )}

            <TabsContent value="gallery" className="m-0">
              <div className="space-y-4">
                <Label htmlFor="gallery-file" className="sr-only">Select from Gallery</Label>
                <Input id="gallery-file" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className={commonInputClass} />
                <Button onClick={onAnalyzeFile} disabled={isLoading || !filePreview} className={commonButtonClass}>
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : null} ANALYZE FROM GALLERY
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="camera" className="m-0">
              <div className="space-y-4">
                <Label htmlFor="camera-file" className="sr-only">Use Camera</Label>
                <Input id="camera-file" type="file" accept="image/*" capture="environment" onChange={handleFileChange} ref={cameraInputRef} className={commonInputClass} />
                 <Button onClick={onAnalyzeFile} disabled={isLoading || !filePreview} className={commonButtonClass}>
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : null} ANALYZE FROM CAMERA
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="url" className="m-0">
              <form onSubmit={handleUrlSubmit(onAnalyzeUrl)} className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl" className="sr-only">Image URL</Label>
                  <Controller
                    name="imageUrl"
                    control={urlControl}
                    render={({ field }) => <Input id="imageUrl" type="url" placeholder="Paste image link here..." {...field} className={`${commonInputClass} placeholder-muted-foreground/70`} />}
                  />
                  {urlErrors.imageUrl && <p className="text-sm text-destructive mt-2 px-1">{urlErrors.imageUrl.message}</p>}
                </div>
                <Button type="submit" disabled={isLoading} className={commonButtonClass}>
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : null} ANALYZE FROM LINK
                </Button>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
