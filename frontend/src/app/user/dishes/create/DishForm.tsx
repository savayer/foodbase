'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/fetchWrapper';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { createDishAction } from '@/actions/dishes';
import { Switch } from '@/components/ui/switch';
import ImageUploader from '@/components/general/ImageUploader';

const FormSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  description: z.string().min(5, 'Description is too short'),
  image: z
    //Rest of validations done via react dropzone
    .instanceof(File)
    .refine((file) => file.size !== 0, 'Please upload an image'),
  isPublic: z.boolean(),
});

export default function DishForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>('');
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
      image: new File([''], 'filename'),
      isPublic: true,
    },
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();

      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue('image', acceptedFiles[0]);
        form.clearErrors('image');
      } catch (error: unknown) {
        setPreview(null);
        form.resetField('image');
        console.error(error);
      }
    },
    [form],
  );

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('image', data.image);
      formData.append('isPublic', String(data.isPublic));

      try {
        await createDishAction(formData);
        toast({ title: 'Success', description: 'Dish created successfully' });
        router.push('/user/dishes');
      } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
          toast({
            title: 'Error',
            description: error.message,
            className: 'bg-red-400 text-white',
          });
        } else {
          toast({
            title: 'Error',
            description: 'An unexpected error occurred',
            className: 'bg-red-400 text-white',
          });
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Dish name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Short description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={() => <ImageUploader preview={preview} onDrop={onDrop} />}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Public</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full font-bold"
          disabled={isPending}
          size="lg"
        >
          Create Dish
        </Button>
      </form>
    </Form>
  );
}
