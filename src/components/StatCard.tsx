
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: "cyan" | "magenta" | "mixed";
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  variant = "cyan",
  className,
}) => {
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden glass-card p-5 animate-fade-in transition-transform duration-300 hover:scale-105 group",
        variant === "cyan" && "border-neon-cyan/30 hover:border-neon-cyan/70",
        variant === "magenta" && "border-neon-magenta/30 hover:border-neon-magenta/70",
        variant === "mixed" && "border-neon-cyan/30 hover:border-neon-magenta/70",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-white/80 mb-1">{title}</h3>
          <p className={cn(
            "text-3xl font-bold mb-1",
            variant === "cyan" && "text-neon-cyan",
            variant === "magenta" && "text-neon-magenta",
            variant === "mixed" && "text-neon-cyan group-hover:text-neon-magenta transition-colors duration-300"
          )}>
            {value}
          </p>
          {description && (
            <p className="text-white/60 text-sm">{description}</p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-full",
          variant === "cyan" && "text-neon-cyan bg-neon-cyan/10",
          variant === "magenta" && "text-neon-magenta bg-neon-magenta/10",
          variant === "mixed" && "text-neon-cyan bg-neon-cyan/10 group-hover:text-neon-magenta group-hover:bg-neon-magenta/10 transition-colors duration-300"
        )}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
      </div>
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1",
        variant === "cyan" && "bg-neon-cyan/50",
        variant === "magenta" && "bg-neon-magenta/50",
        variant === "mixed" && "bg-gradient-to-r from-neon-cyan/50 to-neon-magenta/50"
      )} />
    </div>
  );
};

export default StatCard;
