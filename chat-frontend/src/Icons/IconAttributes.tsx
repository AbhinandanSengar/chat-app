export interface IconProps {
    size: "xs" | "sm" | "md" | "lg",
    onClick?: () => void
}

export const iconSizeStyles = {
    "xs": "size-4",
    "sm": "size-5",
    "md": "size-8",
    "lg": "size-10"
}