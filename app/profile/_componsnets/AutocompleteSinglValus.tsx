import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Control } from "react-hook-form";

interface AutocompleteSingleValueProps {
  value: string |undefined
  control: Control<{
    bio: string;
    location: string;
    birthdate: Date;
    profile_picture?: File | null | undefined;
    cover_picture?: File | null | undefined;
    website?: Record<string, string> | undefined;
}, any>
  onChange: (value: string) => void;
}


function AutocompleteSingleValue({control ,onChange ,  value}:AutocompleteSingleValueProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  const handleInputChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onChange("")
    setInputValue(value);

    if (value.length > 0) {
      const filteredSuggestions = possibleValues.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowOptions(true);
    } else {
      setSuggestions([]);
      setShowOptions(false);
    }
  };

  const handleOptionClick = (value: string) => {
    setInputValue(value);
    onChange(value)
    setSuggestions([]);
    setShowOptions(false);
  };
  const onBlur = () => {
    setTimeout(() => {
      setShowOptions(false);
    }, 200);
  };
  return (
    <div className="relative w-full">
      <Input
        className="w-full"
        onBlur={() => onBlur()}
        type="text"
        value={value || inputValue}
        onChange={handleInputChange}
        placeholder="Type something..."
      />
      {showOptions && (
        <ul
          className="
        rounded-md
        border-2 
        border-gray-200 
        p-3
        top-[122%]
        bg-white 
        shadow-sm
        w-full 
        flex flex-col
        justify-start 
        items-start 
        gap-3
        absolute"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="cursor-pointer"
              onClick={() => handleOptionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const possibleValues = ["apple", "banana", "cherry", "date", "elderberry"];

export default AutocompleteSingleValue;
