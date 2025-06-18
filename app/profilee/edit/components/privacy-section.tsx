import { useFormContext } from "react-hook-form"
import { FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

export default function PrivacySection() {
  const { control } = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Profile Visibility</h3>

        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Public Profile</FormLabel>
            <FormDescription>Allow your profile to be visible to everyone</FormDescription>
          </div>
          <FormControl>
            <Switch defaultChecked />
          </FormControl>
        </FormItem>

        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Show Phone Number</FormLabel>
            <FormDescription>Display your phone number on your profile</FormDescription>
          </div>
          <FormControl>
            <Switch />
          </FormControl>
        </FormItem>

        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Show Birthdate</FormLabel>
            <FormDescription>Display your birthdate on your profile</FormDescription>
          </div>
          <FormControl>
            <Switch />
          </FormControl>
        </FormItem>
      </div>
    </div>
  )
}
