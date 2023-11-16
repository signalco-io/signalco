import { createContext } from 'react';

type SidebarContextType = {
    open: boolean,
    setOpen: (open: boolean) => void
};

const sidebarContextDefault: SidebarContextType = {
    open: true,
    setOpen: () => {}
};

export const SidebarContext = createContext<SidebarContextType>(sidebarContextDefault);
