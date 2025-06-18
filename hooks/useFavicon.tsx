import type React from "react"
import {
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  Globe,
  Gitlab,
  DiscIcon as Discord,
  Twitch,
  RssIcon as Reddit,
  PinIcon as Pinterest,
  TwitterIcon as TikTok,
  Slack,
  SunMediumIcon as Medium,
  Figma,
  DropletIcon as Dropbox,
  Trello,
  AirplayIcon as Spotify,
  ShoppingCartIcon as Paypal,
  VideoIcon as Vimeo,
  ZoomInIcon as Zoom,
  WebcamIcon as Skype,
  PhoneIcon as Whatsapp,
  TextIcon as Telegram,
  SnailIcon as Snapchat,
  DogIcon as Mastodon,
  SquareStackIcon as StackOverflow,
  FigmaIcon as Fiverr,
  ImageUpIcon as Upwork,
  NotebookIcon as Notion,
  WorkflowIcon as Wordpress,
  StoreIcon as Shopify,
  AppleIcon as Amazon,
  NetworkIcon as Netflix,
  HotelIcon as Airbnb,
  BusIcon as Uber,
  CarTaxiFrontIcon as Lyft,
  ChromeIcon as Google,
  DotIcon as Duckduckgo,
  DribbbleIcon as Behance,
  Dribbble,
} from "lucide-react"

const WEBSITE_ICONS = {
  // Social
  github: <Github className=" w-4 h-4 text-gray-800 dark:text-white" />,
  twitter: <Twitter className=" w-4 h-4 text-blue-400" />,
  x: <Twitter className=" w-4 h-4 text-black dark:text-white" />,
  instagram: <Instagram className=" w-4 h-4 text-pink-500" />,
  linkedin: <Linkedin className=" w-4 h-4 text-blue-600" />,
  youtube: <Youtube className=" w-4 h-4 text-red-600" />,
  facebook: <Facebook className=" w-4 h-4 text-blue-600" />,
  reddit: <Reddit className=" w-4 h-4 text-orange-500" />,
  pinterest: <Pinterest className=" w-4 h-4 text-red-500" />,
  tiktok: <TikTok className=" w-4 h-4 text-black dark:text-white" />,
  snapchat: <Snapchat className=" w-4 h-4 text-yellow-400" />,
  discord: <Discord className=" w-4 h-4 text-indigo-500" />,
  "twitch.tv": <Twitch className=" w-4 h-4 text-purple-500" />,
  "mastodon.social": <Mastodon className=" w-4 h-4 text-purple-600" />,

  // Tech/Dev
  gitlab: <Gitlab className=" w-4 h-4 text-orange-500" />,
  stackoverflow: <StackOverflow className=" w-4 h-4 text-orange-500" />,
  medium: <Medium className=" w-4 h-4 text-black dark:text-white" />,
  "behance.net": <Behance className=" w-4 h-4 text-blue-600" />,
  dribbble: <Dribbble className=" w-4 h-4 text-pink-500" />,
  figma: <Figma className=" w-4 h-4 text-purple-500" />,
  "notion.so": <Notion className=" w-4 h-4 text-black dark:text-white" />,
  trello: <Trello className=" w-4 h-4 text-blue-500" />,

  // Media
  spotify: <Spotify className=" w-4 h-4 text-green-500" />,
  vimeo: <Vimeo className=" w-4 h-4 text-blue-500" />,
  netflix: <Netflix className=" w-4 h-4 text-red-600" />,

  // Tools
  slack: <Slack className=" w-4 h-4 text-purple-500" />,
  zoom: <Zoom className=" w-4 h-4 text-blue-500" />,
  skype: <Skype className=" w-4 h-4 text-blue-400" />,
  whatsapp: <Whatsapp className=" w-4 h-4 text-green-500" />,
  "telegram.org": <Telegram className=" w-4 h-4 text-blue-400" />,
  dropbox: <Dropbox className=" w-4 h-4 text-blue-500" />,

  // Ecommerce
  shopify: <Shopify className=" w-4 h-4 text-green-600" />,
  amazon: <Amazon className=" w-4 h-4 text-orange-400" />,
  paypal: <Paypal className=" w-4 h-4 text-blue-500" />,
  fiverr: <Fiverr className=" w-4 h-4 text-green-500" />,
  upwork: <Upwork className=" w-4 h-4 text-green-500" />,

  // Other
  wordpress: <Wordpress className=" w-4 h-4 text-blue-500" />,
  google: <Google className=" w-4 h-4 text-blue-500" />,
  duckduckgo: <Duckduckgo className=" w-4 h-4 text-yellow-500" />,
  airbnb: <Airbnb className=" w-4 h-4 text-pink-500" />,
  uber: <Uber className=" w-4 h-4 text-black dark:text-white" />,
  lyft: <Lyft className=" w-4 h-4 text-pink-500" />,
}

interface WebsiteIconProps {
  domain: string
  size?: number
}

const WebsiteIcon: React.FC<WebsiteIconProps> = ({ domain, size = 20 }) => {
  const icon = WEBSITE_ICONS[domain]

  if (icon) {
    return icon
  }

  return (
    <>
      {/* Fallback 1: Google Favicon API */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}`}
        alt={`${domain} favicon`}
        width={size}
        height={size}
        className="rounded"
        onError={(e) => {
          // Fallback 2: Generic globe icon if favicon fails
          e.target.style.display = "none"
          document.getElementById(`fallback-${domain}`)?.classList.remove("hidden")
        }}
      />
      <Globe
        id={`fallback-${domain}`}
        width={size}
        height={size}
        className="text-gray-500 dark:text-gray-400 rounded hidden"
      />
    </>
  )
}

export default WebsiteIcon
