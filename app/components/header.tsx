import { Link } from "@remix-run/react";
import { SwitchIcon } from "@radix-ui/react-icons";
import { cn } from "~/utils/misc";

const navigation = [
  { name: "Example", href: "example" },
  { name: "GitHub", href: "https://github.com/ayuthmang/lang-switcher" },
];

function Header({ className }: { className?: string }) {
  return (
    <header className={cn("bg-gray-900", className)}>
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex flex-1 items-center gap-8">
          <Logo />
          <div />
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm/6 font-semibold text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-x-2", className)}>
      <SwitchIcon className="h-6 w-6 text-white" />
      <span className="text-base font-semibold text-white">Lang Switcher</span>
    </Link>
  );
}

export default Header;
