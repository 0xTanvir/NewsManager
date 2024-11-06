"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonHTMLAttributes } from "react";

interface ContactButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "privacy" | "terms" | "about";
}

export default function ContactButton({
  className,
  variant = "about",
  ...props
}: ContactButtonProps) {
  const subjects = {
    privacy: "Privacy%20Inquiry",
    terms: "Terms%20Inquiry",
    about: "General%20Inquiry",
  };

  const buttonText = {
    privacy: "Contact Us About Privacy",
    terms: "Contact Us About These Terms",
    about: "Contact Us",
  };

  return (
    <Button
      className={`gap-2 ${className || ""}`}
      onClick={() =>
        (window.location.href = `mailto:support@ypigeon.com?subject=${subjects[variant]}&body=Hello%2C%0A%0AI%20have%20a%20question...`)
      }
      {...props}
    >
      <Mail className="h-4 w-4" />
      {buttonText[variant]}
    </Button>
  );
}
