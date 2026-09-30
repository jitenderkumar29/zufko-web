"use client";

import React, {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Clock3,
  Search,
  SendHorizontal,
  X,
} from "lucide-react";

import styles from "./SearchBarChatBoat.module.scss";

/* =========================================================
   TYPES
   ========================================================= */

export interface SearchSuggestion {
  id: string | number;
  label: string;
  value?: string;
}

export interface RecentSearch {
  id: string | number;
  label: string;
  value?: string;
}

export interface SearchBarChatBoatProps {
  /* -------------------------------------------------------
     INPUT
     ------------------------------------------------------- */

  placeholder?: string;

  /**
   * Multiple placeholders for typewriter animation.
   */
  placeholders?: string[];

  /**
   * Typing/deleting speed.
   */
  placeholderTypingSpeed?: number;

  /**
   * Pause after completing placeholder.
   */
  placeholderPauseDuration?: number;

  value?: string;
  defaultValue?: string;

  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;

  /* -------------------------------------------------------
     SUGGESTIONS
     ------------------------------------------------------- */

  suggestions?: SearchSuggestion[];

  onSuggestionSelect?: (
    suggestion: SearchSuggestion
  ) => void;

  /* -------------------------------------------------------
     TRENDING SEARCHES
     ------------------------------------------------------- */

  trendingSearches?: string[];

  onTrendingSelect?: (value: string) => void;

  /* -------------------------------------------------------
     RECENT SEARCHES
     ------------------------------------------------------- */

  recentSearches?: RecentSearch[];

  onRecentSelect?: (
    search: RecentSearch
  ) => void;

  onRecentRemove?: (
    search: RecentSearch
  ) => void;

  /* -------------------------------------------------------
     BRAND
     ------------------------------------------------------- */

  logoSrc?: string;
  logoAlt?: string;

  /* -------------------------------------------------------
     UI
     ------------------------------------------------------- */

  showSearchIcon?: boolean;
  showClearButton?: boolean;

  showTrendingSearches?: boolean;
  showRecentlySearched?: boolean;

  disabled?: boolean;

  /* -------------------------------------------------------
     STYLE
     ------------------------------------------------------- */

  className?: string;
  inputClassName?: string;

  /* -------------------------------------------------------
     ACCESSIBILITY
     ------------------------------------------------------- */

  ariaLabel?: string;

  maxLength?: number;
}

/* =========================================================
   DEFAULTS
   ========================================================= */

const DEFAULT_LOGO =
  "/products/eva-new.svg";

const DEFAULT_PLACEHOLDERS = [
  "Search for an Instant Ride",
  "Search for a Premium Ride",
  "Search for a Corporate Ride",
  "Search for a Commercial Vehicle",
  "Search for Tour Packages",
  "Search for Parcel Delivery",
  "Search for Packer & Movers",
];

const DEFAULT_TRENDING_SEARCHES = [
  "Instant Ride",
  "Premium Ride",
  "Corporate Ride",
  "Commercial Vehicle",
  "Tour Packages",
  "Parcel Delivery",
  "Packer & Movers",

  "Airport Transfer",
  "Outstation Ride",
  "Intercity Ride",
  "Local Ride",
  "One Way Ride",
  "Round Trip",
  "Hourly Rental",
  "Daily Rental",

  "Cab Booking",
  "Taxi Booking",
  "Car Rental",
  "Bike Rental",
  "Auto Rickshaw",
  "Electric Vehicle",
  "Luxury Car",
  "Executive Car",
  "SUV Rental",

  "Airport Pickup",
  "Airport Drop",
  "Railway Station Transfer",
  "Hotel Transfer",
  "City Transfer",
  "Business Travel",

  "Corporate Travel",
  "Employee Transportation",
  "Corporate Cab",
  "Employee Shuttle",
  "Event Transportation",
  "Wedding Transportation",
  "Group Transportation",

  "Parcel Delivery",
  "Same Day Delivery",
  "Express Delivery",
  "Local Delivery",
  "Doorstep Delivery",
  "Business Delivery",
  "Document Delivery",
  "E-commerce Delivery",

  "Packers & Movers",
  "Home Shifting",
  "Office Shifting",
  "Vehicle Transportation",
  "Furniture Transportation",
  "Household Moving",

//   "Tour Packages",
//   "Holiday Packages",
//   "Weekend Trips",
//   "Family Tours",
//   "Group Tours",
//   "City Tours",
//   "One Day Tours",
//   "Multi City Tours",
];

/* =========================================================
   COMPONENT
   ========================================================= */

const SearchBarChatBoat: React.FC<
  SearchBarChatBoatProps
> = ({
  placeholder = "Search for Credit card",

  placeholders = DEFAULT_PLACEHOLDERS,

  placeholderTypingSpeed = 65,
  placeholderPauseDuration = 1800,

  value,
  defaultValue = "",

  onChange,
  onSearch,

  suggestions = [],
  onSuggestionSelect,

  trendingSearches = DEFAULT_TRENDING_SEARCHES,
  onTrendingSelect,

  recentSearches = [],
  onRecentSelect,
  onRecentRemove,

  logoSrc = DEFAULT_LOGO,
  logoAlt = "EVA",

  showSearchIcon = false,
  showClearButton = true,

  showTrendingSearches = true,
  showRecentlySearched = true,

  disabled = false,

  className = "",
  inputClassName = "",

  ariaLabel = "Search",
  maxLength,
}) => {
  /* =======================================================
     CONTROLLED / UNCONTROLLED
     ======================================================= */

  const isControlled =
    value !== undefined;

  const [internalValue, setInternalValue] =
    useState(defaultValue);

  const searchValue = isControlled
    ? value
    : internalValue;

  /* =======================================================
     FOCUS / ACTIVE SUGGESTION
     ======================================================= */

  const [isFocused, setIsFocused] =
    useState(false);

  const [activeIndex, setActiveIndex] =
    useState(-1);

  /* =======================================================
     TYPEWRITER
     ======================================================= */

  const [typedPlaceholder, setTypedPlaceholder] =
    useState("");

  const [placeholderIndex, setPlaceholderIndex] =
    useState(0);

  const [isDeletingPlaceholder, setIsDeletingPlaceholder] =
    useState(false);

  const inputRef =
    useRef<HTMLInputElement>(null);

  /* =======================================================
     PLACEHOLDER LIST
     ======================================================= */

  const placeholderList =
    placeholders.length > 0
      ? placeholders
      : [placeholder];

  /* =======================================================
     TYPEWRITER EFFECT
     ======================================================= */

  useEffect(() => {
    if (
      disabled ||
      searchValue.length > 0 ||
      !placeholderList.length
    ) {
      return;
    }

    const currentText =
      placeholderList[placeholderIndex] ??
      placeholder;

    let timeout: ReturnType<
      typeof setTimeout
    >;

    /* -------------------------------------------------------
       Finished typing
       ------------------------------------------------------- */

    if (
      !isDeletingPlaceholder &&
      typedPlaceholder === currentText
    ) {
      timeout = setTimeout(() => {
        setIsDeletingPlaceholder(true);
      }, placeholderPauseDuration);

      return () =>
        clearTimeout(timeout);
    }

    /* -------------------------------------------------------
       Finished deleting
       ------------------------------------------------------- */

    if (
      isDeletingPlaceholder &&
      typedPlaceholder === ""
    ) {
      setIsDeletingPlaceholder(false);

      setPlaceholderIndex(
        (current) =>
          (current + 1) %
          placeholderList.length
      );

      return;
    }

    /* -------------------------------------------------------
       Typing
       ------------------------------------------------------- */

    if (!isDeletingPlaceholder) {
      timeout = setTimeout(() => {
        setTypedPlaceholder(
          currentText.slice(
            0,
            typedPlaceholder.length + 1
          )
        );
      }, placeholderTypingSpeed);
    }

    /* -------------------------------------------------------
       Deleting
       ------------------------------------------------------- */

    else {
      timeout = setTimeout(() => {
        setTypedPlaceholder(
          currentText.slice(
            0,
            Math.max(
              0,
              typedPlaceholder.length - 1
            )
          )
        );
      }, placeholderTypingSpeed / 1.5);
    }

    return () =>
      clearTimeout(timeout);
  }, [
    disabled,
    searchValue,
    placeholderIndex,
    typedPlaceholder,
    isDeletingPlaceholder,
    placeholderList,
    placeholder,
    placeholderTypingSpeed,
    placeholderPauseDuration,
  ]);

  /* =======================================================
     RESET TYPEWRITER WHEN USER TYPES
     ======================================================= */

  useEffect(() => {
    if (searchValue.length === 0) {
      return;
    }

    setTypedPlaceholder("");
    setIsDeletingPlaceholder(false);
  }, [searchValue]);

  /* =======================================================
     FILTER SUGGESTIONS
     ======================================================= */

  const filteredSuggestions =
    searchValue.trim().length > 0
      ? suggestions
          .filter((item) =>
            item.label
              .toLowerCase()
              .includes(
                searchValue.toLowerCase()
              )
          )
          .slice(0, 6)
      : [];

  const hasValue =
    searchValue.trim().length > 0;

  /* =======================================================
     UPDATE VALUE
     ======================================================= */

  const updateValue = (
    newValue: string
  ) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);

    setActiveIndex(-1);
  };

  /* =======================================================
     SEARCH
     ======================================================= */

  const handleSearch = () => {
    const trimmedValue =
      searchValue.trim();

    if (
      !trimmedValue ||
      disabled
    ) {
      return;
    }

    onSearch?.(trimmedValue);
  };

  /* =======================================================
     CLEAR
     ======================================================= */

  const handleClear = () => {
    updateValue("");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  /* =======================================================
     SELECT SUGGESTION
     ======================================================= */

  const handleSuggestionSelect = (
    suggestion: SearchSuggestion
  ) => {
    const selectedValue =
      suggestion.value ??
      suggestion.label;

    /*
     * Put the selected suggestion into
     * the search input.
     */
    updateValue(selectedValue);

    /*
     * Notify parent that a suggestion
     * was selected.
     */
    onSuggestionSelect?.(
      suggestion
    );

    /*
     * IMPORTANT:
     *
     * Do NOT call:
     *
     * onSearch?.(selectedValue);
     *
     * here.
     *
     * The selected option should only
     * populate the input. The user can
     * press Send/Search when ready.
     */

    setActiveIndex(-1);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  /* =======================================================
     TRENDING SEARCH
     ======================================================= */

  const handleTrendingSelect = (
    value: string
  ) => {
    updateValue(value);

    onTrendingSelect?.(value);

    onSearch?.(value);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  /* =======================================================
     RECENT SEARCH
     ======================================================= */

  const handleRecentSelect = (
    recent: RecentSearch
  ) => {
    const selectedValue =
      recent.value ??
      recent.label;

    updateValue(selectedValue);

    onRecentSelect?.(
      recent
    );

    onSearch?.(selectedValue);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  /* =======================================================
     KEYBOARD
     ======================================================= */

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    /* -------------------------------------------------------
       ENTER
       ------------------------------------------------------- */

    if (event.key === "Enter") {
      event.preventDefault();

      if (
        activeIndex >= 0 &&
        filteredSuggestions[activeIndex]
      ) {
        handleSuggestionSelect(
          filteredSuggestions[
            activeIndex
          ]
        );
      } else {
        handleSearch();
      }

      return;
    }

    /* -------------------------------------------------------
       ARROW DOWN
       ------------------------------------------------------- */

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!filteredSuggestions.length) {
        return;
      }

      setActiveIndex(
        (current) =>
          current <
          filteredSuggestions.length - 1
            ? current + 1
            : 0
      );

      return;
    }

    /* -------------------------------------------------------
       ARROW UP
       ------------------------------------------------------- */

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!filteredSuggestions.length) {
        return;
      }

      setActiveIndex(
        (current) =>
          current > 0
            ? current - 1
            : filteredSuggestions.length - 1
      );

      return;
    }

    /* -------------------------------------------------------
       ESCAPE
       ------------------------------------------------------- */

    if (event.key === "Escape") {
      setActiveIndex(-1);
    }
  };

  /* =======================================================
     ACTIVE INDEX VALIDATION
     ======================================================= */

  useEffect(() => {
    if (
      activeIndex >=
      filteredSuggestions.length
    ) {
      setActiveIndex(-1);
    }
  }, [
    activeIndex,
    filteredSuggestions.length,
  ]);

  /* =======================================================
     SUGGESTIONS VISIBILITY
     ======================================================= */

  const showSuggestions =
    isFocused &&
    filteredSuggestions.length > 0;

  /* =======================================================
     PLACEHOLDER
     ======================================================= */

  const currentPlaceholder =
    searchValue.length > 0
      ? placeholder
      : typedPlaceholder;

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      className={`${styles.wrapper} ${className}`}
    >
      <div
        className={`${styles.chatSearchPanel} ${
          isFocused
            ? styles.focused
            : ""
        } ${
          disabled
            ? styles.disabled
            : ""
        }`}
      >
        {/* =================================================
            SEARCH BAR
            ================================================= */}

        <div className={styles.searchBox}>
          <div className={styles.searchInner}>
            {/* EVA BRAND */}

            <div className={styles.brand}>
              <div
                className={
                  styles.logoWrapper
                }
              >
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  className={styles.logo}
                />
              </div>

              <div
                className={
                  styles.brandText
                }
              >
                <span
                  className={styles.ask}
                >
                  ASK
                </span>

                <span
                  className={styles.eva}
                >
                  EVA
                </span>
              </div>
            </div>

            {/* DIVIDER */}

            <div
              className={
                styles.divider
              }
            />

            {/* OPTIONAL SEARCH ICON */}

            {showSearchIcon && (
              <Search
                size={19}
                strokeWidth={2}
                className={
                  styles.searchIcon
                }
                aria-hidden="true"
              />
            )}

            {/* INPUT */}

            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(event) =>
                updateValue(
                  event.target.value
                )
              }
              onFocus={() =>
                setIsFocused(true)
              }
              onBlur={() => {
                setTimeout(() => {
                  setIsFocused(false);
                }, 150);
              }}
              onKeyDown={
                handleKeyDown
              }
              placeholder={
                currentPlaceholder
              }
              disabled={disabled}
              maxLength={maxLength}
              autoComplete="off"
              spellCheck={false}
              className={`${styles.input} ${inputClassName}`}
              aria-label={ariaLabel}
              aria-autocomplete={
                suggestions.length
                  ? "list"
                  : "none"
              }
              aria-expanded={
                showSuggestions
              }
              aria-controls={
                showSuggestions
                  ? "chatboat-search-suggestions"
                  : undefined
              }
            />

            {/* CLEAR */}

            {showClearButton &&
              hasValue &&
              !disabled && (
                <button
                  type="button"
                  className={
                    styles.clearButton
                  }
                  onClick={
                    handleClear
                  }
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}

            {/* SEND */}

            <button
              type="button"
              className={`${styles.sendButton} ${
                !hasValue ||
                disabled
                  ? styles.sendDisabled
                  : styles.sendActive
              }`}
              onClick={
                handleSearch
              }
              disabled={
                !hasValue ||
                disabled
              }
              aria-label="Send"
              aria-disabled={
                !hasValue ||
                disabled
              }
            >
              <SendHorizontal
                size={27}
                strokeWidth={2.2}
              />
            </button>
          </div>
        </div>

        {/* =================================================
            SEARCH CONTENT
            ================================================= */}

        <div
          className={
            styles.searchContent
          }
        >
          {/* =================================================
              TRENDING
              ================================================= */}

          {showTrendingSearches &&
            trendingSearches.length >
              0 && (
              <section
                className={
                  styles.section
                }
              >
                <div
                  className={
                    styles.sectionHeader
                  }
                >
                  <span
                    className={
                      styles.trendingIcon
                    }
                  >
                    ↗
                  </span>

                  <h3>
                    Trending searches
                  </h3>
                </div>

                <div
                  className={
                    styles.trendingList
                  }
                >
                  {trendingSearches.map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        className={
                          styles.trendingChip
                        }
                        onMouseDown={(
                          event
                        ) =>
                          event.preventDefault()
                        }
                        onClick={() =>
                          handleTrendingSelect(
                            item
                          )
                        }
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </section>
            )}

          {/* =================================================
              RECENT SEARCHES
              ================================================= */}

          {showRecentlySearched &&
            recentSearches.length >
              0 && (
              <section
                className={`${styles.section} ${styles.recentSection}`}
              >
                <div
                  className={
                    styles.sectionHeader
                  }
                >
                  <Clock3
                    size={23}
                    strokeWidth={1.9}
                    className={
                      styles.recentIcon
                    }
                  />

                  <h3>
                    Recently searched
                  </h3>
                </div>

                <div
                  className={
                    styles.recentList
                  }
                >
                  {recentSearches.map(
                    (recent) => (
                      <div
                        key={recent.id}
                        className={
                          styles.recentChip
                        }
                      >
                        <button
                          type="button"
                          className={
                            styles.recentMain
                          }
                          onMouseDown={(
                            event
                          ) =>
                            event.preventDefault()
                          }
                          onClick={() =>
                            handleRecentSelect(
                              recent
                            )
                          }
                        >
                          <Clock3
                            size={19}
                            strokeWidth={1.8}
                          />

                          <span>
                            {
                              recent.label
                            }
                          </span>
                        </button>

                        {onRecentRemove && (
                          <button
                            type="button"
                            className={
                              styles.removeRecent
                            }
                            aria-label={`Remove ${recent.label}`}
                            onMouseDown={(
                              event
                            ) =>
                              event.preventDefault()
                            }
                            onClick={() =>
                              onRecentRemove(
                                recent
                              )
                            }
                          >
                            <span>
                              −
                            </span>
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
        </div>

        {/* =================================================
            SUGGESTIONS
            ================================================= */}

        {showSuggestions && (
          <div
            id="chatboat-search-suggestions"
            className={
              styles.suggestions
            }
            role="listbox"
          >
            {filteredSuggestions.map(
              (
                suggestion,
                index
              ) => (
                <button
                  key={
                    suggestion.id
                  }
                  type="button"
                  role="option"
                  aria-selected={
                    activeIndex ===
                    index
                  }
                  className={`${styles.suggestionItem} ${
                    activeIndex ===
                    index
                      ? styles.suggestionActive
                      : ""
                  }`}
                  onMouseDown={(
                    event
                  ) =>
                    event.preventDefault()
                  }
                  onClick={() =>
                    handleSuggestionSelect(
                      suggestion
                    )
                  }
                >
                  <Search
                    size={16}
                    strokeWidth={1.8}
                  />

                  <span>
                    {
                      suggestion.label
                    }
                  </span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBarChatBoat;