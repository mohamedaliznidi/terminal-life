import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface CustomSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  trackBg?: string
  rangeBg?: string
  thumbBg?: string
  thumbBorder?: string
}

function CustomSlider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  trackBg,
  rangeBg,
  thumbBg,
  thumbBorder,
  ...props
}: CustomSliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
          trackBg && "[&]:bg-[var(--slider-track-bg)]"
        )}
        style={{
          '--slider-track-bg': trackBg || 'hsl(215.4 16.3% 46.9%)',
        } as React.CSSProperties}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            rangeBg && "[&]:bg-[var(--slider-range-bg)]"
          )}
          style={{
            '--slider-range-bg': rangeBg || 'hsl(222.2 84% 4.9%)',
          } as React.CSSProperties}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
            thumbBg && "[&]:bg-[var(--slider-thumb-bg)]",
            thumbBorder && "[&]:border-[var(--slider-thumb-border)]",
            "[&]:ring-[var(--slider-thumb-bg)]/50"
          )}
          style={{
            '--slider-thumb-bg': thumbBg || 'hsl(222.2 84% 4.9%)',
            '--slider-thumb-border': thumbBorder || 'hsl(222.2 84% 4.9%)',
          } as React.CSSProperties}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { CustomSlider }