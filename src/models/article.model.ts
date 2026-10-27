import { Document, model, Schema, Types } from "mongoose"

export interface IArticle extends Document {
  title: string
  content: string
  author: Types.ObjectId
  imageURL: string
  tags: string[]
  isVisible: boolean
  favorites: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

// _id -> Create from DB : ObjectID, UUID

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: Schema.ObjectId,
      ref: "system_users",
      required: true
    },
    imageURL: { type: String, default: "" },
    tags: { type: [String], default: [] },
    isVisible: { type: Boolean, default: true },
    favorites: [{ type: Schema.Types.ObjectId, ref: "system_users" }]
  },
  {
    timestamps: true
  }
)

export const Article = model<IArticle>("articles", articleSchema)