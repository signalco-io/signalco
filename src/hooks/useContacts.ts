import { useEffect, useState } from 'react';
import IContact from 'src/contacts/IContact';
import IContactPointer from 'src/contacts/IContactPointer';
import { contactAsync } from 'src/entity/EntityRepository';

export default function useContacts(pointers: IContactPointer[] | undefined) {
    const [contacts, setContacts] = useState<(IContact | undefined)[] | undefined>(undefined);
    useEffect(() => {
        (async () => {
            if (pointers) {
                const newContacts = [];
                for (let i = 0; i < pointers.length; i++) {
                    const pointer = pointers[i];
                    const contact = await contactAsync(pointer);
                    newContacts.push(contact);
                }
                setContacts(newContacts);
            }
        })();
    }, [pointers]);
    return contacts;
}
