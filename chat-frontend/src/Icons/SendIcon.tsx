import { iconSizeStyles, type IconProps } from "./IconAttributes";

export const SendIcon = ({size, ...rest}: IconProps & React.SVGProps<SVGSVGElement>) => {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`${iconSizeStyles[size]} text-purple-700 hover:text-purple-900 cursor-pointer outline-none`} {...rest} role="button" tabIndex={0}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
}