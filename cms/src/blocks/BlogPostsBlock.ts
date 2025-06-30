import { Block } from 'payload'

export const BlogPostsBlock: Block = {
  slug: 'blog-posts',
  interfaceName: 'BlogPostsBlock',
  labels: {
    singular: 'Blog Posts Block',
    plural: 'Blog Posts Blocks',
  },
  fields: [
    {
      // This virtual field makes the data directly available to the frontend when a document with the block is fetched
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      required: true,
      virtual: true,
      // As the value of the field is set by the hook, do not validate it
      validate: () => true,
      admin: {
        readOnly: true,
      },
      hooks: {
        afterRead: [
          async ({ req: { payload } }) => {
            const posts = await payload.find({
              collection: 'posts',
              limit: 0, // fetch all
              pagination: false,
              select: {
                // the id is automatically selected
              },
              where: {
                _status: {
                  equals: 'published',
                },
              },
              sort: 'createdAt',
            })

            return posts.docs.map((post) => post.id)
          },
        ],
      },
    },
  ],
}

export default BlogPostsBlock
