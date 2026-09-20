import React from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, className, ...props }) => {
  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        id={id}
        className={cn(
          "w-4 h-4 text-brand-pink bg-background border-border rounded focus:ring-2 focus:ring-brand-pink/20 focus:ring-offset-1 transition-colors cursor-pointer accent-brand-pink",
          className
        )}
        {...props}
      />
    </div>
  )
}

export default Checkbox
