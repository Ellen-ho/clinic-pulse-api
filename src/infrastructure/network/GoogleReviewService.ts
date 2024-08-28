import axios from 'axios'
import dotenv from 'dotenv'
import { IGoogleReviewService } from 'domain/network/interfaces/IGoogleReviewService'
import dayjs from 'dayjs'
import { IReviewRepository } from 'domain/review/interfaces/repositories/IReviewRepository'
import { Review } from 'domain/review/Review'
import { IUuidService } from 'domain/utils/IUuidService'
import { NotificationHelper } from 'application/notification/NotificationHelper'
import { NotificationType } from 'domain/notification/Notification'
import { UserRoleType } from 'domain/user/User'

dotenv.config()

class GoogleReviewService implements IGoogleReviewService {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly uuidService: IUuidService,
    private readonly notificationHelper: NotificationHelper
  ) {}

  private async getLastFetchDate(): Promise<dayjs.Dayjs> {
    const lastReview = await this.reviewRepository.findLatestReview()
    if (lastReview !== null && lastReview !== undefined) {
      return dayjs(lastReview.isoDate)
    } else {
      return dayjs().subtract(1, 'day')
    }
  }

  private async updateLastFetchDate(): Promise<void> {
    console.log('Last fetch date updated')
  }

  async fetchAllGoogleReviews(): Promise<void> {
    try {
      let nextPageToken: string | null = null

      do {
        const params: {
          api_key: string | undefined
          engine: string
          place_id: string | undefined
          hl: string
          sort_by: string
          next_page_token: string | null
        } = {
          api_key: process.env.API_KEY,
          engine: 'google_maps_reviews',
          place_id: process.env.PLACE_ID,
          hl: 'zh-tw',
          sort_by: 'ratingLow',
          next_page_token: nextPageToken,
        }

        const url = 'https://serpapi.com/search.json'
        const response = await axios.get(url, { params })
        const reviews = Array.isArray(response.data.reviews)
          ? response.data.reviews
          : []

        for (const review of reviews) {
          const rating = parseFloat(review.rating)
          if (rating < 5) {
            const newReview = new Review({
              id: this.uuidService.generateUuid(),
              link: review.link,
              rating,
              date: review.date,
              isoDate: new Date(review.iso_date),
              isoDateOfLastEdit:
                typeof review.iso_date_of_last_edit === 'string'
                  ? new Date(review.iso_date_of_last_edit)
                  : null,
              reviewerName:
                typeof review.user?.name === 'string' &&
                review.user.name.trim() !== ''
                  ? review.user.name
                  : 'Anonymous',
              reviewerLink:
                typeof review.user?.link === 'string' &&
                review.user.link.trim() !== ''
                  ? review.user.link
                  : '',
              reviewerLocalGuide:
                typeof review.user?.local_guide === 'boolean'
                  ? review.user.local_guide
                  : false,
              snippet:
                typeof review.snippet === 'string' &&
                review.snippet.trim() !== ''
                  ? review.snippet
                  : null,
              extractedSnippet:
                typeof review.extracted_snippet?.original === 'string' &&
                review.extracted_snippet.original.trim() !== ''
                  ? review.extracted_snippet.original
                  : null,
              likes: typeof review.likes === 'number' ? review.likes : null,
              responseDate:
                typeof review.response?.date === 'string' &&
                review.response.date.trim() !== ''
                  ? review.response.date
                  : null,
              responseIsoDate:
                review.response?.iso_date !== undefined &&
                review.response.iso_date !== null
                  ? new Date(review.response.iso_date)
                  : null,
              responseIsoDateOfLastEdit:
                review.response?.iso_date_of_last_edit !== undefined &&
                review.response.iso_date_of_last_edit !== null
                  ? new Date(review.response.iso_date_of_last_edit)
                  : null,
              responseSnippet:
                typeof review.response?.snippet === 'string' &&
                review.response.snippet.trim() !== ''
                  ? review.response.snippet
                  : null,
              responseExtractedSnippet:
                typeof review.response?.extracted_snippet?.original ===
                  'string' &&
                review.response.extracted_snippet.original.trim() !== ''
                  ? review.response.extracted_snippet.original
                  : null,
              clinicId: '16458ab0-4bb6-4141-9bf0-6d7398942d9b',
            })

            await this.reviewRepository.save(newReview)
          }
        }

        nextPageToken =
          typeof response.data.serpapi_pagination?.next_page_token === 'string'
            ? response.data.serpapi_pagination.next_page_token
            : null
      } while (nextPageToken != null)

      console.log('All reviews have been saved to the database.')
    } catch (error) {
      console.error('Error fetching Google reviews:', error)
    }
  }

  async fetchNewGoogleReviews(): Promise<void> {
    const { user } = useUserContext()
    try {
      const lastFetchDate = await this.getLastFetchDate()

      let nextPageToken: string | null = null

      do {
        const params: {
          api_key: string | undefined
          engine: string
          place_id: string | undefined
          hl: string
          sort_by: string
          next_page_token: string | null
        } = {
          api_key: process.env.API_KEY,
          engine: 'google_maps_reviews',
          place_id: process.env.PLACE_ID,
          hl: 'zh-tw',
          sort_by: 'ratingLow',
          next_page_token: nextPageToken,
        }

        const url = 'https://serpapi.com/search.json'
        const response = await axios.get(url, { params })
        const reviews = Array.isArray(response.data.reviews)
          ? response.data.reviews
          : []

        for (const review of reviews) {
          const rating = parseFloat(review.rating)
          const reviewDate = dayjs(review.iso_date)

          if (rating < 5 && reviewDate.isAfter(lastFetchDate)) {
            const newReview = new Review({
              id: this.uuidService.generateUuid(),
              link: review.link,
              rating,
              date: review.date,
              isoDate: new Date(review.iso_date),
              isoDateOfLastEdit:
                typeof review.iso_date_of_last_edit === 'string'
                  ? new Date(review.iso_date_of_last_edit)
                  : null,
              reviewerName:
                typeof review.user?.name === 'string' &&
                review.user.name.trim() !== ''
                  ? review.user.name
                  : 'Anonymous',
              reviewerLink:
                typeof review.user?.link === 'string' &&
                review.user.link.trim() !== ''
                  ? review.user.link
                  : '',
              reviewerLocalGuide:
                typeof review.user?.local_guide === 'boolean'
                  ? review.user.local_guide
                  : false,
              snippet:
                typeof review.snippet === 'string' &&
                review.snippet.trim() !== ''
                  ? review.snippet
                  : null,
              extractedSnippet:
                typeof review.extracted_snippet?.original === 'string' &&
                review.extracted_snippet.original.trim() !== ''
                  ? review.extracted_snippet.original
                  : null,
              likes: typeof review.likes === 'number' ? review.likes : null,
              responseDate:
                typeof review.response?.date === 'string' &&
                review.response.date.trim() !== ''
                  ? review.response.date
                  : null,
              responseIsoDate:
                review.response?.iso_date !== undefined &&
                review.response.iso_date !== null
                  ? new Date(review.response.iso_date)
                  : null,
              responseIsoDateOfLastEdit:
                review.response?.iso_date_of_last_edit !== undefined &&
                review.response.iso_date_of_last_edit !== null
                  ? new Date(review.response.iso_date_of_last_edit)
                  : null,
              responseSnippet:
                typeof review.response?.snippet === 'string' &&
                review.response.snippet.trim() !== ''
                  ? review.response.snippet
                  : null,
              responseExtractedSnippet:
                typeof review.response?.extracted_snippet?.original ===
                  'string' &&
                review.response.extracted_snippet.original.trim() !== ''
                  ? review.response.extracted_snippet.original
                  : null,
              clinicId: '16458ab0-4bb6-4141-9bf0-6d7398942d9b',
            })

            await this.reviewRepository.save(newReview)

            if (user?.role === UserRoleType.ADMIN) {
              await this.notificationHelper.createNotification({
                title: '低於五星的評論',
                content: 'A new review with a rating below 5 has been posted.',
                notificationType: NotificationType.NEGATIVE_REVIEW,
                referenceId: newReview.id,
                user,
              })
            }
          }
        }

        nextPageToken =
          typeof response.data.serpapi_pagination?.next_page_token === 'string'
            ? response.data.serpapi_pagination.next_page_token
            : null
      } while (nextPageToken != null)

      await this.updateLastFetchDate()

      console.log('All new filtered reviews have been saved to the database.')
    } catch (error) {
      console.error('Error fetching Google reviews:', error)
    }
  }
}

export default GoogleReviewService
function useUserContext(): { user: any } {
  throw new Error('Function not implemented.')
}
