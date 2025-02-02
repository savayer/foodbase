import Link from 'next/link';
import NavAuthMenu from '@/components/general/NavAuthMenu';

export default async function Navbar() {
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
    <nav className="py-4 container flex gap-2">
      <ul className="flex gap-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.title}</Link>
          </li>
        ))}
      </ul>

      <div className="ml-auto">
        <NavAuthMenu />
      </div>
    </nav>
  );
}
