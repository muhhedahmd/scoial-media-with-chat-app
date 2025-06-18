import { formatDistance } from "date-fns"

const TimeStamp = ({ created_at }: { created_at?: Date }) => {
  const time = formatDistance(new Date(created_at || ""), new Date())
  const shortTime = time
    .replace("minutes", "min")
    .replace("minute", "min")
    .replace("hours", "hrs")
    .replace("hour", "hr")
    .replace("days", "d")
    .replace("day", "d")
    .replace("weeks", "w")
    .replace("week", "w")
    .replace("months", "mo")
    .replace("month", "mo")
    .replace("years", "yr")
    .replace("year", "yr")
    .replace("about", "")

  return <p className="min-w-max text-sm text-gray-500">{shortTime}</p>
}

export default TimeStamp
