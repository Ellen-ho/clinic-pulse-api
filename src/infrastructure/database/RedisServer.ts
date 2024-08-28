import * as redis from 'redis'

export interface IRedisError extends Error {
  message: string
  code: string
}

export interface IRedisServerSetOptions {
  expiresInSec: number
}

export interface IRedisServer {
  set: (
    key: string,
    value:
      | Record<string, Record<string, unknown> | string | number | null | Date>
      | string,
    options?: IRedisServerSetOptions
  ) => Promise<string | undefined>
  get: (key: string) => Promise<string>
  isConnected: () => boolean
  getClient: () => redis.RedisClient | null
  disconnect: () => Promise<void>
  getSize: (key: string) => Promise<number>
  delete: (key: string) => Promise<void>
}

export interface IRedisOptions {
  host: string
  port: number
  authToken: string
  retryAttempts: number
  retryDelayMS: number
  awsTlsEnabled: boolean
}

export class RedisServer implements IRedisServer {
  private redis: redis.RedisClient | null = null

  constructor(private readonly options: IRedisOptions) {}

  public async connect(): Promise<void> {
    const {
      host,
      port,
      authToken,
      retryDelayMS,
      retryAttempts,
      awsTlsEnabled,
    } = this.options
    this.redis = redis.createClient(port, host, {
      retry_strategy: function (options) {
        if (options.attempt > retryAttempts) {
          // End reconnecting with built in error
          return undefined
        }

        return retryDelayMS * retryAttempts
      },
      auth_pass: authToken,
      ...(awsTlsEnabled ? { tls: {} } : {}),
    })

    const client = this.redis

    await new Promise((resolve) => {
      client.on('ready', () => {
        resolve({})
      })
    })
  }

  public async disconnect(): Promise<void> {
    await new Promise((resolve) => {
      if (this.redis != null) {
        this.redis.quit(() => {
          resolve({})
        })
      }
    })
  }

  public isConnected(): boolean {
    return this.redis?.connected ?? false
  }

  public getClient(): redis.RedisClient | null {
    return this.redis
  }

  public async get(key: string): Promise<string> {
    if (this.redis == null) {
      throw new Error('redis not initialized')
    }

    const client = this.redis

    return await new Promise((resolve, reject) => {
      client.get(key, (error, response: string | null) => {
        if (error != null) {
          reject(error)
          return
        }

        if (response == null) {
          reject(RedisServer.createRedisError('entity not found', 'NOT_FOUND'))
          return
        }

        resolve(response)
      })
    })
  }

  public async set(
    key: string,
    value:
      | Record<string, Record<string, unknown> | string | number | null | Date>
      | string,
    options?: IRedisServerSetOptions
  ): Promise<string> {
    if (this.redis == null) {
      throw new Error('redis not initialized')
    }

    const serializedValue =
      typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : value
    const client = this.redis

    return await new Promise((resolve, reject) => {
      if (options != null) {
        client.set(key, serializedValue, 'EX', options.expiresInSec)
      } else {
        client.set(key, serializedValue)
      }

      resolve('')
    })
  }

  private static createRedisError(message: string, code: string): IRedisError {
    const notFoundError = new Error(message) as IRedisError
    notFoundError.code = code
    return notFoundError
  }

  public async getSize(key: string): Promise<number> {
    if (this.redis == null) {
      throw new Error('redis not initialized')
    }
    const client = this.redis
    return await new Promise((resolve, reject) => {
      client.keys(key, (error, rows) => {
        if (error != null) {
          reject(error)
          return
        }
        resolve(rows.length)
      })
    })
  }

  public async delete(key: string): Promise<void> {
    if (this.redis == null) {
      throw new Error('redis not initialized')
    }
    const client = this.redis
    await new Promise((resolve, reject) => {
      client.del(key, (error) => {
        if (error != null) {
          reject(error)
          return
        }
        resolve({})
      })
    })
  }
}
