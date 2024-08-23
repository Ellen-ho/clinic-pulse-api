export interface IReviewProps {
  id: string
  link: string
  rating: number
  date: string
  isoDate: Date
  isoDateOfLastEdit: Date | null
  reviewerName: string
  reviewerLink: string
  reviewerLocalGuide: boolean
  snippet: string | null
  extractedSnippet: string | null
  likes: number | null
  responseDate: string | null
  responseIsoDate: Date | null
  responseIsoDateOfLastEdit: Date | null
  responseSnippet: string | null
  responseExtractedSnippet: string | null
  clinicId: string
}

export class Review {
  constructor(private readonly props: IReviewProps) {}

  public get id(): string {
    return this.props.id
  }

  public get link(): string {
    return this.props.link
  }

  public get rating(): number {
    return this.props.rating
  }

  public get date(): string {
    return this.props.date
  }

  public get isoDate(): Date {
    return this.props.isoDate
  }

  public get isoDateOfLastEdit(): Date | null {
    return this.props.isoDateOfLastEdit
  }

  public get reviewerName(): string {
    return this.props.reviewerName
  }

  public get reviewerLink(): string {
    return this.props.reviewerLink
  }

  public get reviewerLocalGuide(): boolean {
    return this.props.reviewerLocalGuide
  }

  public get snippet(): string | null {
    return this.props.snippet
  }

  public get extractedSnippet(): string | null {
    return this.props.extractedSnippet
  }

  public get likes(): number | null {
    return this.props.likes
  }

  public get responseDate(): string | null {
    return this.props.responseDate
  }

  public get responseIsoDate(): Date | null {
    return this.props.responseIsoDate
  }

  public get responseIsoDateOfLastEdit(): Date | null {
    return this.props.responseIsoDateOfLastEdit
  }

  public get responseSnippet(): string | null {
    return this.props.responseSnippet
  }

  public get responseExtractedSnippet(): string | null {
    return this.props.responseExtractedSnippet
  }

  public get clinicId(): string {
    return this.props.clinicId
  }
}
