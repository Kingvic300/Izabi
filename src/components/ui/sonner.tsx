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
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-foreground/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:font-bold",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl group-[.toast]:font-bold",
          success: "group-[.toast]:border-primary/50 group-[.toast]:bg-primary/5",
          error: "group-[.toast]:border-destructive/50 group-[.toast]:bg-destructive/5",
          warning: "group-[.toast]:border-primary/30 group-[.toast]:bg-primary/5",
          info: "group-[.toast]:border-primary/50 group-[.toast]:bg-primary/5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
