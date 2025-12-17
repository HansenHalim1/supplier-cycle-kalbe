import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/orders", label: "Orders" },
];

export default function Navigation() {
  return (
    <header className="border-b bg-gradient-to-r from-white via-slate-50 to-blue-50 shadow-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Inventory Admin
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
