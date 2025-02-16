import { format } from "date-fns";

interface LocalPost {
  id: number
  created_at: string
  author_id: string
  latitude: number
  longitude: number
  description: string
  title: string
  summary: string
  close_warning: string
  far_warning: string
  urgency: string
  radius: number
  distance: number
}

interface GeneratedReport {
  userDetails: {
    email: string
    generatedAt: string
  }
  locationDetails: {
    latitude: number
    longitude: number
  }
  incidents: {
    total: number
    urgentCount: number
    list: string[]
  }
  safetyScore: {
    score: number
    description: string
  }
  recommendations: string[]
}

export function generateReport(localPosts: LocalPost[], latitude: number, longitude: number, email: string): GeneratedReport {
  const now = new Date()

  // Sort posts by urgency and distance
  const sortedPosts = localPosts.sort((a, b) => {
    if (a.urgency === "Red" && b.urgency !== "Red") return -1
    if (a.urgency !== "Red" && b.urgency === "Red") return 1
    return a.distance - b.distance
  })

  const urgentCount = sortedPosts.filter((post) => post.urgency === "Red").length

  const safetyScore = calculateSafetyScore(sortedPosts)

  const report: GeneratedReport = {
    userDetails: {
      email,
      generatedAt: format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    },
    locationDetails: {
      latitude,
      longitude,
    },
    incidents: {
      total: sortedPosts.length,
      urgentCount,
      list: sortedPosts.map((post) => `${post.title} (${post.urgency})`),
    },
    safetyScore: {
      score: safetyScore,
      description: getSafetyDescription(safetyScore),
    },
    recommendations: generateRecommendations(sortedPosts),
  }

  return report
}

function calculateSafetyScore(posts: LocalPost[]): number {
  const baseScore = 10
  const urgentPenalty = 2
  const nonUrgentPenalty = 0.5

  const totalPenalty = posts.reduce((acc, post) => {
    return acc + (post.urgency === "Red" ? urgentPenalty : nonUrgentPenalty)
  }, 0)

  const score = Math.max(0, Math.min(10, baseScore - totalPenalty))
  return Number(score.toFixed(1))
}

function getSafetyDescription(score: number): string {
  if (score >= 9) return "Very safe area with minimal incidents"
  if (score >= 7) return "Generally safe area with moderate incident rate"
  if (score >= 5) return "Exercise caution - moderate to high incident rate"
  if (score >= 3) return "Be alert - high incident rate"
  return "Exercise extreme caution - very high incident rate"
}

function generateRecommendations(posts: LocalPost[]): string[] {
  const recommendations = new Set<string>()

  recommendations.add("Stay aware of your surroundings, especially at night")
  recommendations.add("Report any suspicious activity to local authorities")

  if (posts.some((post) => post.urgency === "Red")) {
    recommendations.add("Be extra vigilant due to recent urgent incidents in the area")
  }

  if (
    posts.some((post) => post.title.toLowerCase().includes("theft") || post.description.toLowerCase().includes("theft"))
  ) {
    recommendations.add("Keep valuables secure and out of sight")
  }

  return Array.from(recommendations)
}

