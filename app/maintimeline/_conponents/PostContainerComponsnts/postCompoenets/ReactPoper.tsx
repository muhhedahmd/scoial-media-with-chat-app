import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useToggleReactMutation } from "@/store/api/apiSlice";
import { ReactionType } from "@prisma/client";
import { Angry, Frown, Heart, Laugh, PartyPopper, ThumbsUp } from "lucide-react";

const getColor = (type: string) => {
    switch (type) {
      case "like":
        return "text-blue-500 hover:text-blue-200  ";
      case "haha":
        return "hover:text-orange-200 text-orange-500 ";
      case "angry":
        return "hover:text-red-200 text-red-500 ";
      case "love":
        return "hover:text-pink-200 text-pink-500 ";
      case "sad":
        return "hover:text-gray-200 text-gray-500";
      case "wow":
        return "hover:text-purple-200 text-purple-500 ";
      default:
        return "text-green-500 hover:text-green-200 ";
    }
  };
  const getEmoji = (type: string, findReactions: string[]) => {
    switch (type) {
      case "like":
        return (
          <ThumbsUp
            className={`w-6 h-6 ${findReactions.includes(type) ? "fill-blue-500 text-white glow-blue" : "hover:fill-blue-500 hover:glow-blue"}`}
          />
        );
      case "haha":
        return (
          <Laugh
            className={`w-6 h-6 ${findReactions.includes(type) ? "fill-orange-500 text-white glow-orange" : "hover:fill-orange-500 hover:glow-orange"}`}
          />
        );
      case "angry":
        return (
          <Angry
            className={`w-6 h-6 ${findReactions.includes(type) ? "fill-red-500 text-white glow-red" : "hover:fill-red-500 hover:glow-red"}`}
          />
        );
      case "love":
        return (
          <Heart
            className={`w-6 h-6 ${findReactions.includes(type) ? "fill-pink-500 text-white glow-pink" : "hover:fill-pink-500 hover:glow-pink"}`}
          />
        );
      case "sad":
        return (
          <Frown
            className={`w-6 h-6 ${findReactions.includes(type) ? "fill-gray-500 text-white glow-gray" : "hover:fill-gray-500 hover:glow-gray"}`}
          />
        );
      case "wow":
        return (
          <PartyPopper
            className={`w-4 h-4 ${findReactions.includes(type) ? "fill-purple-500  glow-purple text-purple-500" : "  hover:fill-purple-500 hover:glow-purple"}`}
          />
        );
      default:
        return <PartyPopper />;
    }
  };
  interface ReactPoper{
    author_id : number,
    postId:number,

    userId:number
    findReactions : string[]  
  }
export function ReactPoper({author_id ,postId , userId, findReactions}:ReactPoper) {

const {toast} = useToast()
const [ ToggleReact, { isLoading , isSuccess ,data  }] = useToggleReactMutation()
    const onToggle = (ReactName :ReactionType)=>{
      ToggleReact({
        userId:userId 
        ,postId ,
        reactionType :ReactName
      }).then((res)=>{
        if(res.data){
          toast({title :"Reaction Added",
            variant:"success"

          })
          }

      }).catch((err)=>{
        toast({title :"Error",
          variant:"destructive"
          })

      })

    }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className=" w-1/3  flex justify-center items-center gap-2 h-9 text-muted-foreground">
          React
          <Heart className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex justify-start items-center gap-4">
        {Object.keys(ReactionType).map((ReactName , i )=>{
            return <Button
            onClick={()=>onToggle(ReactName as ReactionType)}
            variant={"ghost"} 
            size={"icon"}
            className={cn(`${getColor(ReactName)} bg-white  hover:bg-white flex justify-center items-center `  )}
            key={i}>
           {getEmoji(ReactName, findReactions)}
      </Button>
        })}

        </div>
      </PopoverContent>
    </Popover>
  );
}
