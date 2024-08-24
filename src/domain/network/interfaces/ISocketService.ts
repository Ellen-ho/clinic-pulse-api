export interface ISocketService {
  sendToUser: (userId: string, event: string, message: any) => void
}
