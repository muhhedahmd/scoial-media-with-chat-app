import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useDeferredValue,
} from "react";
import { useGetUserNameQuery } from "@/store/api/apiUser";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setMentionPaggnation } from "@/store/Reducers/pagganitionSlice";
import { Loader2Icon, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import { ShapeOfUserSerchMention } from "@/app/api/users/mentions/route";
import { Textarea } from "@nextui-org/react";
// Enum for input types
enum InputType {
  Mention = "mention",
  Hashtag = "hashtag",
  Regular = "regular",
}

// Type for user data from API
export type parserData = { mentions: any[]; hashtags: any[]; ignoredMentions: any[]; regularTexts: any[]; fullText: string; }
// Dummy hashtags array
const dummyHashtags = ["#example", "#sample", "#test", "#demo"];

const MentionInput = ({
  parsedData,
  setParsedData ,
  inputValue,
setInputValue
} : {
  parsedData : parserData | undefined
  setParsedData :React.Dispatch<React.SetStateAction<parserData | undefined>> 
  inputValue : string
  setInputValue : React.Dispatch<React.SetStateAction<string>>
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    ShapeOfUserSerchMention[]
  >([]);
  const [inputType, setInputType] = useState<InputType>(InputType.Regular);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const measurementDivRef = useRef<HTMLDivElement>(null);
  const { skip, take } = useSelector((state: any) => state.pagination.mention);
  const [search, setSearch] = useState("");
  const DelayedSearch = useDeferredValue(search);
  const {
    data: users,
    isLoading,
    isFetching,
  } = useGetUserNameQuery({
    userId: 1,
    search: DelayedSearch,
    size: skip,
    take: take,
  });

  useEffect(() => {
    const updateDropdownPosition = () => {
      if (inputRef.current && measurementDivRef.current) {
        const textarea = inputRef.current;
        const measurementDiv = measurementDivRef.current;
  
        const cursorPosition = textarea.selectionStart || 0;
        
        const textBeforeCursor = textarea.value.substring(0, cursorPosition);
        const cursorLine =textarea.value.slice(0, cursorPosition).split("\n").length - 1;
  
        // Create a div to measure text width
        measurementDiv.textContent = textBeforeCursor;
        const textWidth = measurementDiv.offsetWidth;
  
        const lineHeight = parseInt(
          window.getComputedStyle(textarea).lineHeight,
          10
        );
  

        const textareaRect = textarea.getBoundingClientRect();
        const paddingAndBorderTop = textareaRect.top - textarea.offsetTop;
  
        setDropdownPosition({
          top: (cursorLine * lineHeight) + 33 ,
          left: cursorPosition + 10,
        });
      }
    };
  
    updateDropdownPosition();
  }, [inputValue]);

  useEffect(() => {
    const mentionRegex = /(?<!\S)@([a-zA-Z0-9_]+)(?!\S)/g;
    const hashtagRegex = /#[\w_]+(?![\w_])/g;

    const mentionMatches = [...inputValue.matchAll(mentionRegex)];
    const hashtagMatches = [...inputValue.matchAll(hashtagRegex)];

    const lastMention = mentionMatches[mentionMatches.length - 1];
    const lastHashtag = hashtagMatches[hashtagMatches.length - 1];
    const lastMatch =
      lastMention && (!lastHashtag || lastMention.index! > lastHashtag.index!)
        ? lastMention
        : lastHashtag;

    const lastInputType = lastMatch
      ? lastMatch === lastMention
        ? InputType.Mention
        : InputType.Hashtag
      : InputType.Regular;

    // Set input type for the dropdown
    setInputType(lastInputType);
    let lastChar;
    let isSpaceAfter;
    // Check if the last character after mention or hashtag is a space
    if (lastMatch) {
      isSpaceAfter =
        inputValue.slice(
          lastMatch?.index + lastMatch[0].length,
          lastMatch?.index + lastMatch[0].length + 1
        ) || "";
      lastChar = lastChar === " ";
    }

    if (lastMatch && !isSpaceAfter) {
      const inputElem = inputRef.current;
      if (inputElem) {
        console.log();

        if (lastInputType === InputType.Mention) {
          const mentionedUserNames = new Set(
            inputValue
              .split(" ")
              .filter((word) => word.startsWith("@"))
              .map((word) => word.substring(1).toLowerCase())
          );
          setSearch(lastMention[0].replace("@", ""));
          const filteredUsers = users?.data.filter(
            (user) =>
              !mentionedUserNames.has(user.user_name.toLowerCase()) && user
          );
          setFilteredSuggestions(filteredUsers || []);
          setShowDropdown(filteredUsers?.length! > 0 || false);
        } else if (lastInputType === InputType.Hashtag) {
          const mentionedHashtags = new Set(
            inputValue
              .split(" ")
              .filter((word) => word.startsWith("#"))
              .map((word) => word.substring(1).toLowerCase())
          );
          // const filteredHashtags = dummyHashtags.filter(
          //   (tag) =>
          //     !mentionedHashtags.has(tag.substring(1).toLowerCase()) &&
          //     tag
          //       .toLowerCase()
          //       .includes(lastMatch[0].substring(1).toLowerCase())
          // );
          // setFilteredSuggestions(filteredHashtags );
          // setShowDropdown(filteredHashtags.length > 0);
        }
      }
    } else {
      setShowDropdown(false);
    }
  }, [inputValue, users]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showDropdown && dropdownPosition) {
      gsap.fromTo(
        suggestionRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  }, [showDropdown, dropdownPosition]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputRef && inputRef.current) {
      setInputValue(inputRef.current.value);
    }
  };

  const handleSelectSuggestion = (item: ShapeOfUserSerchMention | string) => {
    const selectedValue =
      typeof item === "string" ? item : `@${item?.user_name}`;
    const mentionOrHashtagRegex = /@[\w_]+(?![\w_])|#[\w_]+(?![\w_])/g;

    const matches = [...inputValue.matchAll(mentionOrHashtagRegex)];
    if (matches.length === 0) {
      setInputValue(`${inputValue}${selectedValue} `);
      setShowDropdown(false);
      inputRef.current?.focus();
      setInputType(InputType.Regular);
      return;
    }

    const lastMatch = matches[matches.length - 1];
    const lastMatchText = lastMatch[0];
    const lastMatchIndex = lastMatch.index || 0;

    const newValue = `${inputValue.substring(
      0,
      lastMatchIndex
    )}${selectedValue} ${inputValue.substring(
      lastMatch.index! + lastMatchText.length
    )}`;

    setInputValue(newValue);
    setShowDropdown(false);
    inputRef.current?.focus();
    setInputType(InputType.Regular);
  };

 useEffect(() => {
    const mentionRegex = /@[\w_]+(?![\w_])/g;
    const hashtagRegex = /#[\w_]+(?![\w_])/g;
    const mentions: any[] = [];
    const hashtags: any[] = [];
    const ignoredMentions: any[] = [];
    const regularTexts: any[] = [];
    let lastIndex = 0;

    let match;
    while ((match = mentionRegex.exec(inputValue)) !== null) {
      if (lastIndex < match.index) {
        regularTexts.push({
          text: inputValue.substring(lastIndex, match.index),
          startIndex: lastIndex,
          endIndex: match.index,
        });
      }
      const mention = match[0];
      if (
        !users?.data.some(
          (user) =>
            user.user_name.toLowerCase() === mention.substring(1).toLowerCase()
        )
      ) {
        ignoredMentions.push({
          value: mention,
          startIndex: match.index,
          endIndex: mention.length,
        });
      } else {
        mentions.push({
          userId : users.data.find((user) => user.user_name.toLowerCase() === mention.substring(1).toLowerCase())?.id ,
          value: mention,
          startIndex: match.index,
          endIndex: mention.length,
        });
      }
      lastIndex = mentionRegex.lastIndex;
    }

    while ((match = hashtagRegex.exec(inputValue)) !== null) {
      if (lastIndex < match.index) {
        regularTexts.push({
          text: inputValue.substring(lastIndex, match.index),
          startIndex: lastIndex,
          endIndex: match.index,
        });
      }
      hashtags.push({
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length - 1,
      });
      lastIndex = hashtagRegex.lastIndex;
    }

    if (lastIndex < inputValue.length) {
      regularTexts.push({
        text: inputValue.substring(lastIndex),
        startIndex: lastIndex,
        endIndex: inputValue.length - 1,
      });
    }

    setParsedData({
      mentions,
      hashtags,
      ignoredMentions,
      regularTexts,
      fullText: inputValue,
    });
  } ,[inputValue, setParsedData, users?.data])

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent
  ) => {
    if (showDropdown && filteredSuggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev === null || prev === filteredSuggestions.length - 1
              ? 0
              : prev + 1
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev === null || prev === 0
              ? filteredSuggestions.length - 1
              : prev - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex !== null) {
            handleSelectSuggestion(filteredSuggestions[highlightedIndex]);
          }
          setInputType(InputType.Regular);

          break;
        default:
          break;
      }
    }
  };

  const renderHighlightedText = (text: string) => {
    const mentionRegex = /@[\w_]+(?![\w_])/g;
    const hashtagRegex = /#[\w_]+(?![\w_])/g;
    const parts = text.split(
      new RegExp(`(${mentionRegex.source}|${hashtagRegex.source})`, "g")
    );

    return parts.map((part, index) => {
      if (mentionRegex.test(part)) {
        return (
          <span key={index} className="bg-gray-200 text-blue-600 px-1 rounded">
            {part}
          </span>
        );
      } else if (hashtagRegex.test(part)) {
        return (
          <span key={index} className="bg-gray-200 text-green-600 px-1 rounded">
            {part}
          </span>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  const formatTextWithLineBreaks = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {renderHighlightedText(line)}
        <br />
      </React.Fragment>
    ));
  };
  const fetchMoreData = useCallback(() => {
    if (!isFetching && users?.hasMore) {
      dispatch(setMentionPaggnation({ skip: skip + take, take }));
    }
  }, [dispatch, isFetching, skip, take, users?.hasMore]);

  return (
    <div className="relative  w-[92%]">

      <div className=" relative  flex flex-col gap-2 w-full">
        <Textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => handleChange(e)}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="Type @username or #hashtag"
          className="col-span-12 md:col-span-6 md:mb-0"
          onFocus={() => {
            if (
              inputType === InputType.Mention ||
              inputType === InputType.Hashtag
            ) {
              setShowDropdown(true);
            }
          }}
        />
      <div
        ref={measurementDivRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre-wrap",
          font: inputRef?.current ?  window.getComputedStyle(inputRef?.current!).font  : "",
        }}
      >
        
      </div>
      </div>



      {showDropdown && dropdownPosition && inputType !== InputType.Regular && (
        <InfiniteScroll
          dataLength={filteredSuggestions.length} // This should be the length of your data
          next={fetchMoreData}
          hasMore={!isFetching && users?.hasMore!} // Check if there's more data to load
          loader={null}
          endMessage={null}
          scrollableTarget="scrollableDropdown"
        >
          <div
            ref={suggestionRef}
            id="scrollableDropdown"
            className="absolute bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto z-10 rounded-lg shadow-lg min-w-[18rem]"
            style={{
              top: dropdownPosition?.top,
              left: dropdownPosition?.left + 20,
            }}
          >
            <div>
              {filteredSuggestions.map((item, index) =>
                typeof item === "string" ? (
                  <div
                    key={item}
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                      highlightedIndex === index ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleSelectSuggestion(item)}
                  >
                    {item}
                  </div>
                ) : (
                  <div
                    key={item.id}
                    className={`p-2 cursor-pointer w-full flex justify-start items-start gap-3 hover:bg-gray-100 ${
                      highlightedIndex === index ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleSelectSuggestion(item)}
                  >
                    <div
                      className="w-1/4 
                  flex justify-center items-center
                  "
                    >
                      {item.profile?.profile_picture ? (
                        <Image
                          src={item.profile?.profile_picture || ""}
                          alt={item.first_name + "profile_picture"}
                          height={75}
                          width={75}
                          className="rounded-full h-12 w-12 p-1"
                        />
                      ) : (
                        <div
                          className="
                  flex justify-center items-center

                    rounded-full h-12 w-12 p-1
                    "
                        >
                          <User2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col w-3/4  justify-start items-start ">
                      <p>
                        {item.first_name} {item.last_name}
                      </p>
                      <p className="text-muted-foreground">@{item.user_name}</p>
                    </div>
                  </div>
                )
              )}

              <p>{users?.hasMore ? "scroll again" : "there is noting left"}</p>
            </div>
          </div>
        </InfiniteScroll>
      )}
    
  
    </div>
  );
};

export default MentionInput;
