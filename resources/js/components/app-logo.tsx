import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-indigo-650 flex aspect-square size-8 items-center justify-center rounded-md text-white dark:bg-indigo-500">
                <AppLogoIcon className="size-5 text-white" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-bold text-neutral-900 dark:text-white">
                    IELTS Center
                </span>
                <span className="truncate text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                    Admin Portal
                </span>
            </div>
        </>
    );
}
