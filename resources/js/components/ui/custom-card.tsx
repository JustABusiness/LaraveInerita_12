import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface CustomCardProps {
    loading?: boolean;
    title?: string;
    description?: string;
    height?: string;
    isShowHeader?: boolean;
    isShowFooter?: boolean;
    children?: React.ReactNode;
    footerChildren?: React.ReactNode;
    className?: string;
}
const CustomCard = ({
    loading,
    title,
    description,
    height,
    isShowHeader,
    isShowFooter,
    children,
    footerChildren,
    className,
}: CustomCardProps) => {
    return (
        <Card
            className={`relative overflow-hidden rounded-[5px] pt-[20px] ${className}`}
        >
            {isShowHeader && (
                <CardHeader className="mb-6 border-b border-zinc-100">
                    <CardTitle className="font-bold tracking-tight text-zinc-900 uppercase">
                        {title}
                    </CardTitle>
                    <CardDescription className="font-medium text-zinc-500">
                        {description}
                    </CardDescription>
                </CardHeader>
            )}
            <CardContent className={`${height ?? 'h-[48]'}`}>
                {children}
            </CardContent>
            {isShowFooter && (
                <CardFooter className="flex justify-center">
                    {footerChildren}
                </CardFooter>
            )}
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-black/40">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
            )}
        </Card>
    );
};

export default CustomCard;
