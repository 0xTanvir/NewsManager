import React, { useState, useEffect } from "react";

interface RelativeTimeProps {
  date: string;
  className?: string;
}

const RelativeTime: React.FC<RelativeTimeProps> = ({ date, className }) => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  const getTimeAgo = (isoString: string): string => {
    try {
      // Ensure both dates are in UTC for proper comparison
      const now = Date.now(); // Current time in milliseconds since epoch UTC
      const created = new Date(isoString).getTime(); // Convert ISO string to milliseconds UTC

      // Calculate time difference in milliseconds
      const diffInMs = Math.abs(now - created); // Using Math.abs to avoid negative values
      const diffInSeconds = Math.floor(diffInMs / 1000);

      // Less than 30 seconds
      if (diffInSeconds < 30) {
        return "just now";
      }

      // Less than a minute
      if (diffInSeconds < 60) {
        return "30s ago";
      }

      // Less than an hour
      if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
      }

      // Less than a day
      if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
      }

      // Less than a week
      if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
      }

      // Less than a month
      if (diffInSeconds < 2592000) {
        const weeks = Math.floor(diffInSeconds / 604800);
        return `${weeks}w ago`;
      }

      // Less than a year
      if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months}mo ago`;
      }

      // More than a year
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years}y ago`;
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date";
    }
  };

  useEffect(() => {
    const updateTime = () => {
      setTimeAgo(getTimeAgo(date));
    };

    // Initial update
    updateTime();

    // Update interval
    const intervalId = setInterval(() => {
      updateTime();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, [date]);

  // Format the full date for the tooltip
  const formatFullDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }).format(date);
    } catch {
      return "Invalid date";
    }
  };

  return (
    <span
      className={`text-sm ${className || ""}`}
      title={formatFullDate(date)}
      data-testid="relative-time"
    >
      {timeAgo}
    </span>
  );
};

export default RelativeTime;
