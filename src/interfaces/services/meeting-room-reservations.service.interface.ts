import { MeetingRoomReservationModelInterface } from '../models/meeting-room-reservation.model.interface';
import { ServiceResultInterface } from '../service-result.interface';

export interface MeetingRoomReservationsServiceInterface {
  CreateRecord(
    workingObj: MeetingRoomReservationModelInterface,
    email: string
  ): Promise<ServiceResultInterface>;
  ModifyRecord(
    workingObj: MeetingRoomReservationModelInterface
  ): Promise<ServiceResultInterface>;
  GetAll(): Promise<ServiceResultInterface>;
  GetById(reservationId: string): Promise<ServiceResultInterface>;
  Search(
    workingObject: any,
    populateAll: boolean
  ): Promise<ServiceResultInterface>;
}
