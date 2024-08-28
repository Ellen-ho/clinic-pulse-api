import { S3 } from 'aws-sdk'
import { IUuidService } from '../../domain/utils/IUuidService'
import path from 'path'
import { DoctorRepository } from 'infrastructure/entities/doctor/DoctorRepository'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface EditDoctorAvatarRequest {
  file: Express.Multer.File
  doctorId: string
}

interface EditDoctorAvatarResponse {
  key: string
}

export class EditDoctorAvatarUseCase {
  constructor(
    private readonly s3: S3,
    private readonly uuidService: IUuidService,
    private readonly doctorRepository: DoctorRepository
  ) {}

  public async execute(
    request: EditDoctorAvatarRequest
  ): Promise<EditDoctorAvatarResponse> {
    const { file, doctorId } = request

    const existingDoctor = await this.doctorRepository.findById(doctorId)

    if (existingDoctor === null) {
      throw new NotFoundError('Doctor does not exist.')
    }

    const uniqueFilename = `${this.uuidService.generateUuid()}${path.extname(
      file.originalname
    )}`
    const bucketName = process.env.BUCKET_NAME as string
    const objectKey = `${
      process.env.OBJECT_NAME_PREFIX as string
    }/${uniqueFilename}`

    await this.s3
      .upload({
        Bucket: bucketName,
        Key: objectKey,
        Body: file.buffer, // Using the file buffer here
        ContentType: file.mimetype, // Set the content type
      })
      .promise()

    existingDoctor.updateAvatar({
      avatar: uniqueFilename,
    })

    await this.doctorRepository.save(existingDoctor)

    return { key: objectKey }
  }
}
