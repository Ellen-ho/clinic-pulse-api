import { RoomNumberType } from 'domain/consultationRoom/ConsultationRoom'
import {
  IRealTimeSocketService,
  ISendToUser,
} from '../../domain/network/interfaces/IRealTimeSocketService'
import { Server, Socket } from 'socket.io'

class RealTimeSocketService implements IRealTimeSocketService {
  private readonly io: Server
  private readonly userSockets: Map<string, string[]> // Map a user ID to a Socket ID

  constructor(server: Server) {
    this.io = server
    this.userSockets = new Map()

    this.io.on('connection', (socket: Socket) => {
      const { userId, clinicId, consultationRoomNumber } = socket.handshake
        .query as {
        userId: string
        clinicId: string
        consultationRoomNumber: RoomNumberType
      }
      const mapKey = `${clinicId}_${consultationRoomNumber}`

      if (this.userSockets.has(mapKey)) {
        const currentSocketIds = this.userSockets.get(mapKey) as string[]
        this.userSockets.set(mapKey, [...currentSocketIds, socket.id])
        return
      }

      this.userSockets.set(`${userId}_${clinicId}_${consultationRoomNumber}`, [
        socket.id,
      ])

      socket.on('disconnect', () => {
        this.userSockets.delete(userId)
      })
    })
  }

  sendToUser({
    clinicId,
    consultationRoomNumber,
    event,
    message,
  }: ISendToUser): void {
    const socketId = this.userSockets.get(
      `${clinicId}_${consultationRoomNumber}`
    )
    try {
      if (socketId != null) {
        this.io.to(socketId).emit(event, message)
      }
    } catch (error) {
      console.table({ status: 'sendToUser', error })
    }
  }
}

export default RealTimeSocketService
