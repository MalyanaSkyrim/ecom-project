import { z } from 'zod'

// No input schema needed for newArrivals query since we're using fixed parameters
// Just exporting an empty object schema for consistency
export const newArrivalsInputSchema = z.object({})

export type NewArrivalsInput = z.infer<typeof newArrivalsInputSchema>
