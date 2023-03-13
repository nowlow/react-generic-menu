import React, {
  createRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import useSelection from "src/hooks/useSelection";
import { MenuElementProps } from "src/typings";
import { mergeRefs } from "react-merge-refs";
import { Direction, invertPoint } from "src/utils/findClosestRectIndex";
import { MenuContext } from "src/components/MenuContext";

interface UseSelectableChildrenConfig {
  selectable: React.ForwardRefExoticComponent<MenuElementProps>[];
  defaultIndex?: number;
  infiniteNavigation?: boolean;

  displayed?: boolean;
  resetIndex?: boolean;

  selected?: boolean;
  selectionFrom?: Direction;

  onExitDirection?: (direction: Direction) => boolean | undefined;
}

export type MenuChildRef = React.RefObject<HTMLElement>;

function useChildren(
  children: React.ReactNode,
  menuUUID: string,
  {
    selectable,
    defaultIndex,
    infiniteNavigation,
    displayed,
    resetIndex,
    selected,
    selectionFrom,
    onExitDirection,
  }: UseSelectableChildrenConfig
): React.ReactNode {
  const refs = useRef<{ index: number; ref: MenuChildRef }[]>([]);
  const context = useContext(MenuContext);

  const { index, direction, onExitChildDirection } = useSelection(refs, menuUUID, {
    defaultIndex,
    infiniteNavigation,
    displayed,
    resetIndex,
    selected,
    selectionFrom,
    onExitDirection,
  });

  const isSelectable = useCallback(
    (child: React.ReactElement<MenuElementProps>) => {
      // @ts-ignore
      return !child.props.disabled && selectable.includes(child.type);
    },
    [selectable]
  );

  return useMemo(() => {
    if (!context) throw new Error('useChildren called out of MenuContextProvider');

    refs.current = [];

    return React.Children.toArray(children).map((child, i) => {
      if (React.isValidElement(child)) {
        const childElement = child as React.ReactElement<MenuElementProps>;

        if (isSelectable(childElement)) {
          const ref = createRef<HTMLElement>();
          refs.current.push({ index: i, ref });

          const childSelected = selected !== false && i === index;

          return React.cloneElement(childElement, {
            displayed,
            selected: childSelected,
            selectionFrom: childSelected && direction ? invertPoint[direction] : undefined,
            onExitDirection: childSelected ? onExitChildDirection : undefined,
            parentUUID: menuUUID,
            // FIXME: if we don't add this parameter, the useEffects to stack the selected element are executed in reverse order.
            parentStacked: context.stack.includes(menuUUID),
            // @ts-ignore
            ref: mergeRefs([ref, child.ref]),
          });
        }
      }
      return child;
    });
  }, [children, displayed, index, onExitChildDirection, menuUUID, selected, context]);
}

export default useChildren;
