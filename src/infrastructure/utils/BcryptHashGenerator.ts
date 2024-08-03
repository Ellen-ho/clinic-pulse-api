import * as bcrypt from 'bcrypt'
import { IHashGenerator } from 'domain/utils/IHashGenerator'

export class BcryptHashGenerator implements IHashGenerator {
  private readonly SALT_ROUNDS: number

  constructor() {
    this.SALT_ROUNDS = 10
  }

  public async hash(value: string): Promise<string> {
    try {
      return await bcrypt.hash(value, this.SALT_ROUNDS)
    } catch (e) {
      throw new Error('hashing error')
    }
  }

  public async compare(value: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(value, hash)
    } catch (e) {
      throw new Error('compare error')
    }
  }
}
