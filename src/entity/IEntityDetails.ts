import IContact from 'src/contacts/IContact';
import IUser from 'src/users/IUser';

export default interface IEntityDetails {
    type: number;
    id: string;
    alias: string;
    contacts: IContact[];
    sharedWith: IUser[];
    timeStamp: Date | undefined;
}
