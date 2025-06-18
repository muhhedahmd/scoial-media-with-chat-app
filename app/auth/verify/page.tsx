"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import { sendVerificationCode, verifyCode, resendVerificationCode } from "
import { Loader2, Mail, Phone, Shield } from "lucide-react"
import { sendVerificationCode, verifyCode, resendVerificationCode } from "@/lib/verify-actions"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

export default function VerifyDevicePage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [codeSent, setCodeSent] = useState(false)
  const router = useRouter()

  const handleSendCode = async (method: "email" | "phone") => {
    setSending(true)
    setMessage(null)

    try {
      const result = await sendVerificationCode(method)

      if (result.success) {
        setMessage({ type: "success", text: result.message || "Verification code sent!" })
        setCodeSent(true)
      } else {
        setMessage({ type: "error", text: result.error || "Failed to send code" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setSending(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) {
      setMessage({ type: "error", text: "Please enter the verification code" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const result = await verifyCode(code.trim())

      if (result.success) {
        setMessage({ type: "success", text: result.message || "Device verified successfully!" })

        // Redirect after verification
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 1500)
      } else {
        setMessage({ type: "error", text: result.error || "Verification failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setSending(true)
    setMessage(null)

    try {
      const result = await resendVerificationCode()

      if (result.success) {
        setMessage({ type: "success", text: "Verification code resent!" })
      } else {
        setMessage({ type: "error", text: result.error || "Failed to resend code" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Device Verification</CardTitle>
          <CardDescription>Verify this device for security purposes</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!codeSent ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Choose how you&apos;d like to receive your verification code:
              </p>

              <div className="grid grid-cols-1 gap-3">
                <Button onClick={() => handleSendCode("email")} disabled={sending} variant="outline" className="w-full">
                  {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                  Send Email Code
                </Button>

                <Button onClick={() => handleSendCode("phone")} disabled={sending} variant="outline" className="w-full">
                  {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Phone className="w-4 h-4 mr-2" />}
                  Send SMS Code
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div
                className="flex justify-center items-center flex-col"
              >
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter the 6-digit verification code
                </label>
                <InputOTP
                  className="w-full"
                  value={code}
                  placeholder="000000"
                  onChange={(e) => setCode(e.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot
                      className="w-14 h-14"
                      index={0} />
                    <InputOTPSlot
                      className="w-14 h-14"

                      index={1} />
                    <InputOTPSlot
                      className="w-14 h-14"

                      index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot
                      className="w-14 h-14"
                      index={3} />
                    <InputOTPSlot
                      className="w-14 h-14"
                      index={4} />
                    <InputOTPSlot
                      className="w-14 h-14"
                      index={5} />
                  </InputOTPGroup>
                </InputOTP>

              </div>

              <Button type="submit" disabled={loading || code.length !== 6} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Device"
                )}
              </Button>

              <div className="text-center">
                <Button type="button" variant="ghost" onClick={handleResendCode} disabled={sending} className="text-sm">
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend code"
                  )}
                </Button>
              </div>
            </form>
          )}

          {message && (
            <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
