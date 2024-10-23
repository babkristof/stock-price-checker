import { z } from 'zod';

export const stockSymbolSchema = z.object({
    symbol: z
            .string()
            .min(1, "Symbol must be at least 1 character long")
            .max(5, "Symbol most not exceed 5 characters")
})