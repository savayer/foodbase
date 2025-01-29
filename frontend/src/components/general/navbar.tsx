import Link from 'next/link';
import { CircleUserRoundIcon } from 'lucide-react';

export default function Navbar() {
  const links = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'About',
      href: '/about',
    },
  ];

  return (
    <nav className="py-4 container">
      <ul className="flex gap-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.title}</Link>
          </li>
        ))}

        <li className="ml-auto">
          <Link href={'/login'} className="flex items-center gap-2">
            <CircleUserRoundIcon className="size-6" />
            Sign in
          </Link>
        </li>
      </ul>
    </nav>
  );
}
