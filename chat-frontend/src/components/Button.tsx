import type { ReactElement } from "react";

interface ButtonProps {
    variant: 'primary' | 'secondary',
    title: string | ReactElement,
    size: 'sm' | 'md' | 'lg',
    startIcon?: ReactElement,
    endIcon?: ReactElement,
    onClick?: () => void,
    loading?: boolean,
    fullWidth?: boolean,
    type?: "button" | "submit" | "reset";
}

const sizeStyles = {
    "sm": "px-2 py-1 rounded-sm",
    "md": "px-4 py-2 rounded-sm",
    "lg": "px-6 py-3 rounded-sm",
}

const variantStyles = {
    "primary": "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 transition-transform duration-300",
    "secondary": "bg-purple-200 text-purple-600"
}

export const Button = ({variant, title, size, startIcon, endIcon, onClick, loading, fullWidth}: ButtonProps) => {
    return (
        <button type="button" onClick={onClick} className={`${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full flex justify-center items-center" : ""} ${loading ? "": "cursor-pointer"}`}>
            <div className="flex items-center">
                {startIcon}
                <div>
                    {title}
                </div>
                {endIcon}
            </div>
        </button>
    )
}