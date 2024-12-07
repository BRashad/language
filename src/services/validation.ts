import { z } from 'zod';

const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number()
});

const EtymologySchema = z.object({
  language: z.string(),
  word: z.string(),
  meaning: z.string(),
  year: z.number().optional(),
  script: z.string().optional()
});

const CognateSchema = z.object({
  language: z.string(),
  word: z.string(),
  meaning: z.string(),
  script: z.string().optional()
});

const WordResponseSchema = z.object({
  word: z.string(),
  language: z.string(),
  meanings: z.array(z.string()),
  etymology: z.array(EtymologySchema).optional(),
  cognates: z.array(CognateSchema).optional()
});

export function validateApiResponse(data: unknown): boolean {
  try {
    WordResponseSchema.parse(data);
    return true;
  } catch (error) {
    console.error('API response validation failed:', error);
    return false;
  }
}