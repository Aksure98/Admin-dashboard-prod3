import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  const handleClick = (href: string | undefined, e: React.MouseEvent) => {
    if (href && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2">
      {/* Home Icon */}
      <Link
        href="/dashboard"
        onClick={(e) => handleClick("/", e)}
        className="text-gray-400 hover:text-gray-600 transition-colors bg-brand-50 rounded-full p-2"
        aria-label="Home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M10 1.60938C10.4017 1.60938 10.7871 1.76881 11.0713 2.05273L17.3213 8.30273V8.30371C17.4625 8.44411 17.5752 8.61091 17.6514 8.79492C17.7275 8.9788 17.7662 9.176 17.7656 9.375V16.875C17.7656 17.1111 17.6718 17.3379 17.5049 17.5049C17.3379 17.6719 17.1112 17.7656 16.875 17.7656H3.125C2.88879 17.7656 2.66214 17.6719 2.49512 17.5049C2.32823 17.3379 2.23438 17.1111 2.23438 16.875V9.375C2.23378 9.176 2.27252 8.97879 2.34863 8.79492C2.42483 8.61092 2.53746 8.44411 2.67871 8.30371V8.30273L8.92871 2.05273C9.2129 1.7688 9.59827 1.60938 10 1.60938ZM15.9844 9.48535L10 3.50098L4.01562 9.48535V15.9844H15.9844V9.48535Z"
            fill="#0077B6"
            stroke="#0077B6"
            strokeWidth="0.09375"
          />
        </svg>
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {/* Separator */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M14.4124 10.6637L8.16242 16.9137C7.9863 17.0899 7.74743 17.1888 7.49836 17.1888C7.24929 17.1888 7.01042 17.0899 6.8343 16.9137C6.65818 16.7376 6.55923 16.4987 6.55923 16.2497C6.55923 16.0006 6.65818 15.7617 6.8343 15.5856L12.421 10.0005L6.83586 4.41374C6.74866 4.32653 6.67948 4.223 6.63228 4.10906C6.58509 3.99512 6.5608 3.873 6.5608 3.74967C6.5608 3.62635 6.58509 3.50422 6.63228 3.39028C6.67948 3.27634 6.74866 3.17282 6.83586 3.08561C6.92307 2.9984 7.0266 2.92923 7.14054 2.88203C7.25448 2.83484 7.3766 2.81055 7.49992 2.81055C7.62325 2.81055 7.74537 2.83484 7.85931 2.88203C7.97325 2.92923 8.07678 2.9984 8.16399 3.08561L14.414 9.33561C14.5013 9.42281 14.5705 9.52638 14.6177 9.6404C14.6649 9.75441 14.6891 9.87661 14.6889 10C14.6888 10.1234 14.6643 10.2455 14.6168 10.3594C14.5694 10.4733 14.4999 10.5767 14.4124 10.6637Z"
              fill="#D0D5DD"
            />
          </svg>

          {/* Breadcrumb Item */}
          {item.active || !item.href ? (
            <span
              className={`text-sm font-bold ${
                item.active ? "text-brand-600" : "text-grey-600 "
              }`}
            >
              {item.label}
            </span>
          ) : (
            <a
              href={item.href}
              onClick={(e) => handleClick(item.href, e)}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
