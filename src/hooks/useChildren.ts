import React, {
  createRef,
  useCallback,
  useMemo,
  useRef,
} from "react";
import useSelection from "src/hooks/useSelection";
import { MenuElementProps } from "src/typings";
import { mergeRefs } from "react-merge-refs";

interface UseSelectableChildrenConfig {
  selectable: React.ForwardRefExoticComponent<MenuElementProps>[];
  defaultIndex?: number;
  infiniteNavigation?: boolean;

  displayed?: boolean;
  resetIndex?: boolean;
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
  }: UseSelectableChildrenConfig
): React.ReactNode {
  const refs = useRef<{ index: number; ref: MenuChildRef }[]>([]);
  const index = useSelection(refs, menuUUID, {
    defaultIndex,
    infiniteNavigation,
    displayed,
    resetIndex,
  });

  const isSelectable = useCallback(
    (child: React.ReactElement<MenuElementProps>) => {
      // @ts-ignore
      return !child.props.disabled && selectable.includes(child.type);
    },
    [selectable]
  );

  return useMemo(() => {
    refs.current = [];

    return React.Children.toArray(children).map((child, i) => {
      if (React.isValidElement(child)) {
        const childElement = child as React.ReactElement<MenuElementProps>;

        if (isSelectable(childElement)) {
          const ref = createRef<HTMLElement>();
          refs.current.push({ index: i, ref });

          return React.cloneElement(childElement, {
            selected: i === index,
            // @ts-ignore
            ref: mergeRefs([ref, child.ref]),
          });
        }
      }
      return child;
    });
  }, [children, index]);
}

export default useChildren;
