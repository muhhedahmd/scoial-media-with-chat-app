"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendMsgMutation } from "@/store/api/apiChat";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import EmojiPicker from "emoji-picker-react";
import {
  Paperclip,
  Send,
  Smile,
  Mic,
  StopCircle,
  X,
  Trash2,
  Pause,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { cn } from "@/lib/utils";

import * as pdfjsLib from "pdfjs-dist";
import { createCanvas } from "canvas";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export const generatePdfThumbnail = async (pdf: Buffer) => {
  const fileBuffer = pdf;

  // Create a PDF document from the buffer
  try {
    const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
    const pdfDocument = await loadingTask.promise;

    // Get the first page of the PDF
    const page = await pdfDocument.getPage(1);

    // Set up the canvas context for rendering
    const canvas = createCanvas(200, 200);
    const context = canvas.getContext("2d");
    const viewport = page.getViewport({ scale: 1.5 }); // Set the scale for rendering

    // Set the canvas dimensions
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render the page into the canvas context
    const renderContext = {
      canvasContext: context! as any,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    const dataURL = canvas.toDataURL("image/png");
    const pdfThumbnailBlob = dataURLToBlob(dataURL);

    // Create a blob URL
    const blobUrl = URL.createObjectURL(pdfThumbnailBlob);
    return { pdfThumbnailBlob, blobUrl };
  } catch (error) {
    console.error("Error rendering PDF:", error);
  }
};

const dataURLToBlob = (dataURL: string): Blob => {
  // Convert base64/URLEncoded data component to raw binary data
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const generateThumbnailVideo = async (
  videoBuffer: File
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(videoBuffer)

    console.log({video})
    video.onloadedmetadata = () => {
      video.currentTime = 1; // Set to 1 second or adjust as needed
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "thumbnail.jpg", {
              type: "image/jpeg",
            });
            resolve(file);
          } else {
            reject(new Error("Failed to generate thumbnail"));
          }
        },
        "image/jpeg",
        0.7
      );
    };

    video.onerror = () => {
      reject(new Error("Error loading video"));
    };

 
  });
};

interface SendMsgProps {
  receiverId: number;
  chatId: number | null;
}

type FileType = "image" | "audio" | "video" | "document";

interface FileData {
  file: File;
  type: FileType;
}

export default function SendMsg({ receiverId, chatId }: SendMsgProps) {
  const [send, { isLoading }] = useSendMsgMutation({});
  const [inputMessage, setInputMessage] = useState("");
  const [files, setFiles] = useState<FileData[]>([]);
  const [isRecordingCancelled, setIsRecordingCancelled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const recorderControls = useAudioRecorder();
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = recorderControls;

  useEffect(() => {
    if (recordingBlob && !isRecordingCancelled) {
      const audioFile = new File([recordingBlob], "voice_message.mp3", {
        type: "audio/mp3",
      });
      setFiles((prevFiles) => [
        ...prevFiles,
        { file: audioFile, type: "audio" },
      ]);
    }
    setIsRecordingCancelled(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingBlob]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setInputMessage((prev) => prev + emojiData.emoji);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles) {
      const newFiles: FileData[] = Array.from(uploadedFiles).map((file) => ({
        file,
        type: getFileType(file.type),
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const getFileType = (mimeType: string): FileType => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.startsWith("video/")) return "video";
    return "document";
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleCancelRecording = () => {
    stopRecording();
    setIsRecordingCancelled(true);
  };

  
  const handleSendMessage = async () => {

    console.log("kmdwpd")
    if (!chatId ) {
      toast({
        title: "Send Error",
        description: "Chat ID or Receiver ID is missing.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("chatId", `${chatId}`);
    formData.append("receiverId", `${receiverId}`);
    formData.append("content", inputMessage);

    try {
      // Use Promise.all to handle async operations in the files array
      await Promise.all(
        files.map(async (fileData, index) => {
          formData.append(`files`, fileData.file);

          if (fileData.file.type === "application/pdf") {
            const fileBuffer = await fileData.file.arrayBuffer();
            const pdfBuffer = Buffer.from(fileBuffer);
            const pdfThumbnail = await generatePdfThumbnail(pdfBuffer);

            if (pdfThumbnail?.pdfThumbnailBlob) {
              console.log(`${fileData.file.name}-Thumbnail-pdf`);

              const url = URL.createObjectURL(pdfThumbnail?.pdfThumbnailBlob);
              console.log(url, pdfThumbnail?.blobUrl);
              const Filee = new File(
                [pdfThumbnail.pdfThumbnailBlob],
                `${fileData.file.name}-Thumbnail.png`
              );

              // Append the file to formData
              formData.append(`${fileData.file.name}-Thumbnail-pdf`, Filee);

              // Verify immediately after appending
              // const appendedFile = formData.get(`test-1`);
              // console.log({ appendedFile }); // Should log the correct `File` object
            }
          } 
          else if (fileData.file.type.startsWith("video/")) {
            // const fileBuffer = await fileData.file.arrayBuffer();
            // const pdfBuffer = Buffer.from(fileBuffer);
            const VidThumbnail = await generateThumbnailVideo(fileData.file);
            if (VidThumbnail) {
              // Append the file to formData
              formData.append(
                `${fileData.file.name}-Thumbnail-video`,
                VidThumbnail
              );
              console.log(URL.createObjectURL(VidThumbnail));
            
            }
          }

          formData.append(`fileTypes`, fileData.type);
        })
      );

      // After all promises are resolved, verify FormData conten
      // Uncomment and handle the actual send logic
      await send(formData).unwrap();
      setInputMessage("");
      setFiles([]);
      toast({
        title: "Message Sent",
        description: "Your message was sent successfully.",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Send Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex flex-wrap gap-2 border-orange-300 p-2 rounded-md border-dashed border-1"
              >
                <span className="truncate max-w-[150px]">{file.file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-3 w-3 text-red-500" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Smile className="h-5 w-5 text-yellow-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </PopoverContent>
        </Popover>

        <Input
          placeholder="Type a message..."
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="flex-1 border-none focus:ring-0 bg-transparent"
        />

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5 text-blue-500" />
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          className="hidden"
        />

        <AnimatePresence>
          {!isRecording ? (
            <motion.div
              key="record"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                onClick={startRecording}
              >
                <Mic className="h-5 w-5 text-red-500" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="recording"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-medium text-red-500"
                // className="bg-white shadow-none"
              >
                {Math.floor(recordingTime / 60)}:
                {(recordingTime % 60).toString().padStart(2, "0")}
              </motion.span>

              <AudioRecorder
                showVisualizer={true}
                classes={{
                  AudioRecorderClass: "bg-white shadow-none",
                  AudioRecorderDiscardClass: "hidden",
                  AudioRecorderPauseResumeClass: "hidden",
                  AudioRecorderStartSaveClass: "hidden",
                  AudioRecorderTimerClass: "hidden",
                  AudioRecorderStatusClass: "hidden",
                }}
                recorderControls={recorderControls}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePauseResume}
                className={cn(
                  " rounded-full",
                  isPaused
                    ? "bg-red-100 hover:bg-red-200 transition-colors"
                    : "bg-green-100 hover:bg-green-200 transition-colors"
                )}
              >
                {isPaused ? (
                  <PauseCircle className="h-6 w-6 text-red-500" />
                ) : (
                  <PlayCircle className="h-6 w-6 text-green-500" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                onClick={stopRecording}
              >
                <StopCircle className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                onClick={handleCancelRecording}
              >
                <Trash2 className="h-5 w-5 text-gray-500" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          disabled={isLoading}
          onClick={handleSendMessage}
          className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
}
