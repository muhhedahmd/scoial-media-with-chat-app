import type { User } from "@prisma/client"

const MoreComponets = ({ user }: { user: User }) => {
  return (
    <div
      style={{
        height: "calc(100vh - 4rem)",
      }}
      className=" hidden md:flex bg-white rounded-md  p-4   shadow-sm w-1/4"
    ></div>
  )
}

export default MoreComponets
