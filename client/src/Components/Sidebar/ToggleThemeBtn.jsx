/* eslint-disable react/prop-types */
import { Moon, Sun } from "lucide-react";
import { Button } from "@/Components/ui/button";

const ToggleThemeBtn = ({ isDark, toggleTheme }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={toggleTheme}
    aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    title={isDark ? "Mode clair" : "Mode sombre"}
    className="text-muted-foreground hover:text-foreground"
  >
    {isDark ? <Sun /> : <Moon />}
  </Button>
);

export default ToggleThemeBtn;
