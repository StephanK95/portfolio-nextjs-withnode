"use client";

import Link from "next/link";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="navbar-fixed flex justify-center sm:justify-center">
      <nav className="nav-pill rounded-full px-6 sm:px-8 py-3 flex items-center">
        <ul className="flex gap-8 sm:gap-10 text-sm font-medium text-white/90">
          <li>
            <Link href="#about" className="font-semibold text-white hover:text-white transition-colors">
              About
            </Link>
          </li>
          {links.slice(1).map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
