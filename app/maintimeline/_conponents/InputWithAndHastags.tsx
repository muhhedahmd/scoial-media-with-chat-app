"use client";
import React, { SetStateAction, useDeferredValue, useState } from "react";
import { MentionsInput, Mention, SuggestionDataItem } from 'react-mentions';
import { useGetUserNameQuery } from "@/store/api/apiUser";
import Image from "next/image";
import { User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseDataType } from "./PostContainerComponsnts/CommentComp/CommentAddation";
import { useDebounce } from "@uidotdev/usehooks";
interface UserSuggestion {
  id: string | number;
  profile: {
    profile_picture: string | null;
  } | null;
  first_name: string;
  last_name: string;
  display: string;
}

const dummyHashtags = ["#InputWithAndHastags", "#sample", "#test", "#demo"];

const InputWithAndHastags = ( {
  disabled,
placeholder ,
setVal,
val ,
className ,
parsedData,
setParsedData
} :{
  disabled ?: boolean ;
  placeholder ?: string ;
  setVal : React.Dispatch<React.SetStateAction<string>>
  val : string ;
  className ?: string ;
  parsedData: parseDataType
  setParsedData: React.Dispatch<React.SetStateAction<parseDataType>>
  

}) => {


  const [searchTerm ,setSearchTerm] = useState("")
  const [isMentionMode , setIsMentionMode] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const {
    data: users,
    isLoading,
    isFetching,
  } = useGetUserNameQuery({
    userId: 1,
    search: debouncedSearchTerm,
    size: 0,
    take: 6,
  });
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setVal(newValue);

    // Regex to find the last mention and extract the term
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
        let match;
    let lastMatch = '';

    while ((match = mentionRegex.exec(newValue)) !== null) {
      lastMatch = match[1]; // Capture the term after the last @
    }

    // Check if the last match is followed by a whitespace or end of string
    const isMentionClosed = newValue[newValue.length - 1] === ' ' || newValue[newValue.length - 1] === '\n';

    if (lastMatch && !isMentionClosed) {
      // Still in mention mode
      setIsMentionMode(true);
      setSearchTerm(lastMatch);
    } else {
      // Mention is closed or there is no mention
      setIsMentionMode(false);
      setSearchTerm(""); // Clear search term if not in mention mode
    }
    handleProcessData()
  };

  const suggestions: UserSuggestion[] = [
    ...((users?.data || []).map(e => ({
      id: e.id,
      profile: e.profile,
      first_name: e.first_name,
      last_name: e.last_name,
      display: e.user_name
    }))),
  ];

  const renderHsetagsSuggestion = (
    suggestion: SuggestionDataItem,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focused: boolean
  ) => {
    return (
      <div
        key={suggestion.id}
        className={cn(
          "p-2 cursor-pointer w-full flex items-center gap-3 hover:bg-gray-100 rounded-lg",
          focused ? 'bg-gray-200' : 'bg-white'
        )}
      >
        <div className="flex-shrink-0">
          {/* No profile picture for hashtags */}
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-gray-500">#{suggestion.display}</p>
        </div>
      </div>
    );
  };

  const renderUserSuggestion = (
    suggestion: UserSuggestion & SuggestionDataItem,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focused: boolean
  ) => {
    return (
      <div
        key={suggestion.id}
        className={cn(
          "p-2 cursor-pointer w-full flex items-center gap-3 hover:bg-gray-100 rounded-lg",
          focused ? 'bg-gray-200' : 'bg-white'
        )}
      >
        <div className="flex-shrink-0">
          {suggestion.profile?.profile_picture ? (
            <Image
              src={suggestion.profile.profile_picture || ""}
              alt={`${suggestion.first_name} profile picture`}
              height={40}
              width={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex justify-center items-center rounded-full h-10 w-10 bg-gray-200">
              <User2 className="w-6 h-6 text-gray-600" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{suggestion.first_name} {suggestion.last_name}</p>
          <p className="text-xs text-gray-500">@{suggestion.display}</p>
        </div>
      </div>
    );
  };

  const processText = (text: string) => {
    const mentionRegex = /@([\w_]+)(?![\w_])/g;
    const hashtagRegex = /#([\w_]+)(?![\w_])/g;
  
    let result = {
      mentions: [] as Array<{ value: string; startIndex: number; endIndex: number; id: number }>,
      hashtags: [] as Array<{ value: string; startIndex: number; endIndex: number; id: number }>,
      ignoredMentions: [] as Array<{ value: string; startIndex: number; endIndex: number; }>,
      regularTexts: [] as Array<{ text: string; startIndex: number; endIndex: number; }>,
      fullText: text,
    };
  
    let lastIndex = 0;
  
    // Process mentions using matchAll
    for (const match of text.matchAll(mentionRegex)) {
      const mentionText = match[1];
      if (lastIndex < match.index!) {
        result.regularTexts.push({
          text: text.substring(lastIndex, match.index!),
          startIndex: lastIndex,
          endIndex: match.index!,
        });
      }
  
      const foundUser = suggestions.find(s => s.display.toLowerCase() === mentionText.toLowerCase());
      const id = foundUser?.id ?? -1; // Use -1 as default if id is not found
      result.mentions.push({
        value: mentionText,
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        id: +id,
      });
  
      lastIndex = match.index! + match[0].length;
    }
  
    // Process hashtags using matchAll
    for (const match of text.matchAll(hashtagRegex)) {
      if (lastIndex < match.index!) {
        result.regularTexts.push({
          text: text.substring(lastIndex, match.index!),
          startIndex: lastIndex,
          endIndex: match.index!,
        });
      }
      result.hashtags.push({
        value: match[1],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        id: -1, // Default ID for hashtags
      });
  
      lastIndex = match.index! + match[0].length;
    }
  
    // Process any remaining regular text
    if (lastIndex < text.length) {
      result.regularTexts.push({
        text: text.substring(lastIndex),
        startIndex: lastIndex,
        endIndex: text.length - 1,
      });
    }
  
    return result;
  };
  

  const handleSelectSuggestion = (id: string | number, display: string, startPos: number, endPos: number, isMention: boolean) => {
    const prefix = isMention ? '@' : '#';
    const cleanDisplay = display;
    const newValue = val.substring(0, startPos) + prefix + cleanDisplay + val.substring(endPos);
    setVal(newValue);
  };

  const handleProcessData = () => {
    const processedData = processText(val);
    setParsedData({
      mentions: processedData.mentions,
    hashtags :processedData?.hashtags || undefined ,
      // hashtags: processedData.hashtags,
      ignoredMentions: processedData.ignoredMentions,
      regularTexts: processedData.regularTexts,
      fullText: val,
    });
    console.log('Processed Data:', processedData); // Optional: log or handle data here
  };

  return (
    <div className={cn("w-40 " , className)}>
      <MentionsInput
        placeholder={placeholder || " "}
        disabled={disabled}

        className=" ct  md:mb-0 mentions-input w-full border-2 border-gray-300 rounded-md  p-2 focus:border-blue-500 focus:outline-none"
        value={val}
        onChange={handleChange}
        style={{
          'textarea': {
            borderRadius: '8px',
            padding: '8px',
            border: 'none',
            backgroundColor: '#f9f9f9',
            fontSize: '16px',
            outline: 'none',
          },
        }}
      >
        <Mention
          trigger="@"
          data={suggestions}
          renderSuggestion={renderUserSuggestion}
          onAdd={(id, display, startPos, endPos) => handleSelectSuggestion(id, display, startPos, endPos, true)}
        />
        <Mention
          trigger="#"
          data={dummyHashtags.map(tag => ({
            id: tag,
            display: tag.substring(1),
          }))}
          renderSuggestion={renderHsetagsSuggestion}
          onAdd={(id, display, startPos, endPos) => handleSelectSuggestion(id, display, startPos, endPos, false)}
        />
      </MentionsInput>

    </div>
  );
};

export default InputWithAndHastags;
