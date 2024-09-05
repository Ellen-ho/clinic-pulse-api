import axios from 'axios'
import dotenv from 'dotenv'
import { IGoogleReviewService } from '../../domain/network/interfaces/IGoogleReviewService'
import dayjs from 'dayjs'
import { IReviewRepository } from '../../domain/review/interfaces/repositories/IReviewRepository'
import { Review } from '../../domain/review/Review'
import { IUuidService } from '../../domain/utils/IUuidService'
import { NotificationHelper } from '../../application/notification/NotificationHelper'
import { NotificationType } from '../../domain/notification/Notification'
import { RedisServer } from '../../infrastructure/database/RedisServer'
import { UserRepository } from '../../infrastructure/entities/user/UserRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

dotenv.config()

class GoogleReviewService implements IGoogleReviewService {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly uuidService: IUuidService,
    private readonly notificationHelper: NotificationHelper,
    private readonly redis: RedisServer,
    private readonly userRepository: UserRepository
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
    try {
      const currentDate = dayjs().toISOString()
      await this.redis.set('lastFetchDate', currentDate, {
        expiresInSec: 86400,
      })
      console.log('Last fetch date updated in Redis')
    } catch (error) {
      console.error('Failed to update last fetch date in Redis:', error)
    }
  }

  private async fetchReviewsForLocation(
    placeId: string,
    clinicId: string,
    lastFetchDate: dayjs.Dayjs | null = null
  ): Promise<void> {
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
          place_id: placeId,
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

          if (
            rating < 5 &&
            (lastFetchDate === null || reviewDate.isAfter(lastFetchDate))
          ) {
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
              clinicId,
            })

            await this.reviewRepository.save(newReview)

            if (lastFetchDate === null) {
              const admin = await this.userRepository.findAdmin()
              if (admin === null) {
                throw new NotFoundError('Can not find admin.')
              }

              await this.notificationHelper.createNotification({
                title: '低於五星的評論',
                content: '有一則低於五星的評論',
                notificationType: NotificationType.NEGATIVE_REVIEW,
                referenceId: newReview.id,
                user: admin,
              })
            }
          }
        }

        nextPageToken =
          typeof response.data.serpapi_pagination?.next_page_token === 'string'
            ? response.data.serpapi_pagination.next_page_token
            : null
      } while (nextPageToken != null)

      if (lastFetchDate !== null) {
        await this.updateLastFetchDate()
      }

      console.log('All reviews for location have been saved to the database.')
    } catch (error) {
      console.error('Error fetching Google reviews:', error)
    }
  }

  async fetchAllGoogleReviews(): Promise<void> {
    const taichungId = process.env.PLACE_TAICHUNG_ID
    const kaohsiungId = process.env.PLACE_KAOHSIUNG_ID
    const taipeiId = process.env.PLACE_TAIPEI_ID

    if (taichungId !== undefined) {
      await this.fetchReviewsForLocation(
        taichungId,
        '16458ab0-4bb6-4141-9bf0-6d7398942d9b'
      )
    } else {
      console.error('PLACE_TAICHUNG_ID is not defined.')
    }

    if (kaohsiungId !== undefined) {
      await this.fetchReviewsForLocation(
        kaohsiungId,
        'bf51c88e-9587-479e-994a-d15ec484c333'
      )
    } else {
      console.error('PLACE_KAOHSIUNG_ID is not defined.')
    }

    if (taipeiId !== undefined) {
      await this.fetchReviewsForLocation(
        taipeiId,
        '690d0ea3-9f8d-4143-b160-0661a003bf08'
      )
    } else {
      console.error('PLACE_TAIPEI_ID is not defined.')
    }
  }

  async fetchNewGoogleReviews(): Promise<void> {
    const lastFetchDate = await this.getLastFetchDate()

    const taichungId: string | undefined = process.env.PLACE_TAICHUNG_ID
    const kaohsiungId: string | undefined = process.env.PLACE_KAOHSIUNG_ID
    const taipeiId: string | undefined = process.env.PLACE_TAIPEI_ID

    if (
      taichungId === undefined ||
      taichungId === '' ||
      kaohsiungId === undefined ||
      kaohsiungId === '' ||
      taipeiId === undefined ||
      taipeiId === ''
    ) {
      throw new Error(
        'One or more PLACE_IDs are not defined in the environment variables.'
      )
    }

    await this.fetchReviewsForLocation(
      taichungId,
      '16458ab0-4bb6-4141-9bf0-6d7398942d9b',
      lastFetchDate
    )

    await this.fetchReviewsForLocation(
      kaohsiungId,
      'bf51c88e-9587-479e-994a-d15ec484c333',
      lastFetchDate
    )

    await this.fetchReviewsForLocation(
      taipeiId,
      '690d0ea3-9f8d-4143-b160-0661a003bf08',
      lastFetchDate
    )
  }
}

export default GoogleReviewService
