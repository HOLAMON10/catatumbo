export interface MeetingRoomReservationModelInterface {
  _id?: string;
  meetingRoom: any;
  reservationDate: string;
  reservationStartingHour: string;
  reservationEndingHour: string;
  stakeHolder?: any;
  description: string;
  status?: any;
  createdBy?: any;
  creationTimestamp: number;
  lastModificationBy?: any;
  lastModificationTimestamp?: number;
}