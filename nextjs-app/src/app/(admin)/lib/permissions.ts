/**
 * Admin Permissions System
 *
 * Utilities for handling admin role-based permissions
 */

// Defining permission levels
export enum PermissionLevel {
  // Basic user - no admin access
  USER = 0,

  // Can view limited admin data but not modify
  VIEWER = 1,

  // Can modify data but not critical settings
  EDITOR = 2,

  // Standard admin - most permissions
  ADMIN = 3,

  // Full system access
  SUPERADMIN = 4,
}

// Permission mapping to roles
export const rolePermissions: Record<string, PermissionLevel> = {
  USER: PermissionLevel.USER,
  VIEWER: PermissionLevel.VIEWER,
  EDITOR: PermissionLevel.EDITOR,
  ADMIN: PermissionLevel.ADMIN,
  SUPERADMIN: PermissionLevel.SUPERADMIN,
};

// Special admin emails that should always have SUPERADMIN access
export const superadminEmails = ["pgtipping1@gmail.com"];

/**
 * Check if a user has the required permission level
 */
export function hasPermission(
  userRole: string | null | undefined,
  userEmail: string | null | undefined,
  requiredLevel: PermissionLevel = PermissionLevel.ADMIN
): boolean {
  // SuperAdmin check by email (overrides role check)
  if (userEmail && superadminEmails.includes(userEmail)) {
    return true;
  }

  // No role - no access
  if (!userRole) {
    return false;
  }

  // Check if the user's role has sufficient permission level
  const userPermissionLevel = rolePermissions[userRole] || PermissionLevel.USER;
  return userPermissionLevel >= requiredLevel;
}

/**
 * A more granular permission system for specific actions
 */
export interface ActionPermission {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

/**
 * Get permissions for a specific resource based on user role
 */
export function getResourcePermissions(
  userRole: string | null | undefined,
  userEmail: string | null | undefined,
  resource:
    | "users"
    | "emailLogs"
    | "contactSubmissions"
    | "blog"
    | "newsletter"
    | "analytics"
): ActionPermission {
  // Default - no permissions
  const defaultPermissions: ActionPermission = {
    view: false,
    create: false,
    update: false,
    delete: false,
  };

  // SuperAdmin has all permissions
  if (userEmail && superadminEmails.includes(userEmail)) {
    return {
      view: true,
      create: true,
      update: true,
      delete: true,
    };
  }

  // No role - no permissions
  if (!userRole) {
    return defaultPermissions;
  }

  const permissionLevel = rolePermissions[userRole] || PermissionLevel.USER;

  // Resource-specific permission logic
  switch (resource) {
    case "users":
      return {
        view: permissionLevel >= PermissionLevel.ADMIN,
        create: permissionLevel >= PermissionLevel.ADMIN,
        update: permissionLevel >= PermissionLevel.ADMIN,
        delete: permissionLevel >= PermissionLevel.SUPERADMIN,
      };

    case "emailLogs":
      return {
        view: permissionLevel >= PermissionLevel.VIEWER,
        create: false, // Logs can't be created manually
        update: false, // Logs shouldn't be updated
        delete: permissionLevel >= PermissionLevel.ADMIN,
      };

    case "contactSubmissions":
      return {
        view: permissionLevel >= PermissionLevel.VIEWER,
        create: false, // Submissions come from users
        update: permissionLevel >= PermissionLevel.EDITOR,
        delete: permissionLevel >= PermissionLevel.ADMIN,
      };

    case "blog":
      return {
        view: permissionLevel >= PermissionLevel.VIEWER,
        create: permissionLevel >= PermissionLevel.EDITOR,
        update: permissionLevel >= PermissionLevel.EDITOR,
        delete: permissionLevel >= PermissionLevel.ADMIN,
      };

    case "newsletter":
      return {
        view: permissionLevel >= PermissionLevel.VIEWER,
        create: permissionLevel >= PermissionLevel.EDITOR,
        update: permissionLevel >= PermissionLevel.EDITOR,
        delete: permissionLevel >= PermissionLevel.ADMIN,
      };

    case "analytics":
      return {
        view: permissionLevel >= PermissionLevel.VIEWER,
        create: false, // Analytics can't be created
        update: false, // Analytics can't be updated
        delete: false, // Analytics can't be deleted
      };

    default:
      return defaultPermissions;
  }
}
