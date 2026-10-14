export const ESupportRequestStatus = {
  OPEN: 'OPEN',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export type ESupportRequestStatus =
  (typeof ESupportRequestStatus)[keyof typeof ESupportRequestStatus];

export interface SupportRequestUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export interface SupportRequestStaff {
  id: string;
  user: SupportRequestUser;
}

export interface SupportRequestMessage {
  id: string;
  requestId: string;
  senderId: string;
  sender?: SupportRequestUser;
  content: string;
  createdAt: string;
}

export interface SupportRequest {
  id: string;
  title: string;
  content: string;
  status: ESupportRequestStatus;
  requesterId: string;
  requester?: SupportRequestUser;
  assignedStaffId: string | null;
  assignedStaff?: SupportRequestStaff | null;
  createdAt: string;
  assignedAt: string | null;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  messages?: SupportRequestMessage[];
}

export interface CreateSupportRequestPayload {
  title: string;
  content: string;
}

export interface CreateSupportMessagePayload {
  content: string;
}

export interface AssignStaffPayload {
  staffId: string;
}
