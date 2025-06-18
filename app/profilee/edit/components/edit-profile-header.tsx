"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EditProfileHeaderProps {
  onBack: () => void
}

export default function EditProfileHeader({ onBack }: EditProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Back to profile</span>
        </Button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>
    </div>
  )
}
