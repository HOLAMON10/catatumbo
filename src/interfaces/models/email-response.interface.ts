export interface EmailResponseInterface {
  sent: boolean;
  emailBodyHTML?: string;
  errorDetail?: string;
  sendingTimestamp: number
}
