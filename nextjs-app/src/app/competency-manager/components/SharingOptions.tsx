"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, Mail, Share2, Globe, Lock } from "lucide-react";
import { CompetencyFramework } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface SharingOptionsProps {
  framework: CompetencyFramework;
  onUpdatePublicStatus: (isPublic: boolean) => Promise<void>;
}

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function SharingOptions({
  framework,
  onUpdatePublicStatus,
}: SharingOptionsProps) {
  const [isPublic, setIsPublic] = useState(framework.isPublic || false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const shareUrl = `${window.location.origin}/competency-manager/shared/${framework.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  const handlePublicToggle = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      await onUpdatePublicStatus(checked);
      setIsPublic(checked);

      if (checked) {
        toast.success("Framework is now public");
      } else {
        toast.success("Framework is now private");
      }
    } catch (error) {
      console.error("Failed to update public status:", error);
      toast.error("Failed to update sharing settings");
      // Revert the UI state since the API call failed
      setIsPublic(!checked);
    } finally {
      setIsUpdating(false);
    }
  };

  const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    setIsSendingEmail(true);
    try {
      // This would be connected to a real email service in production
      // For now, we'll just simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Share link sent to ${values.email}`);
      setIsEmailDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send share link");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Premium feature teaser - only show full functionality for premium users
  const isPremiumUser = false; // This would be determined by user subscription status

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sharing Options</h3>

      <div className="flex items-center space-x-2">
        <Switch
          id="public-toggle"
          checked={isPublic}
          onCheckedChange={handlePublicToggle}
          disabled={isUpdating}
        />
        <Label htmlFor="public-toggle" className="cursor-pointer">
          {isPublic ? (
            <span className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-green-500" />
              Public
            </span>
          ) : (
            <span className="flex items-center">
              <Lock className="h-4 w-4 mr-2 text-gray-500" />
              Private
            </span>
          )}
        </Label>
      </div>

      <div className="text-sm text-gray-500">
        {isPublic
          ? "Anyone with the link can view this framework."
          : "Only you can view this framework."}
      </div>

      {isPublic && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium">Share this link:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 p-2 text-sm border rounded-md bg-white"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!isPublic || !framework.id || !isPremiumUser}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share via Email</DialogTitle>
              <DialogDescription>
                Send a link to this competency framework via email.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onEmailSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input placeholder="colleague@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isSendingEmail}>
                    {isSendingEmail ? "Sending..." : "Send"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {!isPremiumUser && (
          <div className="w-full mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
            <p className="font-medium">Premium Feature</p>
            <p>
              Upgrade to premium to share your competency frameworks with
              colleagues and integrate with other HR tools.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
