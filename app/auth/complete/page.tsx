"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useForm, Controller, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import {
  User,
  Phone,
  CalendarIcon,
  Briefcase,
  Camera,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Heart,
  Star,
  Zap,
  LocateIcon,
  Lock,
  Unlock,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { useCompleteProfileMutation, useGetProfileQuery, useUpdateUserInfoMutation } from "@/store/api/apiProfile"
import { useSelector } from "react-redux"
import { userResponse } from "@/store/Reducers/mainUser"
import Pics from "./_comp/Pics"
import useImageFile from "@/hooks/ImgaeInfo"
import EnhancedLocationPicker from "@/app/_components/location-picker/page"
import SocialLinksSection from "@/app/profilee/edit/components/social-links-section"
import { Swiper, type SwiperRef, SwiperSlide } from "swiper/react"
import { EffectCreative } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/effect-creative"
import { Gender, Role } from "@prisma/client"
import { useGSAP } from "@gsap/react"

import { useSession } from "next-auth/react"
import { next_auth_session, typeProfileWithPic } from "@/Types"

const ProfileSchemaRestrict = z.object({
  Email: z.string().email("Invalid email address").optional(),
  role: z.nativeEnum(Role, { message: "Invalid role" }).optional(),
  gender: z.nativeEnum(Gender, { message: "Invalid gender" }).optional(),
  first_name: z
    .string()
    .min(1, "First name is required")
    .regex(/^[^\s]+$/, "No spaces allowed")
    .optional(),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[^\s]+$/, "No spaces allowed")
    .optional(),
  user_name: z
    .string()
    .min(1, "Username is required")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must only contain letters, numbers, or underscores and no spaces")
    .optional(),
  bio: z.string().optional(),
  removeProfilePic: z.enum(["keep", "update", "remove"]).optional(),
  removeCoverPic: z.enum(["keep", "update", "remove"]).optional(),
  profile_picture:
    typeof window !== "undefined"
      ? z
        .instanceof(File, {
          message: "Profile picture must be a valid file",
        })
        .refine((file) => file.type.startsWith("image/"), {
          message: "Profile picture must be an image file",
        })
        .nullable()
        .optional()
      : z.any().nullable().optional(),
  cover_picture:
    typeof window !== "undefined"
      ? z
        .instanceof(File, {
          message: "Cover picture must be a valid file",
        })
        .refine((file) => file.type.startsWith("image/"), {
          message: "Cover picture must be an image file",
        })
        .nullable()
        .optional()
      : z.any().nullable().optional(),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    street: z.string().optional(),
    // city: "",
    // state: "",
    zip: z.any().optional(),
    // country: "",

  }).optional(),
  birthdate: z.preprocess(
    (val) => {
      if (typeof val === "string" || val instanceof Date) {
        return new Date(val)
      }
    },
    z.date({ message: "Invalid birthdate" }),
  ),
  PhoneNumber: z
    .string()
    .refine((val) => {
      // If empty or just whitespace, it's valid (optional field)
      if (!val || val.trim() === "") return true

      // Comprehensive phone validation
      // Must start with + followed by country code (1-3 digits) and then 7-12 more digits
      const phoneRegex = /^\+[1-9]\d{0,3}\d{7,12}$/

      return phoneRegex.test(val.replace(/[\s\-$$$$]/g, ""))
    }, "Please enter a valid phone number (e.g., +1234567890)")
    .optional(),
  title: z.string().optional(),
  website: z.record(z.string(), z.string().url("Website must be a valid URL")).optional(),
})

type FormData = z.infer<typeof ProfileSchemaRestrict>

// Step configuration with proper ordering
const STEPS = [
  {
    id: 1,
    title: "Basic",
    subtitle: "Personal info",
    icon: User,
    description: "Your name and basic details",
    fields: ["first_name", "last_name", "user_name", "gender"] as const,
  },
  {
    id: 2,
    title: "About",
    subtitle: "Your story",
    icon: Briefcase,
    description: "Tell us what you do",
    fields: ["title", "bio"] as const,
  },
  {
    id: 3,
    title: "Photos",
    subtitle: "Profile pics",
    icon: Camera,
    description: "Add your profile and cover photos",
    fields: ["profile_picture", "cover_picture"] as const,
  },
  {
    id: 4,
    title: "Contact",
    subtitle: "Details",
    icon: Phone,
    description: "How can people reach you?",
    fields: ["PhoneNumber", "birthdate"] as const,
  },
  {
    id: 5,
    title: "Location",
    subtitle: "Where you are",
    icon: LocateIcon,
    description: "Your location",
    fields: ["location"] as const,
  },
  {
    id: 6,
    title: "Social",
    subtitle: "Connect",
    icon: Globe,
    description: "Link your social profiles",
    fields: ["website"] as const,
  },
] as const

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male", emoji: "👨" },
  { value: "FEMALE", label: "Female", emoji: "👩" },
  { value: "OTHER", label: "Other", emoji: "🧑" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say", emoji: "❓" },
] as const

// Loading Screen Component
const LoadingScreen = () => (

  <div className="min-h-screen flex flex-col justify-center items-center py-4 px-4">
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-2">
        Loading Your Profile
      </h1>
      <p className="text-muted-foreground text-center mb-8">
        We&apos;re fetching your information to help complete your profile...
      </p>
      <div className="w-full max-w-md">
        <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </div>
  </div>
)

export default function CompleteProfilePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [basicInfoUnlocked, setBasicInfoUnlocked] = useState(false)

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const swiperRef = useRef<SwiperRef>(null)

  // Redux state
  const cachedUser = useSelector(userResponse)
  // complete Profile 
  const {
    data: sessionData,
    update: updateSession,

  } = useSession()
  const session = sessionData!


  const [complete, {
    isLoading,
    isSuccess,
  }] = useCompleteProfileMutation()

  // Form setup with clean initial state
  const form = useForm<FormData>({
    resolver: zodResolver(ProfileSchemaRestrict),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      user_name: "",
      Email: "",
      gender: "MALE",
      PhoneNumber: "",
      title: "",
      bio: "",
      birthdate: new Date(),
      location: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      website: {},
      cover_picture: null,
      profile_picture: null,
    },
  })

  // API query
  const {
    data: profileData,
    isLoading: profileLoading,
    isFetching: profileFetching,
  } = useGetProfileQuery({ userId: cachedUser?.id! }, { skip: !cachedUser?.id })

  // Location state for step 5


  // Show loading screen while fetching data



  // Memoize initial data to prevent infinite loops
  const initialData = useMemo(() => {
    if (!profileData || !cachedUser) return null

    return {
      first_name: cachedUser.first_name || "",
      last_name: cachedUser.last_name || "",
      user_name: cachedUser.user_name || "",
      Email: cachedUser.email || "",
      PhoneNumber: profileData.PhoneNumber?.toString() || "",
      title: profileData.title || "",
      bio: profileData.bio || "",
      location: profileData.location || {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      website: (profileData.website as object) || {},
      birthdate: profileData.birthdate ? new Date(profileData.birthdate) : new Date(),
    }
  }, [profileData, cachedUser])

  // Load initial data only once with proper dependencies
  useEffect(() => {
    if (initialData && !dataLoaded) {
      console.log("Loading initial data:", initialData)

      // Set each field individually to avoid any cross-contamination
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.setValue(key as keyof FormData, value)
        }
      })
      form.setValue("website", (profileData?.website as Record<string, string>) || {})

      // Special handling for phone number to ensure proper format
      if (initialData.PhoneNumber) {
        const phoneValue = initialData.PhoneNumber.toString()
        // Ensure phone number has proper format with country code
        if (phoneValue && !phoneValue.startsWith("+")) {
          form.setValue("PhoneNumber", `+${phoneValue}`)
        }
      }

      setDataLoaded(true)
    }
  }, [initialData, dataLoaded, form, profileData?.website])

  // Memoize watched values to prevent unnecessary re-renders
  const profilePicture = form.watch("profile_picture")
  const coverPicture = form.watch("cover_picture")

  const {
    dimensions: profileDimensions,
    error: profileError,
    isLoading: profileImageLoading,
    url: profileImageUrl,
    blurHash: profileBlurHash,
  } = useImageFile(profilePicture)

  const {
    dimensions: coverDimensions,
    error: coverError,
    isLoading: coverImageLoading,
    url: coverImageUrl,
    blurHash: coverBlurHash,
  } = useImageFile(coverPicture)

  // Memoize existing pictures to prevent re-renders
  const existingProfilePic = useMemo(
    () => profileData?.profilePictures?.find((pic) => pic.type === "profile"),
    [profileData?.profilePictures],
  )

  const existingCoverPic = useMemo(
    () => profileData?.profilePictures?.find((pic) => pic.type === "cover"),
    [profileData?.profilePictures],
  )

  // Memoize location string to prevent infinite updates
  // const locationString = useMemo(() => {
  //   return Object.values(locationData).filter(Boolean).join(", ")
  // }, [locationData])

  // Update location in form when location picker changes (with proper dependencies)
  // useEffect(() => {
  //   if (locationData && locationData !== form.getValues("location")) {
  //     form.setValue("location", locationString, { shouldDirty: true })
  //   }
  // }, [locationString, form])

  // Update progress bar when step changes
  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${((currentStep + 1) / STEPS.length) * 100}%`,
        duration: 0.6,
        ease: "power2.out",
      })
    }
  }, [currentStep])

  // Initial page load animation
  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
    }
  }, [])

  const validateCurrentStep = useCallback(async () => {
    const currentStepConfig = STEPS[currentStep]
    if (!currentStepConfig) return true

    const fieldsToValidate = currentStepConfig.fields
    console.log("Validating fields:", fieldsToValidate)

    try {
      // Always trigger validation for all fields in the current step
      const isValid = await form.trigger(fieldsToValidate as any)
      console.log("Trigger result:", isValid)

      // Log individual field states for debugging
      fieldsToValidate.forEach((field) => {
        const fieldState = form.getFieldState(field)
        const fieldValue = form.getValues(field)
        console.log(`Field ${field}:`, {
          value: fieldValue,
          error: fieldState.error,
          invalid: fieldState.invalid,
        })
      })

      // Special handling for phone number validation
      if (fieldsToValidate.includes("PhoneNumber")) {
        const phoneValue = form.getValues("PhoneNumber")
        const phoneFieldState = form.getFieldState("PhoneNumber")

        // console.log("Phone validation details:", {
        //   value: phoneValue,
        //   error: phoneFieldState.error,
        //   invalid: phoneFieldState.invalid,
        //   isEmpty: !phoneValue || phoneValue.trim() === "",
        // })

        // If phone has a value but is invalid, return false
        if (phoneValue && phoneValue.trim() !== "" && phoneFieldState.error) {
          console.log("Phone number has value but is invalid")
          return false
        }
      }

      return isValid
    } catch (error) {
      console.error("Validation error:", error)
      return false
    }
  }, [currentStep, form])

  const nextStep = useCallback(async () => {
    console.log("Attempting to go to next step...")

    const isValid = await validateCurrentStep()
    console.log("Step validation result:", isValid)

    if (isValid && swiperRef.current && currentStep < STEPS.length - 1) {
      console.log("Moving to next step:", currentStep + 1)
      swiperRef.current?.swiper.slideNext()
    } else {
      console.log("Validation failed or already at last step")
      // Force show validation errors for current step
      const currentStepConfig = STEPS[currentStep]
      if (currentStepConfig) {
        await form.trigger(currentStepConfig.fields as any)
      }
    }
  }, [currentStep, validateCurrentStep, form])

  const prevStep = useCallback(() => {
    if (!swiperRef.current) return
    if (currentStep > 0) {
      swiperRef.current?.swiper.slidePrev()
    }
  }, [currentStep])

  // const [updateUser, { isLoading: updateUserStatus }] = useUpdateUserInfoMutation()
  // const dispatch = useDispatch<AppDispatch>()
  // Form submission with useCallback
  const onSubmit = (data: FormData) => {

    console.log("Submitting profile data:", data)
    setLoading(true)
    try {

      console.log("Submitting profile data:", data);

      const formData = new FormData()

      Object.keys(data).forEach((k) => {
        const key = k as keyof typeof data
        if (
          key === "Email" ||
          key === "user_name" ||
          key === "first_name" ||
          key === "last_name" ||
          key === "gender" ||
          key === "role"
        ) {
          return
        }
        if (
          typeof data[key] === "object" &&
          k !== "cover_picture" &&
          k !== "birthdate" &&
          k !== "profile_picture"
        ) {
          formData.append(k, JSON.stringify(data[key]))
        } else if (data[key] instanceof File) {
          formData.append(k, data[key])
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(k, String(data[key]).trim())
        }
      })

      formData.append("DimantionNewProfile", JSON.stringify(profileDimensions))
      formData.append("blurHashProfileNew", profileBlurHash || "")
      formData.append("DimantionNewCover", JSON.stringify(coverDimensions))
      formData.append("blurHashCoverNew", coverBlurHash || "")

      complete(formData).then((res) => {

        const upData = res.data as typeProfileWithPic
        const __upData = {
          isCompleteProfile: upData.isCompleteProfile,
          user_id: upData.user_id,
          created_at: upData.created_at,
          updated_at: upData.updated_at,
          id: upData.id
        }

        const newSwssion: next_auth_session = {


          user: {
            first_name: session?.user?.first_name,
            last_name: session?.user?.last_name,
            gender: session?.user.gender,
            user_name: session?.user.user_name,
            role: session?.user.role,
            id: session?.user.id,
            expiresAt: session?.user.expiresAt,
            isPrivate: session?.user.isPrivate,
            created_at: session?.user.created_at,
            updated_at: session?.user.updated_at,
            timezone: session?.user.timezone,
            is_2FA: session?.user.is_2FA,
            is_verified: session?.user.is_verified,

            profile: {
              ...__upData
            },
            session: {
              id: session?.user.session.id ?? '',
              userId: session?.user.session?.userId ?? 0,
              createdAt: session?.user.session?.createdAt ?? null,
              expires: session?.user.session?.expires ?? new Date(),
              is2FACompleted: session?.user.session?.is2FACompleted ?? null,
              isDeviceVerfcation: session?.user.session?.isDeviceVerfcation ?? null,
            }
          }
        }
        console.log("Profile completed successfully", upData, newSwssion);
        updateSession({
          ...newSwssion

        }).then(() => {
          console.log("Session Updated",
            newSwssion,
          );
        })


        console.log("Profile completed successfully", res);

      })
      // Handle form submission logic here











      // Success animation
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          scale: 1.02,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        })
      }

      // Navigate to success page or dashboard
      // router.push("/dashboard")
    } catch (error) {
      console.error("Error completing profile:", error)
    } finally {
      setLoading(false)
    }
  }

  // Memoized location setter to prevent re-renders
  // const handleLocationChange = useCallback((newLocation: typeof locationData) => {
  //   setLocationData(newLocation)
  // }, [])

  const handleSlideChange = useCallback((swiper: any) => {
    setCurrentStep(swiper.activeIndex)
  }, [])



  // Step components (memoized to prevent re-renders)
  const BasicInfoStep = useCallback(

    () => (
      <div className="space-y-4 bg-inherit">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            Basic Information
          </h2>
          <p className="text-sm text-muted-foreground">Information from your signup</p>
        </div>

        {/* Unlock Toggle */}
        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200 mb-4">
          <div className="flex items-center gap-3">
            {basicInfoUnlocked ? (
              <Unlock className="w-5 h-5 text-emerald-600" />
            ) : (
              <Lock className="w-5 h-5 text-emerald-600" />
            )}
            <div>
              <p className="font-medium text-emerald-800">
                {basicInfoUnlocked ? "Edit Mode Enabled" : "Information Locked"}
              </p>
              <p className="text-sm text-emerald-600">
                You can now modify after complete your profile

              </p>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name" className="text-sm font-medium">
              First Name
            </Label>
            <Controller
              name="first_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="first_name"
                    placeholder="John"
                    disabled={!basicInfoUnlocked}
                    className={cn(
                      "mt-1 h-10 border-2 focus:border-emerald-400 focus:ring-emerald-200 transition-all duration-200",
                      !basicInfoUnlocked && "bg-gray-50 cursor-not-allowed",
                    )}
                  />
                  {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
                </>
              )}
            />
          </div>

          <div>
            <Label htmlFor="last_name" className="text-sm font-medium">
              Last Name
            </Label>
            <Controller
              name="last_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="last_name"
                    placeholder="Doe"
                    disabled={!basicInfoUnlocked}
                    className={cn(
                      "mt-1 h-10 border-2 focus:border-emerald-400 focus:ring-emerald-200 transition-all duration-200",
                      !basicInfoUnlocked && "bg-gray-50 cursor-not-allowed",
                    )}
                  />
                  {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
                </>
              )}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="user_name" className="text-sm font-medium">
            Username
          </Label>
          <Controller
            name="user_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id="user_name"
                  placeholder="johndoe"
                  disabled={!basicInfoUnlocked}
                  className={cn(
                    "mt-1 h-10 border-2 focus:border-emerald-400 focus:ring-emerald-200 transition-all duration-200",
                    !basicInfoUnlocked && "bg-gray-50 cursor-not-allowed",
                  )}
                />
                {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Gender</Label>
          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
                  {GENDER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      disabled={!basicInfoUnlocked}
                      onClick={() => basicInfoUnlocked && field.onChange(option.value)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all duration-200 text-center",
                        field.value === option.value
                          ? "border-emerald-400 bg-emerald-50 shadow-md"
                          : "border-gray-200 hover:border-emerald-200",
                        !basicInfoUnlocked && "opacity-50 cursor-not-allowed",
                        basicInfoUnlocked && "hover:scale-105",
                      )}
                    >
                      <div className="text-lg mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium leading-tight">{option.label}</div>
                    </button>
                  ))}
                </div>
                {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>
      </div>
    ),
    [form.control, basicInfoUnlocked],
  )

  const AboutStep = useCallback(
    () => (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            Tell us about yourself
          </h2>
          <p className="text-sm text-muted-foreground">Tell us what you do</p>
        </div>

        <div>
          <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
            <Briefcase className="w-3 h-3" />
            Your Title
          </Label>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id="title"
                  placeholder="e.g. Frontend Developer, Designer, Student"
                  className="mt-1 h-10 border-2 focus:border-emerald-400 focus:ring-emerald-200 transition-all duration-200"
                />
                {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>

        <div>
          <Label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
            <Heart className="w-3 h-3" />
            Bio
          </Label>
          <Controller
            name="bio"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Textarea
                  {...field}
                  id="bio"
                  placeholder="Tell us about yourself, your interests, and what you do..."
                  className="mt-1 min-h-[100px] text-sm border-2 focus:border-emerald-400 focus:ring-emerald-200 resize-none transition-all duration-200"
                />
                {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>
      </div>
    ),
    [form.control],
  )

  const PhotosStep = useCallback(
    () => (
      <Pics
        selectiveBlurProfile={{
          dimensions: profileDimensions,
          isLoading: profileImageLoading,
          url: profileImageUrl,
          blurHash: profileBlurHash,
        }}
        selectiveBlurCover={{
          dimensions: coverDimensions,
          isLoading: coverImageLoading,
          url: coverImageUrl,
          blurHash: coverBlurHash,
        }}
        blurProfile={existingProfilePic}
        blurCover={existingCoverPic}
      />
    ),
    [
      profileDimensions,
      profileImageLoading,
      profileImageUrl,
      profileBlurHash,
      coverDimensions,
      coverImageLoading,
      coverImageUrl,
      coverBlurHash,
      existingProfilePic,
      existingCoverPic,
    ],
  )

  const ContactStep = useCallback
    (


      () => (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Contact details
            </h2>
            <p className="text-sm text-muted-foreground">How can people reach you?</p>
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
              <Phone className="w-3 h-3" />
              Phone Number (Optional)
            </Label>
            <Controller
              name="PhoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <div className="mt-1 phone-input-wrapper w-full">
                    <PhoneInput
                      style={{
                        backgroundColor: "transparent",
                      }}
                      value={field.value || ""}
                      onChange={(value) => {
                        console.log("Phone value changed:", value)
                        field.onChange(value || "")
                        // Trigger validation immediately after change
                        setTimeout(() => {
                          form.trigger("PhoneNumber")
                        }, 100)
                      }}
                      onBlur={() => {
                        // Also trigger validation on blur to catch default values
                        form.trigger("PhoneNumber")
                      }}
                      defaultCountry="EG"
                      name="PhoneNumber"
                      placeholder="Enter phone number"
                      className="phone-input-compact w-full"
                      international
                      withCountryCallingCode
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: +[country code][number] (e.g., +1234567890)
                  </p>
                  {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
                </>
              )}
            />
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-3 h-3" />
              Birth Date (Optional)
            </Label>
            <Controller
              name="birthdate"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-10 text-sm pl-3 text-left font-normal border-2 focus:border-emerald-400 focus:ring-emerald-200 transition-all duration-200 mt-1",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? field.value.toLocaleDateString() : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
                </>
              )}
            />
          </div>
        </div>
      ),
      [form],
    )

  const LocationStep = useCallback(
    () => <FormProvider {...form}>

      <EnhancedLocationPicker
        className="h-[31rem] w-full"

      />
    </FormProvider>
    , [form],
  )

  const SocialStep = useCallback(
    () => (
      <FormProvider {...form}>

        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Connect your socials
            </h2>
            <p className="text-sm text-muted-foreground">Link your social profiles</p>
          </div>
          <SocialLinksSection />
        </div>
      </FormProvider>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  if (profileLoading || profileFetching || !dataLoaded) {
    return <LoadingScreen />
  }
  // Form setup with clean initial state

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center items-center py-4 px-4 overflow-x-hidden"
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Complete Your Profile
              </h1>
              <p className="text-sm text-muted-foreground">Let&apos;s get to know you better</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-600 shadow-sm"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between items-center mb-4 px-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all duration-300 mb-1",
                    currentStep >= index
                      ? "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-500 text-white shadow-lg"
                      : currentStep === index - 1
                        ? "bg-emerald-50 border-emerald-300 text-emerald-600"
                        : "bg-white border-gray-300 text-gray-400",
                  )}
                >
                  {currentStep > index ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                </div>
                <p
                  className={cn(
                    "text-xs font-medium text-center max-w-16 transition-colors duration-300 leading-tight",
                    currentStep >= index ? "text-emerald-600" : "text-gray-400",
                  )}
                >
                  {step.title}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 text-xs">
              <Star className="w-3 h-3 mr-1" />
              Step {currentStep + 1} of {STEPS.length}
            </Badge>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 px-3 py-1 text-xs">
              <Zap className="w-3 h-3 mr-1" />
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
            </Badge>
          </div>
        </div>

        {/* Form Content */}
        <form>
          <Card ref={cardRef} className="border-2 border-emerald-100 shadow-xl backdrop-blur-sm">
            <CardContent className="p-6">
              <FormProvider {...form}>
                <Swiper
                  modules={[EffectCreative]}
                  spaceBetween={50}
                  slidesPerView={1}
                  onSlideChangeTransitionStart={(swiper) => {
                    console.log("Transition Start", swiper.activeIndex)
                  }}
                  onSlideChangeTransitionEnd={(swiper) => {
                    console.log("Transition End", swiper.activeIndex)
                  }}
                  creativeEffect={{
                    prev: {
                      opacity: 0,
                      shadow: true,
                      scale: 0.8,
                      translate: [0, 0, -400],
                    },
                    next: {
                      shadow: true,
                      translate: ["100%", 0, 0],
                    },
                  }}
                  effect={"creative"}
                  allowTouchMove={false}
                  ref={swiperRef}
                  onSlideChange={handleSlideChange}
                  className=" md:h-full h-[400px] overflow-auto"
                >
                  <SwiperSlide className="overflow-auto h-max">
                    <div className=" ">
                      <BasicInfoStep />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="slide-content">
                      <AboutStep />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide

                  >
                    <div className="slide-content">
                      <PhotosStep />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="slide-content">
                      <ContactStep />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="slide-content">
                      <LocationStep />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="slide-content">
                      <SocialStep />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </FormProvider>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-4 border-t border-emerald-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 h-10 px-4 border-2 border-gray-200 hover:border-emerald-300 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white flex items-center gap-2 h-10 px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onSubmit(form.getValues())
                    }}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white flex items-center gap-2 h-10 px-6 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        Complete
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      <style jsx global>{`
        .phone-input-compact {
          width: 100% !important;
        }
        .phone-input-compact .PhoneInputInput {
          border: 2px solid hsl(var(--border));
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          height: 2.5rem;
          transition: all 0.2s;
          background: var(--primary);
          width: 100%;
        }
        .phone-input-compact .PhoneInputInput:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        .phone-input-compact .PhoneInputCountrySelect {
          border: 2px solid hsl(var(--border));
          border-radius: 8px;
          margin-right: 0.5rem;
          height: 2.5rem;
          background: var(--primary);
          color: #10b981;
          min-width: 3.5rem;
        }
        .phone-input-compact .PhoneInputCountrySelect:focus {
          border-color: #10b981;
          background: var(--primary);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        .phone-input-wrapper {
          width: 100%;
          overflow: hidden;
        }

        .slide-content {
          padding: 0.5rem;
          height: 100%;
        }
        .swiper-slide {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .swiper-slide-active {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
