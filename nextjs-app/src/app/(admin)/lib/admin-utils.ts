/**
 * Admin Utilities
 *
 * Utility functions specific to the Admin module
 */

/**
 * Formats a date for consistent display across admin UI
 */
export function formatDate(date: string | Date): string {
  if (!date) return "N/A";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Truncates text to a specific length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return `${text.substring(0, maxLength)}...`;
}

/**
 * Gets a color class based on status for consistent status display
 */
export function getStatusColorClass(status: string): string {
  const statusMap: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    complete: "bg-blue-100 text-blue-800",
    new: "bg-blue-100 text-blue-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-orange-100 text-orange-800",
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
  };

  return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800";
}

/**
 * Formats a number with commas for better readability
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Checks if user has required permission
 */
export function hasPermission(
  userRole: string | undefined,
  requiredRole: string = "ADMIN"
): boolean {
  if (!userRole) return false;

  const roles = {
    SUPERADMIN: 3,
    ADMIN: 2,
    MODERATOR: 1,
    USER: 0,
  };

  return (
    (roles[userRole as keyof typeof roles] || 0) >=
    (roles[requiredRole as keyof typeof roles] || 0)
  );
}
