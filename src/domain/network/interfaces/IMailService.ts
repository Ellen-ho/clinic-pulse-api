export interface ISendMailParams {
  to: string[]
  subject: string
  html: string
}

export interface IMailService {
  sendMail: (params: ISendMailParams) => Promise<void>
}
