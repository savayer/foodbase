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
import { ApiError, FetchWrapper } from '@/lib/fetchWrapper';
import { useSetCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function LoginForm() {
  const router = useRouter();
  const setCookie = useSetCookie();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      try {
        const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_API_URL);
        const res = (await fetchWrapper.post('/auth/login', data)) as {
          access_token: string;
        };

        if (res.access_token) {
          setCookie('access_token', res.access_token, {
            maxAge: 60 * 60 * 24 * 30,
          });
          router.push('/');
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

        <Button
          type="submit"
          className="w-full font-bold"
          disabled={isPending}
          size="lg"
        >
          Sign in
        </Button>
      </form>
    </Form>
  );
}
