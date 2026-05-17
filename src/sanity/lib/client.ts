import { createClient } from 'next-sanity'

// Κρατάμε το apiVersion από το env αρχείο σου αν θέλεις, 
// αλλά τραβάμε τα IDs απευθείας για απόλυτη σιγουριά στο Vercel
import { apiVersion } from '../env'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: apiVersion || '2024-01-01', 
  useCdn: false, // 👈 Το γυρνάμε σε false για να φέρνει ΠΑΝΤΑ live τα published data
})
