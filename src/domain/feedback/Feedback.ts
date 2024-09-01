export interface IFeedbackProps {
  id: string
  feedbackRating: number
  selectedContent: SelectedContent | null
  detailedContent: string | null
  receivedAt: Date
  consultationId: string
}

export enum SelectedContent {
  LONG_WAIT_TIME_FOR_ACUPUNCTURE = 'LONG_WAIT_TIME_FOR_ACUPUNCTURE',
  LONG_WAIT_TIME_FOR_BED_ASSIGNED = 'LONG_WAIT_TIME_FOR_BED_ASSIGNED',
  LONG_WAIT_TIME_FOR_CONSULTATION = 'LONG_WAIT_TIME_FOR_CONSULTATION',
  LONG_WAIT_TIME_FOR_MEDICATION = 'LONG_WAIT_TIME_FOR_MEDICATION',
  POOR_DOCTOR_ATTITUDE = 'POOR_DOCTOR_ATTITUDE',
}

export class Feedback {
  constructor(private readonly props: IFeedbackProps) {}

  public get id(): string {
    return this.props.id
  }

  public get feedbackRating(): number {
    return this.props.feedbackRating
  }

  public get selectedContent(): SelectedContent | null {
    return this.props.selectedContent
  }

  public get detailedContent(): string | null {
    return this.props.detailedContent
  }

  public get receivedAt(): Date {
    return this.props.receivedAt
  }

  public get consultationId(): string {
    return this.props.consultationId
  }
}
