import { supabase } from "../config/superbase"
import crypto from "crypto"
// npm install crypto

export const uploadImage = async (
  file: Express.Multer.File,
  bucketName: string = "articles"
): Promise<string> => {
  try {
    const uuid = crypto.randomUUID()
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "-")
    const fileName = `${uuid}-${sanitizedName}`

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, { contentType: file.mimetype })

    if (error) {
      console.warn("Supabase upload warning, using base64 fallback:", error.message)
      return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)
    return data.publicUrl
  } catch (err: any) {
    console.warn("Supabase upload error, using base64 fallback:", err?.message || err)
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
  }
}