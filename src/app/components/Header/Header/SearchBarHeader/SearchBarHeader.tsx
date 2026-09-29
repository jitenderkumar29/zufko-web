"use client";

import React, {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { SendHorizontal, Search, X } from "lucide-react";

import styles from "./SearchBarHeader.module.scss";

export interface SearchSuggestion {
  id: string | number;
  label: string;
  value?: string;
}

export interface SearchBarHeaderProps {
  placeholder?: string;

  /**
   * Multiple placeholders for typewriter animation.
   * If provided, these will rotate automatically.
   */
  placeholders?: string[];

  /**
   * Speed of typing/deleting each character.
   */
  placeholderTypingSpeed?: number;

  /**
   * Time to wait after completing a placeholder.
   */
  placeholderPauseDuration?: number;

  value?: string;
  defaultValue?: string;

  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;

  suggestions?: SearchSuggestion[];
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;

  logoSrc?: string;
  logoAlt?: string;

  showSearchIcon?: boolean;
  showClearButton?: boolean;
  disabled?: boolean;

  className?: string;
  inputClassName?: string;

  ariaLabel?: string;
  maxLength?: number;
}

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

const SearchBarHeader: React.FC<SearchBarHeaderProps> = ({
  placeholder = "Search FAQs, products and more",
  placeholders = DEFAULT_PLACEHOLDERS,

  placeholderTypingSpeed = 65,
  placeholderPauseDuration = 1800,

  value,
  defaultValue = "",

  onChange,
  onSearch,

  suggestions = [],
  onSuggestionSelect,

  logoSrc = DEFAULT_LOGO,
  logoAlt = "EVA",

  showSearchIcon = false,
  showClearButton = true,
  disabled = false,

  className = "",
  inputClassName = "",

  ariaLabel = "Search",
  maxLength,
}) => {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  /*
   * Typewriter placeholder state
   */
  const [typedPlaceholder, setTypedPlaceholder] =
    useState("");

  const [placeholderIndex, setPlaceholderIndex] =
    useState(0);

  const [isDeletingPlaceholder, setIsDeletingPlaceholder] =
    useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const searchValue = isControlled ? value : internalValue;

  /*
   * Use custom placeholders if supplied.
   * Otherwise use the normal placeholder prop.
   */
  const placeholderList =
    placeholders.length > 0
      ? placeholders
      : [placeholder];

  /*
   * Typewriter animation
   *
   * It stops automatically when the user starts typing.
   */
  useEffect(() => {
    if (disabled || searchValue.length > 0) {
      return;
    }

    if (!placeholderList.length) {
      return;
    }

    const currentText =
      placeholderList[placeholderIndex] ?? placeholder;

    let timeout: ReturnType<typeof setTimeout>;

    /*
     * Finished typing current placeholder.
     * Wait before deleting.
     */
    if (
      !isDeletingPlaceholder &&
      typedPlaceholder === currentText
    ) {
      timeout = setTimeout(() => {
        setIsDeletingPlaceholder(true);
      }, placeholderPauseDuration);

      return () => clearTimeout(timeout);
    }

    /*
     * Finished deleting current placeholder.
     * Move to next placeholder.
     */
    if (
      isDeletingPlaceholder &&
      typedPlaceholder === ""
    ) {
      setIsDeletingPlaceholder(false);

      setPlaceholderIndex(
        (current) =>
          (current + 1) % placeholderList.length
      );

      return;
    }

    /*
     * Type one character.
     */
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

    /*
     * Delete one character.
     */
    else {
      timeout = setTimeout(() => {
        setTypedPlaceholder(
          currentText.slice(
            0,
            Math.max(0, typedPlaceholder.length - 1)
          )
        );
      }, placeholderTypingSpeed / 1.5);
    }

    return () => clearTimeout(timeout);
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

  /*
   * Reset typewriter when input becomes empty.
   */
  useEffect(() => {
    if (searchValue.length === 0) {
      return;
    }

    setTypedPlaceholder("");
    setIsDeletingPlaceholder(false);
  }, [searchValue]);

  const filteredSuggestions =
    searchValue.trim().length > 0
      ? suggestions
          .filter((item) =>
            item.label
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          )
          .slice(0, 6)
      : [];

  const hasValue = searchValue.trim().length > 0;

  const updateValue = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
    setActiveIndex(-1);
  };

  const handleSearch = () => {
    const trimmedValue = searchValue.trim();

    if (!trimmedValue || disabled) {
      return;
    }

    onSearch?.(trimmedValue);
  };

  const handleClear = () => {
    updateValue("");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleSuggestionSelect = (
    suggestion: SearchSuggestion
  ) => {
    const selectedValue =
      suggestion.value ?? suggestion.label;

    updateValue(selectedValue);

    onSuggestionSelect?.(suggestion);

    onSearch?.(selectedValue);

    setActiveIndex(-1);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (
        activeIndex >= 0 &&
        filteredSuggestions[activeIndex]
      ) {
        handleSuggestionSelect(
          filteredSuggestions[activeIndex]
        );
      } else {
        handleSearch();
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!filteredSuggestions.length) {
        return;
      }

      setActiveIndex((current) =>
        current < filteredSuggestions.length - 1
          ? current + 1
          : 0
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!filteredSuggestions.length) {
        return;
      }

      setActiveIndex((current) =>
        current > 0
          ? current - 1
          : filteredSuggestions.length - 1
      );

      return;
    }

    if (event.key === "Escape") {
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    if (activeIndex >= filteredSuggestions.length) {
      setActiveIndex(-1);
    }
  }, [activeIndex, filteredSuggestions.length]);

  const showSuggestions =
    isFocused && filteredSuggestions.length > 0;

  /*
   * When user has entered text:
   * use normal placeholder.
   *
   * When empty:
   * use animated typewriter placeholder.
   */
  const currentPlaceholder =
    searchValue.length > 0
      ? placeholder
      : typedPlaceholder;

  return (
    <div
      className={`${styles.wrapper} ${className}`}
    >
      <div
        className={`${styles.searchContainer} ${
          isFocused ? styles.focused : ""
        } ${disabled ? styles.disabled : ""}`}
      >
        <div className={styles.inner}>
          {/* EVA BRAND */}
          <div className={styles.brand}>
            <div className={styles.logoWrapper}>
              <img
                src={logoSrc}
                alt={logoAlt}
                className={styles.logo}
              />
            </div>

            <div className={styles.brandText}>
              <span className={styles.ask}>
                ASK
              </span>

              <span className={styles.eva}>
                EVA
              </span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* OPTIONAL SEARCH ICON */}
          {showSearchIcon && (
            <Search
              size={19}
              strokeWidth={2}
              className={styles.searchIcon}
              aria-hidden="true"
            />
          )}

          {/* INPUT */}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(event) =>
              updateValue(event.target.value)
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(
                () => setIsFocused(false),
                120
              );
            }}
            onKeyDown={handleKeyDown}
            placeholder={currentPlaceholder}
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
            aria-expanded={showSuggestions}
            aria-controls={
              showSuggestions
                ? "search-suggestions"
                : undefined
            }
          />

          {/* CLEAR */}
          {showClearButton &&
            hasValue &&
            !disabled && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}

          {/* SEND */}
          <button
            type="button"
            className={`${styles.sendButton} ${
              !hasValue || disabled
                ? styles.sendDisabled
                : styles.sendActive
            }`}
            onClick={handleSearch}
            disabled={!hasValue || disabled}
            aria-label="Send"
            aria-disabled={
              !hasValue || disabled
            }
          >
            <SendHorizontal
              size={28}
              strokeWidth={2.2}
            />
          </button>
        </div>

        {/* SUGGESTIONS */}
        {showSuggestions && (
          <div
            id="search-suggestions"
            className={styles.suggestions}
            role="listbox"
          >
            {filteredSuggestions.map(
              (suggestion, index) => (
                <button
                  key={suggestion.id}
                  type="button"
                  role="option"
                  aria-selected={
                    activeIndex === index
                  }
                  className={`${styles.suggestionItem} ${
                    activeIndex === index
                      ? styles.suggestionActive
                      : ""
                  }`}
                  onMouseDown={(event) =>
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
                    {suggestion.label}
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

export default SearchBarHeader;