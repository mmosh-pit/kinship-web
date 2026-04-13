import { gcsStorage } from "@payloadcms/storage-gcs";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";
import { buildConfig } from "payload";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};

const Media: CollectionConfig = {
  slug: "media",
  upload: true,
  admin: {
    useAsTitle: "filename",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
    },
  ],
};

const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "author", "publishedAt"],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly identifier, e.g. my-first-post",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Excerpt",
      admin: {
        description: "Short summary shown in post listings",
      },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      label: "Featured Image",
    },
    {
      name: "content",
      type: "richText",
      label: "Content",
      editor: lexicalEditor({}),
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      label: "Author",
    },
    {
      name: "tags",
      type: "array",
      label: "Tags",
      fields: [
        {
          name: "tag",
          type: "text",
        },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Published At",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
  ],
};

export default buildConfig({
  admin: {
    user: "users",
  },
  collections: [Users, Media, Posts],
  editor: lexicalEditor({}),
  plugins: [
    gcsStorage({
      collections: {
        media: {
          prefix: "payload",
          disablePayloadAccessControl: true,
        },
      },
      acl: "Public",
      bucket: process.env.GCS_BUCKET || "",
      options: {
        credentials: JSON.parse(
          Buffer.from(process.env.GCS_CREDENTIALS_BASE64 || "", "base64").toString("utf-8")
        ),
      },
    }),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    schemaName: "payload",
  }),
  secret: process.env.PAYLOAD_SECRET || "",
});
