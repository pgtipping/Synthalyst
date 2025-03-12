"use client";

import { format } from "date-fns";
import { Mail, User, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ThreadItem {
  id: string;
  type: "submission" | "reply" | "email";
  content: string;
  sender: string;
  email: string;
  createdAt: string | Date;
  reference: string | null;
}

interface ThreadTimelineProps {
  items: ThreadItem[];
}

export default function ThreadTimeline({ items }: ThreadTimelineProps) {
  // Format date for display
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  };

  // Get icon for thread item type
  const getItemIcon = (type: string) => {
    switch (type) {
      case "submission":
        return <User className="h-5 w-5 text-blue-500" />;
      case "reply":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "email":
        return <Mail className="h-5 w-5 text-orange-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get background color for thread item type
  const getItemBackground = (type: string) => {
    switch (type) {
      case "submission":
        return "bg-blue-50 border-blue-200";
      case "reply":
        return "bg-green-50 border-green-200";
      case "email":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // Get badge color for thread item type
  const getItemBadgeColor = (type: string) => {
    switch (type) {
      case "submission":
        return "bg-blue-100 text-blue-800";
      case "reply":
        return "bg-green-100 text-green-800";
      case "email":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`relative pl-6 ${
            index !== items.length - 1
              ? "before:absolute before:left-2 before:top-8 before:h-full before:w-0.5 before:bg-gray-200"
              : ""
          }`}
        >
          <div
            className={`relative p-4 rounded-lg border ${getItemBackground(
              item.type
            )}`}
          >
            {/* Visual connector dot */}
            <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
              {getItemIcon(item.type)}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.sender}</span>
                  <Badge className={getItemBadgeColor(item.type)}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">{item.email}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm text-gray-500">
                  {formatDate(item.createdAt)}
                </div>
                {item.reference && (
                  <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-mono mt-1">
                    {item.reference}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">{item.content}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
