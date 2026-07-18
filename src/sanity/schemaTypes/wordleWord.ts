import { SchemaTypeDefinition } from 'sanity';

export const wordleWord: SchemaTypeDefinition = {
  name: 'wordleWord',
  title: 'Wordle - Λέξεις',
  type: 'document',
  fields: [
    {
      name: 'word',
      type: 'string',
      title: 'Λέξη (5 κεφαλαία ελληνικά γράμματα, χωρίς τόνους)',
      validation: (Rule) =>
        Rule.required()
          .length(5)
          .regex(/^[Α-Ω]{5}$/, { name: 'greek-caps' })
          .error('Ακριβώς 5 κεφαλαία ελληνικά γράμματα, χωρίς τόνους (π.χ. ΣΠΙΤΙ)'),
    },
  ],
  preview: {
    select: { title: 'word' },
  },
};