export type Post = {
  id: string
  title: string
  created_at: string
  author_id: string
  latitude: number
  longitude: number
  description: string
  imageUrl?: string
  summary: string
  close_warning: string
  far_warning: string
  urgency: string
  radius: string
}
