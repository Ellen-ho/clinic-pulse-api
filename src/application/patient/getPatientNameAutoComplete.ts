import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'

interface GetPatientNameAutoCompleteRequest {
  searchText: string
}

interface GetPatientNameAutoCompleteResponse {
  patients: Array<{ id: string; fullName: string }>
}

export class GetPatientNameAutoCompleteUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  public async execute(
    request: GetPatientNameAutoCompleteRequest
  ): Promise<GetPatientNameAutoCompleteResponse> {
    const { searchText } = request

    if (searchText.trim() === '') {
      return { patients: [] }
    }

    const result = await this.patientRepository.findByName(searchText)

    return { patients: result }
  }
}
