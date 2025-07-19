import { forwardRef, type InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    placeholder: string
    type: string,
    reference?: any
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({placeholder, type, ...rest}, reference) => {
    return (
        <input ref={reference} type={type} placeholder={placeholder} {...rest} className='w-full bg-transparent border border-[#262626] rounded-sm flex-1 px-4 py-2 outline-none text-lg font-medium' />
    )
});