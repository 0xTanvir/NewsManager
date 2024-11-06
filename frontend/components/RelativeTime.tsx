import { useState, useEffect } from "react";

interface RelativeTimeProps {
  date: string | number | Date;
}

const RelativeTime: React.FC<RelativeTimeProps> = ({ date }) => {
  const [relativeTime, setRelativeTime] = useState<string>("");

  function formatRelativeTime(dateInput: string | number | Date): string {
    const now = new Date().getTime();
    const past = new Date(dateInput).getTime();
    const diffInSeconds = Math.floor((now - past) / 1000);

    // Just now - within last minute
    if (diffInSeconds < 60) {
      return "just now";
    }

    // Minutes
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    // Hours
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    // Days
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    // Months
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    }

    // Years
    const years = Math.floor(months / 12);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }

  useEffect(() => {
    // Set initial value
    setRelativeTime(formatRelativeTime(date));

    // Update the relative time every minute
    const intervalId = setInterval(() => {
      setRelativeTime(formatRelativeTime(date));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [date]);

  // Add a tooltip with the actual date
  const fullDate = new Date(date).toLocaleString();

  return (
    <span className="relative group cursor-help">
      <span>{relativeTime}</span>
      <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
        {fullDate}
      </span>
    </span>
  );
};

export default RelativeTime;
