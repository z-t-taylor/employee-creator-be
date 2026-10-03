export interface Contract {
  employeeId: string;
  contractId: string;
  type: "PERMANENT" | "FIXED_TERM" | "CONTRACTOR";
  status: "ACTIVE" | "EXPIRED" | "TERMINATED" | "PENDING";
  startDate: string;
  endDate: string | null;
  salary: number;
  hoursPerWeek: number;
  createdAt: string;
  updatedAt: string;
}
