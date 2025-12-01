import { Container } from 'inversify';
import 'reflect-metadata';

import { EmployeesService } from './services';
import { ApiTypes } from './apiTypes';
import {
    AccessProfilesServiceInterface,
    AddressCountiesServiceInterface,
    AddressDistrictsServiceInterface,
    AddressProvincesServiceInterface,
    EmailSenderServiceInterface,
    AuthenticationServiceInterface,
    CandidateJobApplicationsServiceInterface,
    CandidatesServiceInterface,
    CatalogsServiceInterface,
    DepartmentsServiceInterface,
    EmployeeAssistancesServiceInterface,
    EmployeeTeamsServiceInterface,
    HealthServiceInterface,
    JobPositionsServiceInterface,
    MeetingRoomReservationsServiceInterface,
    MeetingRoomsServiceInterface,
    PlatformConfigsServiceInterface,
    UsersServiceInterface,
} from './interfaces/services';
import {
    AccessProfilesService,
    AddressCountiesService,
    AddressDistrictsService,
    AddressProvincesService,

    EmailService,
    AuthenticationService,
   
    CandidateJobApplicationsService,
    CandidatesService,
    CatalogsService,

    DepartmentsService,

    EmployeeAssistancesService,
    EmployeeTeamsService,
    HealthService,

    JobPositionsService,
    MeetingRoomReservationsService,
    MeetingRoomsService,
 
    PlatformConfigsService,
    UsersService,
  
} from './services/';

let ApiContainer = new Container();

// AccessProfilesService
ApiContainer.bind<AccessProfilesServiceInterface>(ApiTypes.accessProfilesService).to(AccessProfilesService);

// AddressCountiesService
ApiContainer.bind<AddressCountiesServiceInterface>(ApiTypes.addressCountiesService).to(AddressCountiesService);

// AddressDistrictsService
ApiContainer.bind<AddressDistrictsServiceInterface>(ApiTypes.addressDistrictsService).to(AddressDistrictsService);

// AddressDistrictsService
ApiContainer.bind<AddressProvincesServiceInterface>(ApiTypes.addressProvincesService).to(AddressProvincesService);

// AgentStatusesService

ApiContainer.bind<EmailSenderServiceInterface>(ApiTypes.emailSenderService).to(EmailService);

// AuthenticationService
ApiContainer.bind<AuthenticationServiceInterface>(ApiTypes.authService).to(AuthenticationService);

// CallsInfoService

// CandidatesService
ApiContainer.bind<CandidatesServiceInterface>(ApiTypes.candidatesService).to(CandidatesService);

// CandidateJobApplicationsService
ApiContainer.bind<CandidateJobApplicationsServiceInterface>(ApiTypes.candidateJobApplicationsService).to(
    CandidateJobApplicationsService
);

// CatalogsService
ApiContainer.bind<CatalogsServiceInterface>(ApiTypes.catalogsService).to(CatalogsService);



// DepartmentsService
ApiContainer.bind<DepartmentsServiceInterface>(ApiTypes.departmentsService).to(DepartmentsService);

//EmployeeAssistancesService
ApiContainer.bind<EmployeeAssistancesServiceInterface>(ApiTypes.employeeAssistancesService).to(EmployeeAssistancesService);

// EmployeeTeamsService
ApiContainer.bind<EmployeeTeamsServiceInterface>(ApiTypes.employeeTeamsService).to(EmployeeTeamsService);

// HealthService
ApiContainer.bind<HealthServiceInterface>(ApiTypes.healthService).to(HealthService);

// EmployeesService
ApiContainer.bind<any>(ApiTypes.employeesService).to(EmployeesService);

// JobPositionsService
ApiContainer.bind<JobPositionsServiceInterface>(ApiTypes.jobPositionsService).to(JobPositionsService);

// MeetingRoomsReservations
ApiContainer.bind<MeetingRoomReservationsServiceInterface>(ApiTypes.meetingRoomReservationService).to(
    MeetingRoomReservationsService
);

// MeetingRoomsService
ApiContainer.bind<MeetingRoomsServiceInterface>(ApiTypes.meetingRoomsService).to(MeetingRoomsService);

// NoteWorkerConfigsService

// PlatformConfigsService
ApiContainer.bind<PlatformConfigsServiceInterface>(ApiTypes.platformConfigsService).to(PlatformConfigsService);

// UsersService
ApiContainer.bind<UsersServiceInterface>(ApiTypes.usersService).to(UsersService);

// VacationService

export { ApiContainer };
