import { type SchemaTypeDefinition } from 'sanity'

// 1. Fun Fact Schema
const funFact: SchemaTypeDefinition = {
  name: 'funFact',
  title: 'Fun Fact',
  type: 'document',
  fields: [
    { 
      name: 'category', 
      type: 'string', 
      title: 'Κατηγορία',
      options: {
        list: [
          { title: 'Music', value: 'music' },
          { title: 'Cinema', value: 'cinema' },
          { title: 'History', value: 'history' },
          { title: 'Trivia', value: 'trivia' },
        ],
        layout: 'radio'
      }
    },
    { 
      name: 'factText', 
      type: 'text', 
      title: 'Κείμενο Fun Fact',
      rows: 3
    },
    { 
      name: 'image', 
      type: 'image', 
      title: 'Εικόνα', 
      options: { hotspot: true } 
    },
    {
      name: 'internalName',
      type: 'string',
      title: 'Όνομα (Εσωτερική χρήση)',
    }
  ],
  preview: {
    select: {
      title: 'internalName',
      subtitle: 'category',
      media: 'image'
    }
  }
}

// 2. Quiz Schema
const quiz: SchemaTypeDefinition = {
  name: 'quiz',
  title: 'Quiz',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Τίτλος Quiz',
      description: 'π.χ. Πόσο καλά ξέρεις τα 00s;'
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' }
    },
    {
      name: 'featuredImage',
      type: 'image',
      title: 'Featured Image (Κεντρική Εικόνα)',
      description: 'Η εικόνα εξωφύλλου του Quiz',
      options: { hotspot: true }
    },
    {
      name: 'questions',
      type: 'array',
      title: 'Ερωτήσεις',
      of: [
        {
          type: 'object',
          name: 'question',
          title: 'Ερώτηση',
          fields: [
            { name: 'questionText', type: 'string', title: 'Ερώτηση' },
            { 
              name: 'questionImage', 
              type: 'image', 
              title: 'Εικόνα Ερώτησης (Προαιρετική)', 
              options: { hotspot: true } 
            },
            {
              name: 'answers',
              type: 'array',
              title: 'Απαντήσεις',
              of: [
                {
                  type: 'object',
                  name: 'answer',
                  title: 'Απάντηση',
                  fields: [
                    { name: 'text', type: 'string', title: 'Κείμενο Απάντησης' },
                    { name: 'isCorrect', type: 'boolean', title: 'Είναι η σωστή;', initialValue: false }
                  ]
                }
              ],
              validation: (Rule) => Rule.min(2).max(4)
            }
          ],
          preview: {
            select: {
              title: 'questionText',
              media: 'questionImage'
            }
          }
        }
      ]
    },
    {
      name: 'results',
      type: 'array',
      title: 'Μηνύματα Αποτελεσμάτων (Σκορ)',
      description: 'Ορίστε τι θα εμφανίζεται στον χρήστη ανάλογα με τις σωστές απαντήσεις που συγκέντρωσε.',
      of: [
        {
          type: 'object',
          name: 'resultScore',
          title: 'Αποτέλεσμα βάσει Σκορ',
          fields: [
            { 
              name: 'minScore', 
              type: 'number', 
              title: 'Ελάχιστο Σκορ (Σωστές Απαντήσεις)',
              description: 'π.χ. 0'
            },
            { 
              name: 'maxScore', 
              type: 'number', 
              title: 'Μέγιστο Σκορ (Σωστές Απαντήσεις)',
              description: 'π.χ. 3'
            },
            { 
              name: 'title', 
              type: 'string', 
              title: 'Τίτλος Αποτελέσματος', 
              description: 'π.χ. Απογοήτευση! ή Είσαι Θεός!' 
            },
            { 
              name: 'text', 
              type: 'text', 
              title: 'Λόγια / Σχόλιο', 
              rows: 3,
              description: 'Το κείμενο που θα διαβάσει ο χρήστης.'
            }
          ],
          preview: {
            select: {
              title: 'title',
              min: 'minScore',
              max: 'maxScore'
            },
            prepare({ title, min, max }) {
              return {
                title: title,
                subtitle: `Για σωστές απαντήσεις από: ${min} έως ${max}`
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'featuredImage'
    }
  }
}

// 3. Blog Schema
const blog: SchemaTypeDefinition = {
  name: 'blog',
  title: 'Άρθρα (Blog)',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Τίτλος Άρθρου',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'featuredImage',
      type: 'image',
      title: 'Κεντρική Εικόνα (Featured Image)',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      type: 'text',
      title: 'Πρόταση Προεπισκόπησης (Excerpt)',
      description: 'Το κείμενο/πρόταση που θα φαίνεται στην αρχική σελίδα ή στη λίστα των άρθρων.',
      rows: 3,
      validation: (Rule) => Rule.max(200).warning('Καλό είναι να μην ξεπερνάει τους 200 χαρακτήρες.'),
    },
    {
      name: 'content',
      type: 'array',
      title: 'Κείμενο Άρθρου (Rich Text Editor)',
      description: 'Γράψε το άρθρο σου. Μπορείς να βάλεις κείμενο, ενδιάμεσες φωτογραφίες ή embeds.',
      of: [
        { 
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ]
        },
        {
          type: 'image',
          title: 'Εικόνα ενδιάμεσα στο κείμενο',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text (Για SEO)',
            }
          ]
        },
        {
          type: 'object',
          name: 'embedUrl',
          title: 'Social Media Embed (YouTube, TikTok, Instagram)',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'URL Συνδέσμου',
              description: 'Επικόλλησε το πλήρες link από το YouTube, TikTok ή Instagram.'
            },
            {
              name: 'platform',
              type: 'string',
              title: 'Πλατφόρμα',
              options: {
                list: [
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'Instagram', value: 'instagram' },
                ],
                layout: 'radio'
              }
            }
          ],
          preview: {
            select: {
              url: 'url',
              platform: 'platform'
            },
            prepare({ url, platform }) {
              return {
                title: `${platform ? platform.toUpperCase() : 'Embed'} Video/Post`,
                subtitle: url || 'Δεν έχει προστεθεί link'
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'featuredImage',
      subtitle: 'excerpt'
    }
  }
}

// Εξαγωγή όλων των schemas μαζί
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [funFact, quiz, blog],
}