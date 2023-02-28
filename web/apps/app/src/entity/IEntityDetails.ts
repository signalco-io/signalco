import IUser from '../users/IUser';
import IContact from '../contacts/IContact';

export default interface IEntityDetails {
    type: number;
    id: string;
    alias: string;
    contacts: IContact[];
    sharedWith: IUser[];
    timeStamp: Date | undefined;
}
