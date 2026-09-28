"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaVolumeOff,
  FaVolumeHigh,
} from "react-icons/fa6";

import styles from "./VideoPlayerSimple.module.scss";

export interface VideoPlayerSimpleProps {
  /**
   * Video source URL
   */
  src: string;

  /**
   * Poster image
   */
  poster?: string;

  /**
   * Automatically play video
   * @default true
   */
  autoPlay?: boolean;

  /**
   * Start muted
   * @default true
   */
  muted?: boolean;

  /**
   * Loop video
   * @default true
   */
  loop?: boolean;

  /**
   * Additional custom class
   */
  className?: string;

  /**
   * Aspect ratio used when height is not provided
   */
  aspectRatio?:
    | "16:9"
    | "4:3"
    | "1:1"
    | "21:9"
    | "9:16"
    | "3:4"
    | "custom";

  /**
   * Custom aspect ratio.
   *
   * Example:
   * 1.5 = 3:2
   * 1.777 = 16:9
   */
  customRatio?: number;

  /**
   * Custom height.
   *
   * Example:
   * height={800}
   * height="80vh"
   */
  height?: string | number;

  /**
   * Maximum height
   *
   * Example:
   * maxHeight="100vh"
   */
  maxHeight?: string | number;

  /**
   * Minimum height
   */
  minHeight?: string | number;

  /**
   * Optional custom width.
   *
   * By default the component uses 100vw.
   */
  width?: string | number;

  /**
   * Maximum width
   */
  maxWidth?: string | number;

  /**
   * Video fit
   *
   * cover:
   * Fills the entire container but may crop video.
   *
   * contain:
   * Shows complete video but may leave empty space.
   *
   * fill:
   * Completely fills container but may distort video.
   *
   * @default cover
   */
  fit?: "cover" | "contain" | "fill";

  /**
   * Callback when mute state changes
   */
  onMuteToggle?: (
    isMuted: boolean
  ) => void;

  /**
   * Callback when video starts playing
   */
  onPlay?: () => void;

  /**
   * Callback when video pauses
   */
  onPause?: () => void;

  /**
   * Callback when video ends
   */
  onEnded?: () => void;
}

const VideoPlayerSimple: React.FC<
  VideoPlayerSimpleProps
> = ({
  src,
  poster,

  autoPlay = true,
  muted = true,
  loop = true,

  className = "",

  aspectRatio = "16:9",
  customRatio,

  height,
  maxHeight,
  minHeight,

  width,
  maxWidth,

  fit = "cover",

  onMuteToggle,
  onPlay,
  onPause,
  onEnded,
}) => {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] =
    useState<boolean>(muted);

  /**
   * Convert number/string to CSS value
   */
  const getCssValue = (
    value?: string | number
  ): string | undefined => {
    if (value === undefined) {
      return undefined;
    }

    return typeof value === "number"
      ? `${value}px`
      : value;
  };

  /**
   * Get aspect ratio.
   *
   * Only used when custom height is not provided.
   */
  const getAspectRatio = (): number => {
    if (
      aspectRatio === "custom" &&
      customRatio &&
      customRatio > 0
    ) {
      return customRatio;
    }

    const ratios: Record<
      Exclude<
        NonNullable<
          VideoPlayerSimpleProps["aspectRatio"]
        >,
        "custom"
      >,
      number
    > = {
      "16:9": 16 / 9,
      "4:3": 4 / 3,
      "1:1": 1,
      "21:9": 21 / 9,
      "9:16": 9 / 16,
      "3:4": 3 / 4,
    };

    if (aspectRatio === "custom") {
      return 16 / 9;
    }

    return ratios[aspectRatio] ?? 16 / 9;
  };

  /**
   * Container styles.
   *
   * Default:
   *
   * width = 100vw
   *
   * If height exists:
   *
   * height = custom height
   *
   * Example:
   *
   * height={800}
   *
   * gives:
   *
   * width: 100vw
   * height: 800px
   */
  const getContainerStyles =
    (): React.CSSProperties => {
      const containerStyles: React.CSSProperties =
        {
          width: "100vw",
          maxWidth: "100vw",

          /**
           * Break the component out of a centered
           * max-width parent container.
           */
          marginLeft:
            "calc(50% - 50vw)",

          marginRight:
            "calc(50% - 50vw)",
        };

      /**
       * Custom height has priority.
       */
      if (height !== undefined) {
        containerStyles.height =
          getCssValue(height);

        containerStyles.aspectRatio = "auto";
      } else {
        /**
         * If height isn't supplied,
         * use the selected aspect ratio.
         */
        containerStyles.aspectRatio =
          `${getAspectRatio()}`;
      }

      /**
       * Height constraints
       */
      if (maxHeight !== undefined) {
        containerStyles.maxHeight =
          getCssValue(maxHeight);
      }

      if (minHeight !== undefined) {
        containerStyles.minHeight =
          getCssValue(minHeight);
      }

      /**
       * Optional custom width.
       *
       * Normally this is not needed because
       * the component uses 100vw.
       */
      if (width !== undefined) {
        containerStyles.width =
          getCssValue(width);

        containerStyles.maxWidth =
          maxWidth !== undefined
            ? getCssValue(maxWidth)
            : undefined;

        containerStyles.marginLeft =
          "auto";

        containerStyles.marginRight =
          "auto";
      }

      /**
       * maxWidth only applies when custom
       * width is not full viewport width.
       */
      if (
        width !== undefined &&
        maxWidth !== undefined
      ) {
        containerStyles.maxWidth =
          getCssValue(maxWidth);
      }

      return containerStyles;
    };

  /**
   * Attach video event listeners.
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const handlePlay = () => {
      onPlay?.();
    };

    const handlePause = () => {
      onPause?.();
    };

    const handleVolumeChange = () => {
      setIsMuted(video.muted);
    };

    const handleEnded = () => {
      onEnded?.();
    };

    video.addEventListener(
      "play",
      handlePlay
    );

    video.addEventListener(
      "pause",
      handlePause
    );

    video.addEventListener(
      "volumechange",
      handleVolumeChange
    );

    video.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      video.removeEventListener(
        "play",
        handlePlay
      );

      video.removeEventListener(
        "pause",
        handlePause
      );

      video.removeEventListener(
        "volumechange",
        handleVolumeChange
      );

      video.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, [
    onPlay,
    onPause,
    onEnded,
  ]);

  /**
   * Sync muted prop with video.
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = muted;

    setIsMuted(muted);
  }, [muted]);

  /**
   * Autoplay.
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !autoPlay) {
      return;
    }

    video.muted = muted;

    const startVideo = async () => {
      try {
        await video.play();
      } catch {
        /**
         * Browser may block autoplay.
         *
         * User interaction will start
         * the video later.
         */
      }
    };

    startVideo();
  }, [
    autoPlay,
    muted,
    src,
  ]);

  /**
   * Start video when user interacts.
   *
   * This also helps when browser autoplay
   * restrictions prevent automatic playback.
   */
  const handleVideoInteraction = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      video.play().catch(() => {});
    }
  };

  /**
   * Toggle mute/unmute.
   */
  const toggleMute = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextMuted =
      !video.muted;

    video.muted = nextMuted;

    setIsMuted(nextMuted);

    onMuteToggle?.(nextMuted);
  };

  return (
    <div
      className={`${styles.videoPlayer} ${className}`}
      style={getContainerStyles()}
      onClick={handleVideoInteraction}
      onTouchStart={handleVideoInteraction}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        className={`${styles.videoElement} ${
          styles[`fit-${fit}`]
        }`}
        aria-label="Video player"
      />

      {/* =====================================
          MUTE BUTTON
      ===================================== */}
      <button
        type="button"
        className={styles.muteButton}
        onClick={toggleMute}
        aria-label={
          isMuted
            ? "Unmute video"
            : "Mute video"
        }
        title={
          isMuted
            ? "Unmute video"
            : "Mute video"
        }
      >
        {isMuted ? (
          <FaVolumeOff />
        ) : (
          <FaVolumeHigh />
        )}
      </button>
    </div>
  );
};

export default VideoPlayerSimple;