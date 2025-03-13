"use client";

import { Button } from "@/components/ui/button";
import {
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({
  url,
  title,
  description = "",
}: ShareButtonsProps) {
  // Use the current URL if not provided
  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  // Share handlers
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, "_blank");
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(linkedinUrl, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\nRead more: ${shareUrl}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(emailUrl);
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
        Share:
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={handleTwitterShare}
        aria-label="Share on Twitter"
        className="h-8 w-8 rounded-full"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleFacebookShare}
        aria-label="Share on Facebook"
        className="h-8 w-8 rounded-full"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleLinkedInShare}
        aria-label="Share on LinkedIn"
        className="h-8 w-8 rounded-full"
      >
        <Linkedin className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleEmailShare}
        aria-label="Share via Email"
        className="h-8 w-8 rounded-full"
      >
        <Mail className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleCopyLink}
        aria-label="Copy link"
        className="h-8 w-8 rounded-full"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
