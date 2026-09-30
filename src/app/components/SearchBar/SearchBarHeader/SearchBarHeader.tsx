"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  SendHorizontal,
  Search,
  X,
} from "lucide-react";

import SearchBarChatBoat from "../SearchBarChatBoat/SearchBarChatBoat";

import styles from "./SearchBarHeader.module.scss";

/* =========================================================
   TYPES
   ========================================================= */

export interface SearchSuggestion {
  id: string | number;
  label: string;
  value?: string;
}

export interface SearchBarHeaderProps {
  /* -------------------------------------------------------
     PLACEHOLDER
     ------------------------------------------------------- */

  placeholder?: string;

  placeholders?: string[];

  placeholderTypingSpeed?: number;

  placeholderPauseDuration?: number;

  /* -------------------------------------------------------
     VALUE
     ------------------------------------------------------- */

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
     BRAND
     ------------------------------------------------------- */

  logoSrc?: string;

  logoAlt?: string;

  /* -------------------------------------------------------
     UI
     ------------------------------------------------------- */

  showSearchIcon?: boolean;

  showClearButton?: boolean;

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

/* =========================================================
   COMPONENT
   ========================================================= */

const SearchBarHeader: React.FC<
  SearchBarHeaderProps
> = ({
  placeholder =
  "Search for an Instant Ride",

  placeholders =
  DEFAULT_PLACEHOLDERS,

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
    /* =======================================================
       STATE
       ======================================================= */

    const [isChatBoatOpen, setIsChatBoatOpen] =
      useState(false);

    const [isFocused, setIsFocused] =
      useState(false);

    const [internalValue, setInternalValue] =
      useState(defaultValue);

    const inputRef =
      useRef<HTMLInputElement>(null);

    const modalRef =
      useRef<HTMLDivElement>(null);

    /* =======================================================
       CONTROLLED / UNCONTROLLED
       ======================================================= */

    const isControlled =
      value !== undefined;

    const searchValue =
      isControlled
        ? value
        : internalValue;

    /* =======================================================
       PLACEHOLDER LIST
       ======================================================= */

    const placeholderList =
      placeholders.length > 0
        ? placeholders
        : [placeholder];

    const [typedPlaceholder, setTypedPlaceholder] =
      useState("");

    const [placeholderIndex, setPlaceholderIndex] =
      useState(0);

    const [
      isDeletingPlaceholder,
      setIsDeletingPlaceholder,
    ] = useState(false);

    /* =======================================================
       TYPEWRITER
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
        placeholderList[
        placeholderIndex
        ] ?? placeholder;

      let timeout: ReturnType<
        typeof setTimeout
      >;

      /* -------------------------------------------------------
         COMPLETED PLACEHOLDER
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
         COMPLETED DELETING
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
         TYPE
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
         DELETE
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
       RESET TYPEWRITER
       ======================================================= */

    useEffect(() => {
      if (searchValue.length === 0) {
        return;
      }

      setTypedPlaceholder("");

      setIsDeletingPlaceholder(false);
    }, [searchValue]);

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
       OPEN CHATBOT MODAL
       ======================================================= */

    const openChatBoat = () => {
      if (disabled) {
        return;
      }

      setIsChatBoatOpen(true);
    };

    /* =======================================================
       CLOSE CHATBOT MODAL
       ======================================================= */

    const closeChatBoat = () => {
      setIsChatBoatOpen(false);

      requestAnimationFrame(() => {
        inputRef.current?.blur();
      });
    };

    /* =======================================================
       ESCAPE KEY
       ======================================================= */

    useEffect(() => {
      if (!isChatBoatOpen) {
        return;
      }

      const handleEscape = (
        event: globalThis.KeyboardEvent
      ) => {
        if (event.key === "Escape") {
          closeChatBoat();
        }
      };

      document.addEventListener(
        "keydown",
        handleEscape
      );

      return () => {
        document.removeEventListener(
          "keydown",
          handleEscape
        );
      };
    }, [isChatBoatOpen]);

    /* =======================================================
       BODY SCROLL LOCK
       ======================================================= */

    useEffect(() => {
      if (!isChatBoatOpen) {
        return;
      }

      const previousOverflow =
        document.body.style.overflow;

      document.body.style.overflow =
        "hidden";

      return () => {
        document.body.style.overflow =
          previousOverflow;
      };
    }, [isChatBoatOpen]);

    /* =======================================================
       AUTO FOCUS MODAL INPUT
       ======================================================= */

    useEffect(() => {
      if (!isChatBoatOpen) {
        return;
      }

      const timer = setTimeout(() => {
        const modalInput =
          modalRef.current?.querySelector(
            "input"
          ) as HTMLInputElement | null;

        modalInput?.focus();
      }, 150);

      return () =>
        clearTimeout(timer);
    }, [isChatBoatOpen]);

    /* =======================================================
       BACKDROP CLICK
       ======================================================= */

    const handleBackdropClick = (
      event: React.MouseEvent<HTMLDivElement>
    ) => {
      if (
        event.target ===
        event.currentTarget
      ) {
        closeChatBoat();
      }
    };

    /* =======================================================
       HEADER KEYBOARD
       ======================================================= */

    const handleHeaderKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>
    ) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();

        openChatBoat();
      }
    };

    /* =======================================================
       PLACEHOLDER
       ======================================================= */

    const currentPlaceholder =
      searchValue.length > 0
        ? placeholder
        : typedPlaceholder;

    const hasValue =
      searchValue.trim().length > 0;

    /* =======================================================
       RENDER
       ======================================================= */

    return (
      <>
        {/* =================================================
          HEADER SEARCH BAR
          ================================================= */}

        <div
          className={`${styles.wrapper} ${className}`}
          onClick={openChatBoat}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="dialog"
          aria-expanded={
            isChatBoatOpen
          }
          aria-label="Open EVA search"
          onKeyDown={
            handleHeaderKeyDown
          }
        >
          <div
            className={`${styles.searchContainer} ${isFocused
                ? styles.focused
                : ""
              } ${disabled
                ? styles.disabled
                : ""
              }`}
          >
            <div className={styles.inner}>
              {/* =========================================
                EVA BRAND
                ========================================= */}

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

              {/* =========================================
                DIVIDER
                ========================================= */}

              <div
                className={styles.divider}
              />

              {/* =========================================
                SEARCH ICON
                ========================================= */}

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

              {/* =========================================
                HEADER INPUT
                READ-ONLY BECAUSE IT OPENS MODAL
                ========================================= */}

              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                readOnly
                placeholder={
                  currentPlaceholder
                }
                disabled={disabled}
                maxLength={maxLength}
                autoComplete="off"
                className={`${styles.input} ${inputClassName}`}
                aria-label={ariaLabel}
                tabIndex={-1}
              />

              {/* =========================================
                CLEAR
                ========================================= */}

              {showClearButton &&
                hasValue &&
                !disabled && (
                  <button
                    type="button"
                    className={
                      styles.clearButton
                    }
                    onClick={(event) => {
                      event.stopPropagation();

                      handleClear();
                    }}
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}

              {/* =========================================
                OPEN MODAL BUTTON
                ========================================= */}

              <button
                type="button"
                className={`${styles.sendButton} ${styles.sendDisabled}`}
                onClick={(event) => {
                  event.stopPropagation();

                  openChatBoat();
                }}
                aria-label="Open search"
              >
                <SendHorizontal
                  size={27}
                  strokeWidth={2.2}
                />
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
    CHATBOT MODAL
    ================================================= */}

        {isChatBoatOpen && (
          <div
            className={styles.chatModalOverlay}
            role="presentation"
            onMouseDown={handleBackdropClick}
          >
            {/* =============================================
        ACTUAL MODAL
        ============================================= */}

            <div
              ref={modalRef}
              className={styles.chatModal}
              role="dialog"
              aria-modal="true"
              aria-label="Ask EVA search"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >

              {/* =============================================
          CLOSE BUTTON
          OUTSIDE TOP-RIGHT MODAL EDGE
          ============================================= */}

              <button
                type="button"
                className={styles.modalClose}
                onClick={closeChatBoat}
                aria-label="Close search"
              >
                <X
                  size={24}
                  strokeWidth={2.2}
                />
              </button>

              <div
                className={styles.chatBoatContent}
              >
                {/* =========================================
            SEARCH CHATBOT

            IMPORTANT:
            - Input remains editable
            - Suggestions can be selected
            - Selecting suggestion does NOT close
            - Search does NOT close modal
            ========================================= */}

                <SearchBarChatBoat
                  placeholder="Search for an Instant Ride"
                  placeholders={DEFAULT_PLACEHOLDERS}
                  placeholderTypingSpeed={
                    placeholderTypingSpeed
                  }
                  placeholderPauseDuration={
                    placeholderPauseDuration
                  }
                  suggestions={suggestions}
                  onSuggestionSelect={(
                    suggestion
                  ) => {
                    onSuggestionSelect?.(
                      suggestion
                    );
                  }}
                  onSearch={(search) => {
                    onSearch?.(search);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

export default SearchBarHeader;