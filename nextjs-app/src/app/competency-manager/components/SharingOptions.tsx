"use client";

import { useState } from "react";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, Mail } from "lucide-react";
import { CompetencyFramework } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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

  const handlePublicToggle = async () => {
    setIsUpdating(true);
    try {
      const newStatus = !isPublic;
      await onUpdatePublicStatus(newStatus);
      setIsPublic(newStatus);
      toast.success(`Framework is now ${newStatus ? "public" : "private"}`);
    } catch (error) {
      console.error("Error updating public status:", error);
      toast.error("Failed to update sharing settings");
    } finally {
      setIsUpdating(false);
    }
  };

  const copyShareLink = () => {
    if (!framework.id) return;

    const shareUrl = `${window.location.origin}/competency-manager/shared/${framework.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Share link copied to clipboard");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="public-toggle">Public Sharing</Label>
          <FormDescription>
            {isPremiumUser
              ? "Make your framework publicly accessible with a share link"
              : "Upgrade to premium to share your frameworks"}
          </FormDescription>
        </div>
        <Switch
          id="public-toggle"
          checked={isPublic}
          onCheckedChange={handlePublicToggle}
          disabled={isUpdating || !isPremiumUser}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyShareLink}
          disabled={!isPublic || !framework.id || !isPremiumUser}
        >
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          Copy Link
        </Button>

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
