import { Inter } from 'next/font/google';
import Userbar from '@/Components/Navbar/Userbar';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body className={inter.className}>
          <Userbar />
          <main>{children}</main>
        </body>
      </html>
  );
}