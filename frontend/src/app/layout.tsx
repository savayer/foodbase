import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/general/Navbar';
import Footer from '@/components/general/Footer';
import { Toaster } from '@/components/ui/toaster';
import SessionProvider from '@/components/SessionProvider';
import { getServerSession } from 'next-auth';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Foodbase',
  description: 'Food base and suggestions',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProvider session={session}>
          <Navbar />

          {children}
        </SessionProvider>

        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
