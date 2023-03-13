import React, { createContext, useState } from "react";

type valOrUpdater<T> = React.Dispatch<React.SetStateAction<T>>;
type MenuContext = { stack: string[], setStack: valOrUpdater<string[]> };

export const MenuContext = createContext<MenuContext | undefined>(undefined);

interface MenuContextProps {
    children: React.ReactNode;
}

function MenuContextProvider({ children }: MenuContextProps) {
    const [stack, setStack] = useState<string[]>([]);

    return <MenuContext.Provider value={{ stack, setStack }}>
        {children}
    </MenuContext.Provider>
}

export default MenuContextProvider;