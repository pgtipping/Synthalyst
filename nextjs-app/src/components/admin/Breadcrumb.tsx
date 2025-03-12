import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumb() {
  const pathname = usePathname();

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname
      .split("/")
      .filter((path) => path)
      .map((path) => ({
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
        href: `/${pathname
          .split("/")
          .slice(1, pathname.split("/").indexOf(path) + 1)
          .join("/")}`,
      }));

    // Add home as the first item
    return [{ label: "Home", href: "/" }, ...paths];
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav
      className="flex items-center space-x-1 text-sm text-gray-600 mb-6"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <Fragment key={breadcrumb.href}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          )}
          <Link
            href={breadcrumb.href}
            className={`hover:text-gray-900 ${
              index === breadcrumbs.length - 1
                ? "font-medium text-gray-900"
                : ""
            }`}
          >
            {breadcrumb.label}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
