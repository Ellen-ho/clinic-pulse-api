import { BaseRepository } from '../../../infrastructure/database/BaseRepository'
import { DataSource } from 'typeorm'
import { ReviewMapper } from './ReviewMapper'
import { ReviewEntity } from './ReviewEntity'
import { Review } from '../../../domain/review/Review'
import { IReviewRepository } from '../../../domain/review/interfaces/repositories/IReviewRepository'
import { RepositoryError } from '../../../infrastructure/error/RepositoryError'
import dayjs from 'dayjs'
import { Granularity } from '../../../domain/common'
import { getDateFormat } from '../../../infrastructure/utils/SqlDateFormat'

export class ReviewRepository
  extends BaseRepository<ReviewEntity, Review>
  implements IReviewRepository
{
  constructor(dataSource: DataSource) {
    super(ReviewEntity, new ReviewMapper(), dataSource)
  }

  public async findLatestReview(): Promise<Review | null> {
    const query = `
      SELECT * FROM reviews
      ORDER BY "iso_date" DESC
      LIMIT 1;
    `

    const result = await this.getQuery<any[]>(query)

    if (result.length === 0) {
      return null
    }

    return this.getMapper().toDomainModel(result[0])
  }

  public async findByQuery(
    limit: number,
    offset: number,
    startDate: string,
    endDate: string,
    clinicId?: string,
    patientName?: string,
    reviewRating?: number
  ): Promise<{
    data: Array<{
      id: string
      link: string
      receivedDate: string
      receivedDateOfLastEdit: string | null
      reviewRating: number
      clinicId: string
      clinicName: string
      reviewer: {
        name: string
      }
      response: {
        responseDate: string | null
        responseDateOfLastEdit: string | null
      }
    }>
    totalCounts: number
  }> {
    try {
      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null

      const modifiedPatientName =
        patientName !== undefined && patientName.trim() !== ''
          ? patientName.trim()
          : null

      const modifiedReviewRating =
        reviewRating !== undefined ? reviewRating : null

      const rawReviews = await this.getQuery<
        Array<{
          id: string
          link: string
          iso_date: Date
          iso_date_of_last_edit: Date | null
          rating: number
          reviewer_name: string
          response_iso_date: Date | null
          response_iso_date_of_last_edit: Date | null
          clinic_id: string
          clinic_name: string
        }>
      >(
        `
          SELECT
            r.id,
            r.link,
            r.iso_date,
            r.iso_date_of_last_edit,
            r.rating,
            r.reviewer_name,
            cl.id AS clinic_id,
            cl.name AS clinic_name,
            r.response_iso_date,
            r.response_iso_date_of_last_edit
          FROM
          reviews r
          JOIN
            clinics cl ON r.clinic_id = cl.id
          WHERE
            r.iso_date::date BETWEEN $1 AND $2
            AND ($3::uuid IS NULL OR r.clinic_id = $3)
            AND ($4::text IS NULL OR r.reviewer_name ILIKE '%' || $4 || '%')
            AND ($5::int IS NULL OR r.rating = $5)
          ORDER BY
            r.iso_date DESC
          LIMIT $6 OFFSET $7
         `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedPatientName,
          modifiedReviewRating,
          limit,
          offset,
        ]
      )

      const totalCounts = await this.getQuery<Array<{ count: string }>>(
        `
        SELECT COUNT(*) FROM reviews r
        WHERE
          r.iso_date BETWEEN $1 AND $2
          AND ($3::uuid IS NULL OR r.clinic_id = $3)
          AND ($4::text IS NULL OR r.reviewer_name ILIKE '%' || $4 || '%')
          AND ($5::int IS NULL OR r.rating = $5)
      `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedPatientName,
          modifiedReviewRating,
        ]
      )

      const data = rawReviews.map((review) => ({
        id: review.id,
        link: review.link,
        receivedDate: dayjs(review.iso_date).format('YYYY-MM-DD'),
        receivedDateOfLastEdit:
          review.iso_date_of_last_edit !== null
            ? dayjs(review.iso_date_of_last_edit).format('YYYY-MM-DD')
            : null,
        reviewRating: review.rating,
        clinicId: review.clinic_id,
        clinicName: review.clinic_name,
        reviewer: {
          name: review.reviewer_name,
        },
        response: {
          responseDate:
            review.response_iso_date !== null
              ? dayjs(review.response_iso_date).format('YYYY-MM-DD')
              : null,
          responseDateOfLastEdit:
            review.response_iso_date_of_last_edit !== null
              ? dayjs(review.response_iso_date_of_last_edit).format(
                  'YYYY-MM-DD'
                )
              : null,
        },
      }))

      return {
        data,
        totalCounts: parseInt(totalCounts[0].count, 10),
      }
    } catch (e) {
      throw new RepositoryError(
        'ReviewRepository findByQuery error',
        e as Error
      )
    }
  }

  public async findById(id: string): Promise<{
    id: string
    link: string
    reviewRating: number
    receivedDate: string
    receivedAt: Date
    reviewDateOfLastEdit: Date | null
    reviewerName: string
    snippet: string | null
    extractedSnippet: string | null
    likes: number | null
    responseDate: string | null
    responseAt: Date | null
    responseDateOfLastEdit: Date | null
    responseSnippet: string | null
    responseExtractedSnippet: string | null
    clinicId: string
  } | null> {
    try {
      const rawReview = await this.getQuery<
        Array<{
          id: string
          link: string
          rating: number
          iso_date: Date
          iso_date_of_last_edit: Date | null
          reviewer_name: string
          snippet: string | null
          extracted_snippet: string | null
          likes: number | null
          response_iso_date: Date | null
          response_iso_date_of_last_edit: Date | null
          response_snippet: string | null
          response_extracted_snippet: string | null
          clinic_id: string
        }>
      >(
        `
        SELECT
          r.id,
          r.link,
          r.rating,
          r.iso_date,
          r.iso_date_of_last_edit,
          r.reviewer_name,
          r.snippet,
          r.extracted_snippet,
          r.likes,
          r.response_iso_date,
          r.response_iso_date_of_last_edit,
          r.response_snippet,
          r.response_extracted_snippet,
          r.clinic_id AS clinic_id
        FROM
          reviews r
        WHERE
          r.id = $1
      `,
        [id]
      )
      if (rawReview.length === 0) {
        return null
      }

      const review = rawReview[0]

      return {
        id: review.id,
        link: review.link,
        reviewRating: review.rating,
        receivedDate: dayjs(review.iso_date).format('YYYY-MM-DD'),
        receivedAt: review.iso_date,
        reviewDateOfLastEdit: review.iso_date_of_last_edit,
        reviewerName: review.reviewer_name,
        snippet: review.snippet,
        extractedSnippet: review.extracted_snippet,
        likes: review.likes,
        responseDate:
          review.response_iso_date !== null
            ? dayjs(review.response_iso_date).format('YYYY-MM-DD')
            : null,
        responseAt: review.response_iso_date,
        responseDateOfLastEdit: review.response_iso_date_of_last_edit,
        responseSnippet: review.response_snippet,
        responseExtractedSnippet: review.response_extracted_snippet,
        clinicId: review.clinic_id,
      }
    } catch (e) {
      throw new RepositoryError('ReviewRepository findById error', e as Error)
    }
  }

  public async getStarReview(
    startDate: string,
    endDate: string,
    clinicId?: string,
    granularity: Granularity = Granularity.DAY
  ): Promise<{
    totalReviews: number
    oneStarReviewCount: number
    twoStarReviewCount: number
    threeStarReviewCount: number
    fourStarReviewCount: number
    fiveStarReviewCount: number
    oneStarReviewRate: number
    twoStarReviewRate: number
    threeStarReviewRate: number
    fourStarReviewRate: number
    fiveStarReviewRate: number
    data: Array<{
      date: string
      reviewCount: number
      oneStarReviewCount: number
      twoStarReviewCount: number
      threeStarReviewCount: number
      fourStarReviewCount: number
      fiveStarReviewCount: number
      oneStarReviewRate: number
      twoStarReviewRate: number
      threeStarReviewRate: number
      fourStarReviewRate: number
      fiveStarReviewRate: number
    }>
  }> {
    try {
      const startDateTime = dayjs(startDate)
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const endDateTime = dayjs(endDate)
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')

      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null

      const dateFormat = getDateFormat(granularity)

      const result = await this.getQuery<
        Array<{
          date: string
          reviewcount: string
          onestarreviewcount: string
          twostarreviewcount: string
          threestarreviewcount: string
          fourstarreviewcount: string
          fivestarreviewcount: string
        }>
      >(
        `SELECT 
            TO_CHAR(r.iso_date, '${dateFormat}') AS date,
          COUNT(*) AS reviewcount,
          COUNT(CASE WHEN r.rating = 1 THEN 1 END) AS onestarreviewcount,
          COUNT(CASE WHEN r.rating = 2 THEN 1 END) AS twostarreviewcount,
          COUNT(CASE WHEN r.rating = 3 THEN 1 END) AS threestarreviewcount,
          COUNT(CASE WHEN r.rating = 4 THEN 1 END) AS fourstarreviewcount,
          COUNT(CASE WHEN r.rating = 5 THEN 1 END) AS fivestarreviewcount
        FROM reviews r
        JOIN clinics c ON r.clinic_id = c.id
        WHERE r.iso_date BETWEEN $1 AND $2
          AND ($3::uuid IS NULL OR r.clinic_id = $3)
        GROUP BY TO_CHAR(r.iso_date, '${dateFormat}') 
          ORDER BY date;
      `,
        [startDateTime, endDateTime, modifiedClinicId]
      )

      const parseCount = (count: string | undefined): number => {
        return count !== undefined && count !== '' ? parseInt(count, 10) : 0
      }

      const totalReviewCounts = result.reduce(
        (sum, row) => sum + parseCount(row.reviewcount),
        0
      )

      const totalOneStarReviewCount = result.reduce(
        (sum, row) => sum + parseCount(row.onestarreviewcount),
        0
      )
      const totalTwoStarReviewCount = result.reduce(
        (sum, row) => sum + parseCount(row.twostarreviewcount),
        0
      )
      const totalThreeStarReviewCount = result.reduce(
        (sum, row) => sum + parseCount(row.threestarreviewcount),
        0
      )
      const totalFourStarReviewCount = result.reduce(
        (sum, row) => sum + parseCount(row.fourstarreviewcount),
        0
      )
      const totalFiveStarReviewCount = result.reduce(
        (sum, row) => sum + parseCount(row.fivestarreviewcount),
        0
      )

      const calculateRate = (count: number, total: number): number =>
        total > 0 ? parseFloat(((count / total) * 100).toFixed(2)) : 0

      return {
        totalReviews: totalReviewCounts,
        oneStarReviewCount: totalOneStarReviewCount,
        twoStarReviewCount: totalTwoStarReviewCount,
        threeStarReviewCount: totalThreeStarReviewCount,
        fourStarReviewCount: totalFourStarReviewCount,
        fiveStarReviewCount: totalFiveStarReviewCount,
        oneStarReviewRate: calculateRate(
          totalOneStarReviewCount,
          totalReviewCounts
        ),
        twoStarReviewRate: calculateRate(
          totalTwoStarReviewCount,
          totalReviewCounts
        ),
        threeStarReviewRate: calculateRate(
          totalThreeStarReviewCount,
          totalReviewCounts
        ),
        fourStarReviewRate: calculateRate(
          totalFourStarReviewCount,
          totalReviewCounts
        ),
        fiveStarReviewRate: calculateRate(
          totalFiveStarReviewCount,
          totalReviewCounts
        ),
        data: result.map((row) => {
          const reviewCount = parseCount(row.reviewcount)
          const oneStarCount = parseCount(row.onestarreviewcount)
          const twoStarCount = parseCount(row.twostarreviewcount)
          const threeStarCount = parseCount(row.threestarreviewcount)
          const fourStarCount = parseCount(row.fourstarreviewcount)
          const fiveStarCount = parseCount(row.fivestarreviewcount)

          return {
            date: row.date,
            reviewCount,
            oneStarReviewCount: oneStarCount,
            twoStarReviewCount: twoStarCount,
            threeStarReviewCount: threeStarCount,
            fourStarReviewCount: fourStarCount,
            fiveStarReviewCount: fiveStarCount,
            oneStarReviewRate: calculateRate(oneStarCount, reviewCount),
            twoStarReviewRate: calculateRate(twoStarCount, reviewCount),
            threeStarReviewRate: calculateRate(threeStarCount, reviewCount),
            fourStarReviewRate: calculateRate(fourStarCount, reviewCount),
            fiveStarReviewRate: calculateRate(fiveStarCount, reviewCount),
          }
        }),
      }
    } catch (e) {
      throw new RepositoryError(
        'ReviewRepository getStarReview error',
        e as Error
      )
    }
  }

  public async getPreviousPeriodDates(
    startDate: string,
    endDate: string,
    granularity: Granularity = Granularity.WEEK
  ): Promise<{ lastStartDate: string; lastEndDate: string }> {
    const start = new Date(startDate)

    switch (granularity) {
      case Granularity.DAY: {
        const lastStartDate = new Date(start)
        const currentDayOfWeek = lastStartDate.getDay()

        const daysToLastMonday =
          currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1
        lastStartDate.setDate(start.getDate() - 7 - daysToLastMonday)

        const lastEndDate = new Date(lastStartDate)
        lastEndDate.setDate(lastStartDate.getDate() + 6)

        return {
          lastStartDate: lastStartDate.toISOString().split('T')[0],
          lastEndDate: lastEndDate.toISOString().split('T')[0],
        }
      }
      case Granularity.WEEK: {
        const lastStartDate = new Date(start)
        lastStartDate.setMonth(start.getMonth() - 1)
        lastStartDate.setDate(1)

        const lastEndDate = new Date(lastStartDate)
        lastEndDate.setMonth(lastEndDate.getMonth() + 1)
        lastEndDate.setDate(0)

        return {
          lastStartDate: lastStartDate.toISOString().split('T')[0],
          lastEndDate: lastEndDate.toISOString().split('T')[0],
        }
      }
      case Granularity.MONTH:
      case Granularity.YEAR: {
        const lastStartDate = new Date(start)
        const lastEndDate = new Date(start)

        lastStartDate.setFullYear(start.getFullYear() - 1)
        lastEndDate.setFullYear(start.getFullYear() - 1)

        lastStartDate.setMonth(0)
        lastStartDate.setDate(1)

        lastEndDate.setMonth(11)
        lastEndDate.setDate(31)

        return {
          lastStartDate: lastStartDate.toISOString().split('T')[0],
          lastEndDate: lastEndDate.toISOString().split('T')[0],
        }
      }
      default:
        throw new Error('Unsupported granularity')
    }
  }
}
