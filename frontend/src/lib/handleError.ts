import { toast } from '@/components/hooks/use-toast';

export const handleError = (error: unknown) => {
  console.error(error);
  if (error instanceof Error) {
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
};
