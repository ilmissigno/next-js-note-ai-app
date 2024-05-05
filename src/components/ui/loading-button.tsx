import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "./button"

type LoadingButtonProps = {
    loading: boolean
} & ButtonProps

export default function LoadingButton({
    children,
    loading,
    ...props
} : LoadingButtonProps){
    return (
        <Button {...props} disabled={props.disabled || loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>}
            {children}
        </Button>
    )
}