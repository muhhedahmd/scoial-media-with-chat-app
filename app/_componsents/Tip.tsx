import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import React from "react";

const Tip = ({
  trigger,
  align,
  sideOffset,
  side,
  info,
}: {
  trigger: React.ReactElement;
  info: React.ReactElement | string | number;
  align? :"center" | "end" | "start"  | undefined 
  sideOffset?: number 
  side? :"top" | "right" | "bottom" | "left" | undefined
}) => {
  return (
    <TooltipProvider
    
    // key={idx}
    >
      <Tooltip
      
      delayDuration={0}>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent
        align={ align || undefined}
        sideOffset={sideOffset || undefined}
        side={side || undefined}
        >{info}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Tip;
