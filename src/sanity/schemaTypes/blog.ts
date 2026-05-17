import { type SchemaTypeDefinition } from 'sanity'

export const blog: SchemaTypeDefinition = {
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
      description: 'Αυτό είναι το μικρό κείμενο/πρόταση που θα φαίνεται στην αρχική σελίδα ή στη λίστα των άρθρων πριν ο χρήστης κάνει κλικ.',
      rows: 3,
      validation: (Rule) => Rule.max(200).warning('Καλό είναι να μην ξεπερνάει τους 200 χαρακτήρες.'),
    },
    {
      name: 'content',
      type: 'array',
      title: 'Κείμενο Άρθρου (Rich Text Editor)',
      description: 'Γράψε το άρθρο σου εδώ. Μπορείς να προσθέσεις επικεφαλίδες, links, εικόνες ή embeds.',
      of: [
        // Ο κλασικός text editor για παραγράφους, λίστες, headers
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
        // Δυνατότητα εισαγωγής φωτογραφίας ΜΕΣΑ στο κείμενο
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
        // Custom Embed Object για YouTube / TikTok / Instagram Links
        {
          type: 'object',
          name: 'embedUrl',
          title: 'Social Media Embed (YouTube, TikTok, Instagram)',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'URL Συνδέσμου',
              description: 'Επικόλλησε το πλήρες link από το YouTube βίντεο, TikTok ή Instagram post.'
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