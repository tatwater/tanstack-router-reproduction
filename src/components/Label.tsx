import type { ComponentPropsWithoutRef, ElementRef } from 'react'

import { forwardRef } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={className}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
