import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useRef } from "react";
import { Control } from "react-hook-form";
import { z } from "zod";

interface AutocompleteMultiValueProps {
  value: Record<string, string> |undefined;
  control: Control<{
    bio: string;
    location: string;
    birthdate: Date;
    profile_picture?: File | null | undefined;
    cover_picture?: File | null | undefined;
    website?: Record<string, string> | undefined;
}, any>
  onChange: (value: Record<string, any>) => void;
}

function AutocompleteMultiValue({
  value,
  onChange,
}: AutocompleteMultiValueProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    if (inputValue.length > 0) {
      const urlSchema = z.string().url("Website must be a valid URL").optional();
      const result = urlSchema.safeParse(inputValue);

      if (!result.success) {
        setError(result.error?.issues[0]?.message || "Invalid URL");
      } else {
        setError(null);
      }
    } else {
      setError("Input cannot be empty");
    }
  };

  const addLink = () => {
    try {
      const url = new URL(inputValue);
      const hostname = url.hostname.replace(/^www\./, "").replace(/\.[^.]+$/, "");
      const updatedValues = { ...value, [hostname]: inputValue };
      console.log(updatedValues , onChange,  value)
      onChange(updatedValues)
 
      setInputValue(""); // Clear input field after adding
    } catch (error) {
      console.error("Invalid URL format", error);
    }
  };

  const handleRemoveValue = (valueKey: string) => {
    const updatedValues = { ...value };
    delete updatedValues[valueKey];
    onChange(updatedValues);
  };

  const SelectedOptionsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full">
      <div className="w-full gap-2 flex justify-start items-start">
        <Input
          className="w-3/4"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        //   onBlur={onBlur}
          placeholder="Type something..."
        />
        <Button
          onClick={addLink}
          disabled={error !== null || inputValue.length === 0}
          type="button"
          className="w-1/3"
        >
          Add Link
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="w-full pt-1">
        <div
          ref={SelectedOptionsRef}
          className="flex justify-start items-start gap-3"
        >
          {value && Object.keys(value).map((key, index) => (
            <div
              onClick={() => handleRemoveValue(key)}
              style={{
                backgroundColor: `rgba(${Math.floor(
                  Math.random() * 256
                )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
                  Math.random() * 256
                )}, 0.2)`,
              }}
              className="bg-orange-50  p-1 cursor-pointer rounded-md shadow-sm  relative hover:text-destructive hover:shadow-lg transition-colors "
              key={index}
            >
              <p>{key}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AutocompleteMultiValue;
