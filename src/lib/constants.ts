export const OVERDUE_YELLOW_DAYS = 3; // strictly MORE than 3 days overdue -> yellow
export const OVERDUE_RED_DAYS = 6; // strictly MORE than 6 days overdue -> red
export const RETENTION_DAYS = 30; // completed tasks kept this long

export const PRIORITIES = ["Low", "Medium", "High"] as const;
export const DEPENDENCY_TYPES = ["Self", "Other"] as const;
export const STATUSES = ["Not Started", "In Progress", "Completed"] as const;
export const CATEGORIES = ["KMX", "KM"] as const;
