"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {  Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SocialLink = {
  platform: string
  url: string
}

export default function SocialLinksSection() {
  const {  watch, setValue } = useFormContext(

  )
  const websiteValue = watch("website") || {}

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    Object.entries(websiteValue).map(([platform, url]) => ({
      platform,
      url: url as string,
    })),
  )

  const addLink = (inputValue : string) => {
    try {
      const url = new URL(inputValue);
      const hostname = url.hostname.replace(/^www\./, "").replace(/\.[^.]+$/, "");

      const updatedValues = hostname
      // console.log(updatedValues, onChange, value)
      // onChange(updatedValues)

      // setInputValue(""); // Clear input field after adding

      return updatedValues
    } catch (error) {
      return null
      console.error("Invalid URL format", error);
    }
  };

  const addSocialLink = () => {
    const newLinks = [...socialLinks, { platform: "", url: "" }]
    
    setSocialLinks(newLinks)
    updateWebsiteField(newLinks)
  }

  const removeSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index)
    setSocialLinks(newLinks)
    updateWebsiteField(newLinks)
  }

const updateSocialLink = (index: number, field: "platform" | "url", value: string) => {
  const newLinks = [...socialLinks];

  if (field === "url") {
    const platform = addLink(value); // extract platform from URL

    if (platform) {
      newLinks[index] = {
        platform,
        url: value,
      };
    } else {
      newLinks[index][field] = value; // fallback to just update url
    }
  } else {
    newLinks[index][field] = value;
  }

  setSocialLinks(newLinks);
  updateWebsiteField(newLinks);
};

  const updateWebsiteField = (links: SocialLink[]) => {
    const websiteObject = links.reduce(
      (acc, { platform, url }) => {
        if (platform && url) {
          acc[platform] = url
        }
        return acc
      },
      {} as Record<string, string>,
    )

    setValue("website", websiteObject, { shouldDirty: true })
  }

  // const getPlatformIcon = (platform: string) => {
  //   switch (platform.toLowerCase()) {
  //     case "instagram":
  //       return <Instagram className="w-4 h-4" />
  //     case "twitter":
  //       return <Twitter className="w-4 h-4" />
  //     case "facebook":
  //       return <Facebook className="w-4 h-4" />
  //     case "linkedin":
  //       return <Linkedin className="w-4 h-4" />
  //     case "github":
  //       return <Github className="w-4 h-4" />
  //     default:
  //       return <Globe className="w-4 h-4" />
  //   }
  // }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-32">
              <Select value={link.platform} onValueChange={(value) => updateSocialLink(index, "platform", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={link.platform} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Input
                value={link.url}
                onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeSocialLink(index)}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addSocialLink} className="gap-1">
        <Plus className="w-4 h-4" />
        Add Social Link
      </Button>
    </div>
  )
}
