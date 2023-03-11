import React, { useContext, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import mergeRef from "@react-hook/merged-ref";
import { v4 as uuid } from 'uuid';
import { MenuOrigin, MenuElementProps } from "src/typings";
import useChildren from "src/hooks/useChildren";
import { MenuContext } from "./MenuContext";
import { Direction } from "src/utils/findClosestRectIndex";

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement>, MenuElementProps {
  origin?: MenuOrigin;
  selectable: React.ForwardRefExoticComponent<MenuElementProps>[];
  defaultIndex?: number;
  infiniteNavigation?: boolean;
  transform?: string;

  displayed?: boolean;
  resetIndex?: boolean;

  onExitDirection?: (direction: Direction) => void;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      children,
      origin = "top-left",
      selectable,
      defaultIndex,
      infiniteNavigation,
      displayed = true,
      resetIndex,
      selected,
      selectionFrom,
      onExitDirection,
      ...props
    },
    extRef
  ) => {
    const menuUUID = useMemo(() => uuid(), []);
    const context = useContext(MenuContext);

    const ref = useRef<HTMLDivElement>(null);
    const mergedRefs = mergeRef(extRef, ref);

    useEffect(() => {
      if (!context) throw new Error('You should put your <Menu> in a <MenuContextProvider>');

      if (displayed) {
        if (selected === false) return;

        context.setStack((old) => [...old, menuUUID])
      } else {
        context.setStack((old) => old.filter((id) => id !== menuUUID))
      }
    }, [displayed, selected, menuUUID]);

    const clonedChildren = useChildren(children, menuUUID, {
      selectable,
      defaultIndex,
      infiniteNavigation,
      displayed,
      resetIndex,
      selected,
      selectionFrom,
      onExitDirection,
    });

    return (
      <Container ref={mergedRefs} origin={origin} {...props}>
        {clonedChildren}
      </Container>
    );
  }
);

interface ContainerProps {
  origin: MenuOrigin;
  transform?: string;
}

const ORIGIN_DICT: { [originName: string]: 0 | 50 | 100 } = {
  left: 0,
  right: 100,
  top: 0,
  bottom: 100,
  center: 50,
} as const;

const Container = styled.div<ContainerProps>`
  transform: translate(
      ${({ origin }) =>
        origin
          .split("-")
          .reverse()
          .map((side: string) => `-${ORIGIN_DICT[side]}%`)
          .join(",")}
    )
    ${({ transform }) => transform || ""};
`;

export default Menu;
