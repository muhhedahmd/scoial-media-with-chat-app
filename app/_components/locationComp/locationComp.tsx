"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Locate, MapPin, X } from "lucide-react";
import { useFetchLocationsQuery } from "@/store/api/apiLocations";
import { Skeleton } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { initialPostData } from "@/app/maintimeline/_conponents/PostContainerComponsnts/postCompoenets/MenuPostOption/MenuPostOption";
import { Address } from "@prisma/client";
import { setPopoverOpen } from "@/store/api/uiSlice";

const LocationSearch = ({
  activeLocation,
  isEditing,
  fullSelected,
  setEditPost,
  setActiveLocation,
  onChange ,
}: {
  onChange? :(value:Address) => void ,  
  isEditing?: boolean;
  fullSelected?: Address;
  activeLocation: number | null;
  setActiveLocation?: React.Dispatch<React.SetStateAction<number | null>>;
  setEditPost?: React.Dispatch<React.SetStateAction<initialPostData>>;
}) => {
  const [searchParams, setSearchParams] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const {
    data: locations,
    error,
    isLoading,
    isFetching,
  } = useFetchLocationsQuery(searchParams, {
    skip: Object.values(searchParams).every((param) => param === ""),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = (id: number, location: Address) => {
    if (setActiveLocation) {
      setActiveLocation((e) => {
        return e === id ? null : id;
      });
    }
    if (setEditPost) {
      setEditPost((prev) => {
        return {
          ...prev,
          location: location,
        };
      });
    }
    if(onChange) {
      onChange(location)
    }
    setIsOpen(false)
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className={cn("w-max justify-start p-2 min-h-max  " ,
              isEditing && 'bg-black/90 text-white hover:text-white hover:bg-black/80'
            )}
          >
            {isEditing && fullSelected ? (
              <p className="text-white">
                <span>
                  {fullSelected.flag} {fullSelected.country} ,
                  {fullSelected.city}.
  
                </span>
              </p>
            ) : (
              <MapPin
                className={cn(
                  "h-5 w-5  ",
                  activeLocation && " fill-white text-emerald-500 "
                )}
              />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="flex  

         max-h-screen 
         max-w-max
         w-[24rem] flex-col md:flex-row overflow-hidden md:w-[50rem]
          justify-start gap-3 items-start "
        >
          <DialogTitle
          className="hidden"
          >

          </DialogTitle>
          <div className="">
            <form
              onSubmit={handleSearch}
              className="w-80 sticky top-0  space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  name="street"
                  value={searchParams.street}
                  onChange={handleInputChange}
                  placeholder="Enter street"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={searchParams.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={searchParams.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  name="zip"
                  value={searchParams.zip}
                  onChange={handleInputChange}
                  placeholder="Enter ZIP code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={searchParams.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                />
              </div>
              <div className="flex w-full justify-start items-start gap-3">
                <Button
                  type="button"
                  disabled
                  className="w-full flex justify-center items-center gap-1"
                >
                  <Locate className="mr-2 h-4 w-4" />
                  pick it
                </Button>
              </div>
            </form>
          </div>

          {locations && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-4 w-[30rem] md:w-max max-h-[30rem] scrollbar-hide  overflow-y-auto"
              >
                {isLoading || isFetching ? (
                  <div className="ml-4 gap-4 flex justify-start items-start flex-col">
                    {Array.from({
                      length: 20,
                    }).map((e, i) => {
                      return (
                        <Skeleton
                          key={i}
                          className="w-[20rem] rounded-md h-2 bg-slate-100"
                        />
                      );
                    })}
                  </div>
                ) : error ? (
                  <p className="text-sm text-destructive">
                    Error: {(error as any).data?.message || "An error occurred"}
                  </p>
                ) : (
                  <div className="bg-card md:w-max max-w-max relative  text-card-foreground rounded-md shadow-md md:p-4 p-0">
                    {fullSelected && (
                      <li
                        key={fullSelected.id}
                        onClick={() =>
                          handleClick(fullSelected.id, fullSelected)
                        }
                        className=" sticky top-0 z-10  text-white text-sm text-pretty max-w-[20rem] list-none "
                      >
                        <div
                          className={cn(
                            "textBox max-w-[20rem] w-[20rem] cursor-pointer items-center flex transition-all rounded-md text-start h-fit",
                            activeLocation === fullSelected.id &&
                              "shadow-lg bg-black/70 border-b-1 border-b-neutral-400"
                          )}
                        >
                          <span>
                            {fullSelected.flag} {fullSelected.country} ,{" "}
                            {fullSelected.street}, {fullSelected.city},{" "}
                            {fullSelected.state}, {fullSelected.zip}
                          </span>
                        </div>
                      </li>
                    )}
                    {locations.length > 0 ? (
                      <ul className="space-y-2">
                        {locations &&
                          locations.map((location: any) => (
                            <li
                              key={location.id}
                              onClick={() => handleClick(location.id, location)}
                              className="text-sm text-pretty max-w-[20rem] "
                            >
                              <div
                                className={cn(
                                  "textBox max-w-[20rem] w-[20rem] cursor-pointer items-center flex transition-all rounded-md text-start h-fit",
                                  activeLocation === location.id &&
                                    "shadow-lg bg-gray-50 border-b-1 border-b-neutral-400"
                                )}
                              >
                                <span>
                                  {location.flag} {location.country} ,{" "}
                                  {location.street}, {location.city},{" "}
                                  {location.state}, {location.zip}
                                </span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No locations found.
                      </p>
                    )}
                  </div>
                )}
                {!locations && (
                  <p className="text-sm text-muted-foreground">
                    Enter location details to search.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationSearch;