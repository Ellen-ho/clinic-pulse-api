export interface IGoogleReviewService {
  fetchAllGoogleReviews: () => Promise<void>
  fetchNewGoogleReviews: () => Promise<void>
}
