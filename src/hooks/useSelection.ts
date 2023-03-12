import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MenuChildRef } from "./useChildren";
import findClosestRectIndex, { Direction } from "src/utils/findClosestRectIndex";
import { MenuContext } from "src/components/MenuContext";
import { MenuElementProps } from "src/typings";

interface UseSelectionConfig {
  defaultIndex?: number;
  infiniteNavigation?: boolean;

  displayed?: boolean;
  resetIndex?: boolean;

  selected?: boolean;
  selectionFrom?: Direction;

  onExitDirection?: (direction: Direction) => boolean | undefined;
}

function useSelection(
  refs: React.RefObject<{ index: number; ref: MenuChildRef }[]>,
  menuUUID: string,
  { defaultIndex, infiniteNavigation, displayed, resetIndex, selected, selectionFrom, onExitDirection }: UseSelectionConfig
) {
  const isSubMenu = useMemo(() => selected !== undefined, [selected]);

  const indexRef = useRef(defaultIndex === undefined ? -1 : defaultIndex);
  const [selection, setSelection] = useState<{ index: number, direction?: Direction, onExitChildDirection?: MenuElementProps['onExitDirection'] }>({ index: indexRef.current });

  const context = useContext(MenuContext);

  useEffect(() => {
    if (resetIndex) {
      indexRef.current = defaultIndex === undefined ? -1 : defaultIndex;
      setSelection({ index: indexRef.current });
    }
  }, [displayed, resetIndex, defaultIndex]);

  useEffect(() => {
    if (!refs.current) return;

    if (!context) throw new Error('useSelection called out of MenuContextProvider');

    const findAndSetNext = (direction: Direction): boolean => {
      if (!refs.current) return false;

      const rects: { index: number; rect: DOMRect }[] = refs.current
        .filter((child) => !!child.ref.current)
        .map((child) => {
          return {
            index: child.index,
            // @ts-ignore
            rect: child.ref.current.getBoundingClientRect(),
          };
        });

      const found = findClosestRectIndex(
        rects,
        indexRef.current,
        direction,
        infiniteNavigation,
        selectionFrom,
      );

      if (found === undefined && !isSubMenu) {
        onExitDirection?.(direction);

        return false;
      }

      if (found === undefined && isSubMenu) {
        if (!onExitDirection || onExitDirection?.(direction)) {
          indexRef.current = defaultIndex === undefined ? -1 : defaultIndex;
          setSelection({ index: indexRef.current });

          context.setStack((old) => old.filter((id) => id !== menuUUID));
        }
        return false;
      }

      indexRef.current = found !== undefined ? found : indexRef.current;

      setSelection({ index: indexRef.current, direction });

      return true;
    }

    const onKey = (e: KeyboardEvent) => {
      if (!e.key.startsWith("Arrow") && e.key !== "Enter") return;
      if (!refs.current) return;

      e.preventDefault();

      if (e.key === "Enter") {
        const target = refs.current.find(
          (node) => node.index === indexRef.current
        );

        if (!target || !target.ref.current) return;

        target.ref.current.click();

        return;
      }

      const direction = e.key.replace("Arrow", "").toLowerCase() as Direction;

      findAndSetNext(direction);
    };

    if (context.stack[context.stack.length - 1] !== menuUUID) {
      if (context.stack.length < 2 || context.stack[context.stack.length - 2] !== menuUUID) return;

      setSelection((old) => ({ ...old, onExitChildDirection: findAndSetNext }))

      return;
    }

    if (isSubMenu && selectionFrom && onExitDirection) {
      findAndSetNext(selectionFrom);
    }

    window.addEventListener("keyup", onKey);

    return () => {
      window.removeEventListener("keyup", onKey);
    };
  }, [refs, infiniteNavigation, menuUUID, context, isSubMenu, selectionFrom, onExitDirection]);

  return selection;
}

export default useSelection;
