import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config()

let SUPABASE_URL = process.env.SUPABASE_URL || ""
if (SUPABASE_URL.includes("/rest/v1")) {
  SUPABASE_URL = SUPABASE_URL.replace(/\/rest\/v1\/?$/, "")
}

const SUPABASE_KEY = process.env.SUPABASE_KEY || ""

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)