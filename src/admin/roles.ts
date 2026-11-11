export const ROLES = ['owner', 'manager', 'host'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = { owner: 'Owner', manager: 'Manager', host: 'Host' };
export const ROLE_SUMMARY: Record<Role, string> = {
  owner: 'Everything, including adding and removing staff.',
  manager: 'Edit website content, handle and delete booking requests.',
  host: 'See booking requests and mark them handled.',
};

export type Permission = 'content' | 'bookings' | 'deleteBookings' | 'staff';

const GRANTS: Record<Role, readonly Permission[]> = {
  owner: ['content', 'bookings', 'deleteBookings', 'staff'],
  manager: ['content', 'bookings', 'deleteBookings'],
  host: ['bookings'],
};

/**
 * Decides what the admin screens show. firestore.rules enforces the same
 * table on the server; tests/rules keeps the two in step.
 */
export const can = (role: Role | null | undefined, permission: Permission) =>
  !!role && GRANTS[role].includes(permission);

export const isRole = (value: unknown): value is Role => (ROLES as readonly unknown[]).includes(value);

export interface StaffMember { email: string; name: string; role: Role; active: boolean }

export function validateStaff(input: { email: string; name: string; role: string }): { value: StaffMember; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (email.length > 120 || !/^[^\s@/]+@[^\s@/]+\.[^\s@/]{2,}$/.test(email)) errors.email = 'Enter a valid email address.';
  if (!name) errors.name = 'Enter a name.';
  else if (name.length > 80) errors.name = 'Name is too long (80 characters at most).';
  if (!isRole(input.role)) errors.role = 'Choose a role.';
  return { value: { email, name, role: isRole(input.role) ? input.role : 'host', active: true }, errors };
}
