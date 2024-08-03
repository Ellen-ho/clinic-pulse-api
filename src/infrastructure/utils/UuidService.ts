import { v4 as uuidv4 } from 'uuid'
import { IUuidService } from '../../domain/utils/IUuidService'

export class UuidService implements IUuidService {
  public generateUuid = function (): string {
    return uuidv4()
  }
}
