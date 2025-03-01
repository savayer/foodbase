'use client';

import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImagePlus } from 'lucide-react';

type Props = {
  preview: string | ArrayBuffer | null;
  onDrop: (acceptedFiles: File[]) => void;
  existingImage?: string;
};

export default function ImageUploader({
  preview,
  onDrop,
  existingImage,
}: Props) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { 'image/png': [], 'image/jpg': [], 'image/jpeg': [] },
    });

  return (
    <FormItem>
      <FormLabel
        className={`${fileRejections.length !== 0 && 'text-destructive'}`}
      >
        Upload your image
      </FormLabel>

      <FormControl>
        <div
          {...getRootProps()}
          className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-sm shadow-foreground"
        >
          {preview ? (
            <img
              src={preview as string}
              alt="Uploaded image"
              className="max-h-52 rounded-lg"
            />
          ) : (
            existingImage && (
              <img
                src={existingImage as string}
                alt="Uploaded image"
                className="max-h-52 rounded-lg"
              />
            )
          )}
          <ImagePlus
            className={`size-20 stroke-neutral-500 ${preview ? 'hidden' : 'block'}`}
          />
          <Input {...getInputProps()} type="file" />
          {isDragActive ? (
            <p>Drop the image!</p>
          ) : (
            <p>Click here or drag an image to upload it</p>
          )}
        </div>
      </FormControl>

      <FormMessage>
        {fileRejections.length !== 0 && (
          <p>Image must be less than 1MB and of type png, jpg, or jpeg</p>
        )}
      </FormMessage>
    </FormItem>
  );
}
