import { cn } from "../../lib/utils";

interface GradientBackgroundProps {
  className?: string;
}

export const GradientBackground = ({ className }: GradientBackgroundProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full [background:radial-gradient(125%_125%_at_50%_-20%,#3b82f620_40%,transparent_100%)]",
        className
      )}
    />
  );
};
