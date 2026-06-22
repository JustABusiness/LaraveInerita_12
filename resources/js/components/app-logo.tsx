import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-indigo-650 flex aspect-square size-10 items-center justify-center rounded-md text-white dark:bg-indigo-500 animate-wobble">
                <AppLogoIcon className="size-6 text-white" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-xs leading-tight">
                <span className="text-[16px] truncate font-bold text-neutral-900 dark:text-white">
                    V-AELTIS Center
                </span>
                <span className="truncate text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
                    Admin Portal
                </span>
            </div>
        </>
    );
}