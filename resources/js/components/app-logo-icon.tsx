import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 2L1 7l11 5 9-4.09V14.5h2V7L12 2zm0 12c-2.33 0-4.43-.8-6.12-2.14L1 14.25v3.25c0 2.5 4.5 4.5 11 4.5s11-2 11-4.5v-3.25l-4.88-2.39C16.43 13.2 14.33 14 12 14z" />
        </svg>
    );
}
