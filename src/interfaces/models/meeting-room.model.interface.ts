export interface MeetingRoomModelInterface {
  _id?: string;
  name: string;
  location: string;
  chairs: number;
  schedule: {
    day: number,
    startingHour: string;
    endingHour: string;
  }[];
  isActive: boolean;
  createdBy?: any;
  createdDate?: number;
  lastModificationUser?: any;
  lastModificationDate?: number;
}
