import Tip from "@/app/_components/Tip";
import { Button } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  useAddSaveCategoryMutation,
  useGetSaveCategoryQuery,
  useGetSavesByCategoryQuery,
  useGetSingleSaveByPostQuery,
  useToggleSaveMutation,
} from "@/store/api/apiSave";
import { Popover } from "@radix-ui/react-popover";
import { BookmarkIcon, Plus, Save, X } from "lucide-react";
import React, { memo, useState } from "react";
import SaveCategory from "./saveCategory";
import { cn } from "@/lib/utils";
import { Skeleton } from "@nextui-org/react";

const SavePopup = memo(({ userId, postId }: { userId: number; postId: number }) => {
  const [addSaveState, setAddSaveState] = useState(false);
  const [name, setName] = useState("");

  const {
    data: save,
    isFetching: isFetchingGetSave,
    isLoading: isLoadingGetSave,
    isSuccess,
  } = useGetSingleSaveByPostQuery({
    post_id: postId,
    userId: userId,
  });

  const {
    data: catagries,
    isLoading: loadingCatagries,
    isSuccess: SuccessCatagries,
  } = useGetSaveCategoryQuery({
    author_id: userId,
    skip: 0,
    take: 4,
  });


  const [addCategory, { isLoading: loadingAddCategory }] =
    useAddSaveCategoryMutation();

  const handleAddCategory = () => {
    try {
      if (name) {
        addCategory({
          author_id: userId,
          name: name,
        });
      }
      setName("");
      setAddSaveState(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [Toggle, {isLoading   }] = useToggleSaveMutation();
  const handleToggle = (cateName : string) => {
    Toggle({
      cateagory: cateName ,
      postId: postId,
      userId: userId,
    });
  };
  return (
    <Popover>
      <PopoverTrigger>
        {isFetchingGetSave || isLoadingGetSave ? (
          <Skeleton className="w-10 h-8 rounded-md bg-emerald-500 stroke-emerald-500" />
        ) : (
          <Button

            disabled={isFetchingGetSave || isLoadingGetSave}
            className="bg-emerald-100 p-2 md:p-3 h-auto lg:p-2 min-h-max hover:bg-emerald-200"
          >
            {save ? (
              <Tip
                trigger={
                  <BookmarkIcon
                    className={cn(
                      "w-5 h-5 text-white stroke-emerald-300  fill-white",
                      save && "fill-emerald-500 stroke-emerald-500"
                    )}
                  />
                }
                info={save?.Save_catagory?.name || ""}
              />
            ) : (
              <BookmarkIcon
                className={cn(
                  "w-5 h-5 text-white stroke-emerald-300  fill-white",
                  save && "fill-emerald-500 stroke-emerald-500"
                )}
              />
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent sideOffset={10} alignOffset={-50} className="w-fit p-2 ">
        <div>
          {isFetchingGetSave ||
            isLoadingGetSave ||
            (loadingCatagries && (
              <div className="p-2 flex flex-col justify-start items-center gap-3">
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-20 h-5" />
              </div>
            ))}

          <div className="flex justify-start gap-2 flex-col items-start ">
            {!loadingCatagries && SuccessCatagries && (
              <Button
              disabled={isLoading}
              onClick={()=>handleToggle('draft')}
                size={"default"}
                className={cn(  
                  save?.Save_catagory.name === "draft" &&
                  "bg-emerald-100 text-emerald-700  hover:bg-red-100 hover:text-gray-500" 
                  
                  ,"p-2 text-muted-foreground text-start flex justify-between items-center w-full text-[1rem] ")}
                variant={"ghost"}
              >
                draft
                <Save className="w-4 h-4 " />
              </Button>
            )}
            {catagries &&
              catagries.catagries.map((item, index) => (
                <SaveCategory
                  active={item.name === save?.Save_catagory?.name}

                  key={item.id}
                  item={item}
                  handleToggle={handleToggle}
                  disabled={isLoading}
                />
              ))}
          </div>
          {!addSaveState ? (
            <Button
              onClick={() => setAddSaveState(true)}
              variant={"ghost"}
              className=" h-5 py-3 flex items-center justify-start gap-2 "
            >
              <Plus size={"1.2rem"} className="text-muted-foreground text-xs" />
              <p className="text-muted-foreground text-sm">Add new</p>
            </Button>
          ) : null}
          {addSaveState ? (
            <div className=" h-5 py-3 flex items-center justify-start gap-2 ">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-b-1 border-b-gray-500 bg-slate-200 w-20 "
              />
              <Button
                disabled={loadingAddCategory}
                onClick={handleAddCategory}
                variant={"ghost"}
                className="py-1 px-2 h-max "
              >
                <Plus
                  size={"1.2rem"}
                  className="text-muted-foreground text-xs"
                />
              </Button>
              <Button
                onClick={() => setAddSaveState(false)}
                className="py-1 px-2 h-max bg-red-100 hover:bg-red-200 "
              >
              
              </Button>
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
})
SavePopup.displayName ="SavePopup"
export default SavePopup;
