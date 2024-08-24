import { ISocketService } from '../../domain/network/interfaces/ISocketService'
import { Server, Socket } from 'socket.io'

class SocketService implements ISocketService {
  private readonly io: Server
  private readonly userSockets: Map<string, string> // Map a user ID to a Socket ID

  constructor(server: Server) {
    this.io = server
    this.userSockets = new Map()

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.query.userId as string
      this.userSockets.set(userId, socket.id)

      socket.on('disconnect', () => {
        this.userSockets.delete(userId)
      })
    })
  }

  sendToUser(userId: string, event: string, message: any): void {
    const socketId = this.userSockets.get(userId)
    try {
      if (socketId != null) {
        this.io.to(socketId).emit(event, message)
      }
    } catch (error) {
      console.table({ status: 'sendToUser', error })
    }
  }
}

export default SocketService
