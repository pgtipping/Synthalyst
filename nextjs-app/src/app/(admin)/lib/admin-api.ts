/**
 * Admin API Utilities
 *
 * Utility functions for interacting with admin-specific API endpoints
 */

/**
 * Base interface for API responses
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch options with automatic error handling
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Failed with status: ${response.status}`,
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get all users from the API
 */
export async function getUsers() {
  return fetchWithErrorHandling("/api/admin/users");
}

/**
 * Update a user's role
 */
export async function updateUserRole(userId: string, role: string) {
  return fetchWithErrorHandling(`/api/admin/users/${userId}/update-role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

/**
 * Get email logs with optional filtering
 */
export async function getEmailLogs(
  params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}
) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.status) searchParams.append("status", params.status);
  if (params.search) searchParams.append("search", params.search);

  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  return fetchWithErrorHandling(`/api/admin/email-logs${queryString}`);
}

/**
 * Get contact submissions with optional filtering
 */
export async function getContactSubmissions(
  params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}
) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.status) searchParams.append("status", params.status);
  if (params.search) searchParams.append("search", params.search);

  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  return fetchWithErrorHandling(`/api/admin/contact-submissions${queryString}`);
}

/**
 * Update contact submission status
 */
export async function updateContactSubmissionStatus(
  id: string,
  status: string
) {
  return fetchWithErrorHandling(
    `/api/admin/contact-submissions/${id}/update-status`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    }
  );
}
