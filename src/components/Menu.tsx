import React, { useContext, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import mergeRef from "@react-hook/merged-ref";
import { v4 as uuid } from 'uuid';
import { MenuOrigin, MenuElementProps } from "src/typings";
import useChildren from "src/hooks/useChildren";
import { MenuContext } from "./MenuContext";

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement>, MenuElementProps {
  origin?: MenuOrigin;
  selectable: React.ForwardRefExoticComponent<MenuElementProps>[];
  defaultIndex?: number;
  infiniteNavigation?: boolean;
  transform?: string;

  name?: string;

  displayed?: boolean;
  resetIndex?: boolean;

  onEscape?: () => void;
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
      parentUUID,
      onEscape,
      parentStacked,

      name,

      ...props
    },
    extRef
  ) => {
    const menuUUID = useMemo(() => name || uuid(), [name]);
    const context = useContext(MenuContext);

    const ref = useRef<HTMLDivElement>(null);
    const mergedRefs = mergeRef(extRef, ref);
  
    useEffect(() => {
      if (!context) throw new Error('You should put your <Menu> in a <MenuContextProvider>');

      if (displayed && parentStacked !== false) {
        if (selected === false) return;

        context.setStack((old) => {
          if (parentUUID && !old.includes(parentUUID)) {
            return old;
          }
          return [...old, menuUUID];
        })
      } else {
        context.setStack((old) => old.filter((id) => id !== menuUUID))
      }

      return () => {
        context.setStack((old) => old.filter((id) => id !== menuUUID));
      }
    }, [displayed, selected, menuUUID, parentStacked]);

    // useEffect(() => {
    //   console.log('stack', context?.stack.join('/'))
    // }, [context])

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

    useEffect(() => {
      if (!onEscape) return;

      const onKeyup = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
          onEscape();
        }
      }

      window.addEventListener('keyup', onKeyup);
      return () => window.removeEventListener('keyup', onKeyup);
    }, [onEscape]);

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
