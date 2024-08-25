import schedule, { Job, RecurrenceRule, JobCallback } from 'node-schedule'

export interface IScheduler {
  createJob: (
    jobId: string,
    rule: RecurrenceRule | Date,
    callback: JobCallback
  ) => void
  cancelJob: (jobId: string) => void
}

export class Scheduler implements IScheduler {
  private readonly jobs = new Map<string, Job>()

  public createJob(
    jobId: string,
    rule: RecurrenceRule | Date,
    callback: JobCallback
  ): void {
    if (this.jobs.has(jobId)) {
      throw new Error(`Job with ID "${jobId}" already exists.`)
    }

    const job: Job = schedule.scheduleJob(rule, callback)
    this.jobs.set(jobId, job)
  }

  public cancelJob(jobId: string): void {
    const job = this.jobs.get(jobId)
    if (job != null) {
      job.cancel()
      this.jobs.delete(jobId)
    }
  }
}
