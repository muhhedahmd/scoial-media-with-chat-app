// src/redux/services/socketApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import io from 'socket.io-client'

let socket: any

const connectSocket = async (token: string) => {
  await fetch('/api/socketio')
  socket = io({ auth: { token } })

  socket.on('connect', () => {
    console.log('Connected to Socket.IO server')
  })

  return socket
}

export const socketApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    connectToSocket: builder.query<void, string>({
      queryFn: async (token) => {
        await connectSocket(token)
        return { data: undefined }
      },
    }),
    joinRoom: builder.mutation<void, string>({
      queryFn: (roomId) => {
        socket.emit('join-room', roomId)
        return { data: undefined }
      },
    }),
    leaveRoom: builder.mutation<void, string>({
      queryFn: (roomId) => {
        socket.emit('leave-room', roomId)
        return { data: undefined }
      },
    }),
    sendMessage: builder.mutation<void, { roomId: string; content: string }>({
      queryFn: ({ roomId, content }) => {
        socket.emit('send-message', { roomId, content })
        return { data: undefined }
      },
    }),
  }),
})

export const {
  useConnectToSocketQuery,
  useJoinRoomMutation,
  useLeaveRoomMutation,
  useSendMessageMutation,
} = socketApi