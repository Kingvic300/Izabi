import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/80 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-border/50 group-[.toaster]:shadow-[0_20px_50px_rgba(0,0,0,0.2)] group-[.toaster]:rounded-[20px] group-[.toaster]:p-4 group-[.toaster]:border group-[.toaster]:ring-1 group-[.toaster]:ring-white/10",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl group-[.toast]:font-bold",
          success: "group-[.toast]:border-green-500/50 group-[.toast]:bg-green-500/5",
          error: "group-[.toast]:border-red-500/50 group-[.toast]:bg-red-500/5",
          warning: "group-[.toast]:border-yellow-500/50 group-[.toast]:bg-yellow-500/5",
          info: "group-[.toast]:border-blue-500/50 group-[.toast]:bg-blue-500/5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
