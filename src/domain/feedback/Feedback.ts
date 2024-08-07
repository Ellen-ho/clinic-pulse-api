import { Consultation } from 'domain/consultation/Consultation'

export interface IFeedbackProps {
  id: string
  feedbackRating: number
  selectedContent: SelectedContent
  detailedContent: string | null
  receivedAt: Date
  consultation: Consultation
}

export enum SelectedContent {
  LONG_WAIT_TIME_FOR_REATMENT = 'LONG_WAIT_TIME_FOR_REATMENT',
  LONG_WAIT_TIME_FOR_CONSULTATION = 'LONG_WAIT_TIME_FOR_CONSULTATION',
  LONG_WAIT_TIME_FOR_MEDICATION = 'LONG_WAIT_TIME_FOR_MEDICATION',
  POOR_DOCTO_ATTITUDE = 'POOR_DOCTO_ATTITUDE',
}

export class Feedback {
  constructor(private readonly props: IFeedbackProps) {}

  public get id(): string {
    return this.props.id
  }

  public get feedbackRating(): number {
    return this.props.feedbackRating
  }

  public get selectedContent(): SelectedContent {
    return this.props.selectedContent
  }

  public get detailedContent(): string | null {
    return this.props.detailedContent
  }

  public get receivedAt(): Date {
    return this.props.receivedAt
  }

  public get consultation(): Consultation {
    return this.props.consultation
  }
}