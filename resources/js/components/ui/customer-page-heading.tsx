import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';

interface CustomPageHeadingProps {
    heading: string;
    breadcrumbs: BreadcrumbItem[];
}

const CustomPageHeading = ({
    heading,
    breadcrumbs,
}: CustomPageHeadingProps) => {
    return (
        <div className="page-heading border-b border-zinc-200 bg-white px-6 py-6 shadow-sm">
            {heading && (
                <h2 className="mb-2 text-[20px] font-bold tracking-tight text-zinc-900 uppercase">
                    {heading}
                </h2>
            )}
            <ol className="custom-breadcrumb flex items-center gap-2 text-sm text-zinc-500">
                {breadcrumbs.map((item, index) => (
                    <li key={item.title} className="flex items-center gap-2">
                        <Link
                            href={item.href}
                            className={`transition-colors hover:text-indigo-600 ${index === breadcrumbs.length - 1 ? 'font-medium text-zinc-900' : ''}`}
                        >
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default CustomPageHeading;
