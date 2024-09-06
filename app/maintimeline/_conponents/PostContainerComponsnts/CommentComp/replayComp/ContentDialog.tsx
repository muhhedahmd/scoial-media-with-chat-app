import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ContentDialog = ({ content }: { content: string }) => {
  return (
    <div className=" min-w-[20rem] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
    <div className={`whitespace-pre-line ${content.length > 100 ? "line-clamp-5" : ""}`}>
      {content.length > 100 ? (
        <>
          <span>{content.slice(0, 100)}...</span>
          <Dialog>
            <DialogTrigger className="text-blue-500 cursor-pointer">Read More</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Full Reply</DialogTitle>
              </DialogHeader>
              <p className="whitespace-pre-line">{content}</p>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        content
      )}
    </div>
  </div>
  );
};

export default ContentDialog ;
