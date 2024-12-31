import { Chat, VideoChat, VideoChatParticipant } from "@prisma/client"
import supabase from "../Supabase"
import prisma from "../prisma"

// Enum for VideoChatStatus (if not already defined in your Supabase schema)
enum VideoChatStatus {
  PENDING = 'PENDING',
  ONGOING = 'ONGOING',
  ENDED = 'ENDED'
}




export async function startVideoCall(chatId: number, senderId: number, receiverId: number) {
  try {
  const { data, error } = await supabase
  .from('VideoChat')
  .insert({
    id :Math.round(Math.random() * 3021) ,
    chatId: chatId,
    senderId: senderId,
    receiverId: receiverId,
    updatedAt :new Date() , 
    status: VideoChatStatus.PENDING as VideoChatStatus,
    startTime:new Date(),
    
  } as VideoChat)
  .select()
  .single()
  
  if (error) throw error

  return data
} catch (error) {
    console.error(error)
}
}






export async function endVideoCall(videoChatId: number) {
  const { data, error } = await supabase
    .from('VideoChat')
    .update({ 
      status: VideoChatStatus.ENDED,
      endTime: new Date(),
    })
    .eq('id', videoChatId)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getActiveVideoCall(chatId: number) {

  try {
    const { data, error } = await supabase
    .from('VideoChat')
    .select('*')
    .eq('chatId', chatId)
    .in('status', [VideoChatStatus.PENDING, VideoChatStatus.ONGOING])
    .order('createdAt', { ascending: false })
    .limit(1)
    .single() 
    if (error && error.code !== 'PGRST116') throw error // PGRST116 is the error code for no rows returned
    
    return data as VideoChat
  } catch (error) {
    console.error(error)
    
  }
}

export async function joinVideoCall(videoChatId: number, userId: number) {
  
  const { data, error } = await supabase
    .from('VideoChat')
    .update({ status: 'ONGOING', receiverId : userId })
    .eq('id', videoChatId)
    .select()
    .single();

  if (error) {
    throw new Error('Failed to join video call');
  }

  return data;
}
export async function getActiveVideoCallGroup(chatId: number): Promise<{
  id: number;
  startTime: Date;
  endTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
  receiverId: number | null;
  senderId: number;
  chatId: number;
  status: VideoChatStatus;
  ChatParticipant: VideoChatParticipant[]

} | null> {

  try {
    const { data, error } = await supabase
      .from('VideoChat')
      .select('*, VideoChatParticipant(*)')
      .eq('chatId', chatId)
      .in('status', [VideoChatStatus.PENDING, VideoChatStatus.ONGOING])
      .order('createdAt', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is the error code for no rows returned
    return data as {
    id: number;
    startTime: Date;
    endTime: Date | null;
    createdAt: Date;
    updatedAt: Date;
    receiverId: number | null;
    senderId: number;
    chatId: number;
    status: VideoChatStatus;
    ChatParticipant: VideoChatParticipant[]

}| null
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function joinVideoCallGroup(videoChatId: number, userId: number): Promise<VideoChat | null> {
  try {
    const { data, error } = await supabase
      .from('VideoChat')
      .update({ status: VideoChatStatus.ONGOING, receiverId: userId })
      .eq('id', videoChatId)
      .select()
      .single();

    if (error) {

      throw new Error('Failed to join video call');
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function startVideoCallGroup(chatId: number, senderId: number, members: number[]): Promise<VideoChat | null> {
  try {
    const { data: isRunningCall } = await supabase
      .from('VideoChat')
      .select('*')
      .eq('chatId', chatId)
      .in('status', [VideoChatStatus.PENDING, VideoChatStatus.ONGOING]);

    if (isRunningCall && isRunningCall.length > 0) return null;

    const { data: room } = await supabase
      .from('Room')
      .insert({
        chatId: chatId,
        type: 'VIDEO_GROUP',
        name: `Video Call ${chatId}`,
      })
      .select()

      .single();

    if (room) {
      const { data, error } = await supabase
        .from('VideoChat')
        .insert({
          chatId: chatId,
          senderId: senderId,
          status: VideoChatStatus.PENDING,
          startTime: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Insert participants
      await supabase.from('VideoChatParticipant').insert(
        members.map((userId) => ({
          userId,
          videoChatId: data.id,
        }))
      );

      return data;
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function endVideoCallGroup(videoChatId: number): Promise<VideoChat | null> {
  try {
    const { data, error } = await supabase
      .from('VideoChat')
      .update({
        status: VideoChatStatus.ENDED,
        endTime: new Date().toISOString(),
      })
      .eq('id', videoChatId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
