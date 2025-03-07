
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "magenta" | "outline";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = "cyan",
  size = "default",
  children,
  className,
  animated = true,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "cyan":
        return "bg-neon-cyan text-dark hover:bg-neon-cyan/90 focus:ring-neon-cyan/20";
      case "magenta":
        return "bg-neon-magenta text-white hover:bg-neon-magenta/90 focus:ring-neon-magenta/20";
      case "outline":
        return "bg-transparent border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10";
      default:
        return "bg-neon-cyan text-dark hover:bg-neon-cyan/90 focus:ring-neon-cyan/20";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-1 px-3 text-sm";
      case "lg":
        return "py-3 px-8 text-lg";
      default:
        return "py-2 px-6";
    }
  };

  return (
    <Button
      className={cn(
        "relative font-medium rounded-md transition-all duration-300 transform",
        "focus:outline-none focus:ring-4 focus:ring-opacity-50",
        getVariantClasses(),
        getSizeClasses(),
        animated && "hover:scale-105 active:scale-95",
        animated && variant === "cyan" && "hover:shadow-[0_0_20px_rgba(0,209,255,0.7)]",
        animated && variant === "magenta" && "hover:shadow-[0_0_20px_rgba(255,0,122,0.7)]",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default AnimatedButton;
