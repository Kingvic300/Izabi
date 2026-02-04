import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "pidgin" : "en")}
      className="rounded-xl px-3 h-10 glass border border-foreground/10 flex items-center gap-2 font-bold transition-all"
    >
      <Globe size={16} className="text-primary" />
      <span className="text-xs uppercase tracking-widest">
        {language === "en" ? "English" : "Pidgin"}
      </span>
    </Button>
  )
}
