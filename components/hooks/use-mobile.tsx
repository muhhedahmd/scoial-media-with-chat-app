import { useMediaQuery } from "@uidotdev/usehooks";

export const useIsMobile = ()=>{
    const isMobile = useMediaQuery('(max-width: 768px)');
    return isMobile
}