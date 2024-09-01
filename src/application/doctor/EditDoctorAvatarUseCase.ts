import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
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
    private readonly s3Client: S3Client,
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

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    })

    await this.s3Client.send(uploadCommand)

    existingDoctor.updateAvatar({
      avatar: uniqueFilename,
    })

    await this.doctorRepository.save(existingDoctor)

    return { key: objectKey }
  }
}
