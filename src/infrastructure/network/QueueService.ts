import Queue, { Job } from 'bull'

export interface IQueueService {
  addJob: (
    queueName: string,
    jobName: string,
    data: any,
    options?: any
  ) => Promise<Job<any>>
  processJob: (
    queueName: string,
    jobName: string,
    callback: (job: Job) => Promise<void>
  ) => void
  removeJob: (queueName: string, jobId: string) => Promise<void>
}

interface IQueueServiceOptions {
  redisUrl: string
  redisPort: number
  redisPassword: string
}

export class QueueService implements IQueueService {
  private readonly queues = new Map<string, Queue.Queue>()
  private readonly redisConfig: Queue.QueueOptions

  constructor({ redisPort, redisUrl, redisPassword }: IQueueServiceOptions) {
    this.redisConfig = {
      redis: {
        port: redisPort,
        host: redisUrl,
        password: redisPassword,
      },
    }
  }

  public async addJob(
    queueName: string,
    jobName: string,
    data: any,
    options?: any
  ): Promise<Job<any>> {
    let queue = this.queues.get(queueName)

    if (queue == null) {
      queue = new Queue(queueName, this.redisConfig)
      this.queues.set(queueName, queue)
    }

    try {
      return await queue.add(jobName, data, options)
    } catch (error) {
      console.error(`Error adding job ${jobName} to queue ${queueName}:`, error)
      throw error
    }
  }

  public processJob(
    queueName: string,
    jobName: string,
    callback: (job: Job) => Promise<void>
  ): void {
    let queue = this.queues.get(queueName)

    if (queue == null) {
      queue = new Queue(queueName, this.redisConfig)
      this.queues.set(queueName, queue)
    }

    queue
      .process(jobName, async (job) => {
        try {
          await callback(job)
        } catch (error) {
          console.error(
            `Error processing job ${jobName} in queue ${queueName}:`,
            error
          )
        }
      })
      .catch((error) => {
        console.error(
          `Error setting up job processing for ${jobName} in queue ${queueName}:`,
          error
        )
      })
  }

  public async removeJob(queueName: string, jobId: string): Promise<void> {
    const queue = this.queues.get(queueName)

    if (queue != null) {
      try {
        const job = await queue.getJob(jobId)
        if (job != null) {
          await job.remove()
        }
      } catch (error) {
        console.error(
          `Error removing job ${jobId} from queue ${queueName}:`,
          error
        )
      }
    }
  }
}
