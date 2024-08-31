import GoogleReviewService from 'infrastructure/network/GoogleReviewService'
import { IScheduler } from 'infrastructure/network/Scheduler'
import schedule from 'node-schedule'

export interface IGoogleReviewCronJob {
  init: () => Promise<void>
}

export class GoogleReviewCronJob implements IGoogleReviewCronJob {
  constructor(
    private readonly googleReviewService: GoogleReviewService,
    private readonly scheduler: IScheduler
  ) {}

  public async init(): Promise<void> {
    this.createGoogleReviewCronJob()
  }

  private createGoogleReviewCronJob(): void {
    const rule = new schedule.RecurrenceRule()
    rule.tz = 'Asia/Taipei'
    rule.hour = 1
    rule.minute = 0

    const jobCallback = async (): Promise<void> => {
      console.log('Job is executing at:', new Date().toLocaleString())
      await this.googleReviewService.fetchNewGoogleReviews()
    }

    this.scheduler.createJob(
      `fetchNewGoogleReviews ${new Date().toISOString()}`,
      rule,
      jobCallback
    )
  }
}
