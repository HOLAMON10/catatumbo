import { UserModelInterface } from '../models';
import { ServiceResultInterface } from '../service-result.interface';

export interface AuthenticationServiceInterface {
  CreateRecoveryPasswordToken(email: string): Promise<ServiceResultInterface>;
  ModifyPassword(
    _id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ServiceResultInterface>;
  RegisterPassword(
    token: string,
    email: string,
    password: string,
    endingRegistration: boolean
  ): Promise<ServiceResultInterface>;
  RemoveUserCredentials(
    obj: UserModelInterface
  ): Promise<ServiceResultInterface>;
  VerifyCredentials(
    email: string,
    password: string,
    keepSessionAlive: boolean
  ): Promise<ServiceResultInterface>;
  VerifyKeepSessionAlive(userId: string): Promise<ServiceResultInterface>;
  VerifyToken(verificationToken: string): Promise<ServiceResultInterface>;
}
