import { cn } from "~/utils/misc";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";

type RadixIconProps = IconProps;

const navigation = [
  {
    name: "GitHub",
    href: "https://github.com/ayuthmang/lang-switcher",
    icon: (props: RadixIconProps) => <GitHubLogoIcon {...props} />,
  },
];

function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn(className)}>
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-center lg:px-8">
        <div className="flex justify-center gap-x-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-300"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="h-8 w-8" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
