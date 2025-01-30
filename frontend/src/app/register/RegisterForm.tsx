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
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, FetchWrapper } from '@/lib/fetchWrapper';

const FormSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email(),
    password: z
      .string()
      .min(6)
      .refine((password) => /[0-9]/.test(password), {
        message: 'Password must contain at least one number',
      }),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_API_URL);
    startTransition(async () => {
      try {
        const res = (await fetchWrapper.post('/auth/register', data)) as {
          name: string;
          email: string;
        };

        if (res.name === data.name && res.email === data.email) {
          toast({
            title: 'Success',
            description: 'You have successfully registered. You can now login.',
            className: 'bg-green-400 text-white',
          });

          router.push('/login');
        }
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
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm your password"
                  type="password"
                  {...field}
                />
              </FormControl>
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
          Sign up
        </Button>
      </form>
    </Form>
  );
}
