'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { createDishAction, Dish, updateDishAction } from '@/actions/dishes';
import { Switch } from '@/components/ui/switch';
import ImageUploader from '@/components/general/ImageUploader';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { handleError } from '@/lib/handleError';

const IngredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  amount: z.string().optional(),
  unit: z.string().optional(),
});

const FormSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  description: z.string().min(5, 'Description is too short'),
  image: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size !== 0, 'Please upload an image'),
    z.string().url('Invalid image URL'),
  ]),
  isPublic: z.boolean(),
  ingredients: z.array(IngredientSchema).optional(),
});

type Props = {
  dish?: Dish;
};

export default function DishForm({ dish }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>(
    dish?.image || '',
  );
  const [imageChanged, setImageChanged] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: dish?.name || '',
      description: dish?.description || '',
      image: dish?.image || new File([''], 'filename'),
      isPublic: dish?.isPublic || true,
      ingredients: dish?.ingredients?.length
        ? dish?.ingredients
        : [{ name: '', amount: '', unit: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ingredients',
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

      if (data.ingredients && data.ingredients.length > 0) {
        const filteredIngredients = data.ingredients.filter(
          (ingredient) => ingredient.name.trim() !== '',
        );
        formData.append('ingredients', JSON.stringify(filteredIngredients));
      }

      try {
        if (dish) {
          if (typeof data.image === 'string') {
            formData.delete('image');
          }
          await updateDishAction(dish._id, formData);
          toast({ title: 'Success', description: 'Dish updated successfully' });
        } else {
          await createDishAction(formData);
          toast({ title: 'Success', description: 'Dish created successfully' });
        }

        router.push('/user/dishes');
      } catch (error: unknown) {
        handleError(error);
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
                <Textarea
                  placeholder="Short description"
                  className="min-h-44"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={() => (
            <ImageUploader
              preview={preview}
              onDrop={(acceptedFiles) => {
                onDrop(acceptedFiles);
                setImageChanged(true);
              }}
              existingImage={!imageChanged ? dish?.image : ''}
            />
          )}
        />

        <div>
          <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
            Ingredients
          </h3>

          <Card>
            <CardContent className="pt-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-y-2 gap-x-1 tablet:gap-x-2"
                >
                  <div className="flex grow flex-col tablet:flex-row gap-2 mb-4">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Ingredient name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="w-full tablet:w-24">
                          <FormControl>
                            <Input placeholder="Amount" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.unit`}
                      render={({ field }) => (
                        <FormItem className="w-full tablet:w-20">
                          <FormControl>
                            <Input placeholder="Unit" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ name: '', amount: '', unit: '' })}
              >
                <PlusCircle className="h-4 w-4" />
                Add Ingredient
              </Button>
            </CardContent>
          </Card>
        </div>

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
          {dish ? 'Update Dish' : 'Create Dish'}
        </Button>
      </form>
    </Form>
  );
}
