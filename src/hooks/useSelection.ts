import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MenuChildRef } from "./useChildren";
import findClosestRectIndex, { Direction } from "src/utils/findClosestRectIndex";
import { MenuContext } from "src/components/MenuContext";

interface UseSelectionConfig {
  defaultIndex?: number;
  infiniteNavigation?: boolean;

  displayed?: boolean;
  resetIndex?: boolean;

  selected?: boolean;
  selectionFrom?: Direction;

  onExitDirection?: (direction: Direction) => void;
}

function useSelection(
  refs: React.RefObject<{ index: number; ref: MenuChildRef }[]>,
  menuUUID: string,
  { defaultIndex, infiniteNavigation, displayed, resetIndex, selected, selectionFrom, onExitDirection }: UseSelectionConfig
) {
  const isSubMenu = useMemo(() => selected !== undefined, [selected]);

  const indexRef = useRef(defaultIndex === undefined ? -1 : defaultIndex);
  const [selection, setSelection] = useState<{ index: number, direction?: Direction }>({ index: indexRef.current });


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

    if (context.stack[context.stack.length - 1] !== menuUUID) return;

    const findAndSetNext = (direction: Direction) => {
      if (!refs.current) return;

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

      if (found === undefined && isSubMenu) {
        indexRef.current = defaultIndex === undefined ? -1 : defaultIndex;
        setSelection({ index: indexRef.current });

        context.setStack((old) => old.filter((id) => id !== menuUUID));

        const capitalizeFirstLetter = (string: string): string => {
          return string.charAt(0).toUpperCase() + string.slice(1);
        }

        setTimeout(() => {
          window.dispatchEvent(new KeyboardEvent('keyup',{'key':`Arrow${capitalizeFirstLetter(direction)}`}))
        }, 0);

        return;
      }

      indexRef.current = found !== undefined ? found : indexRef.current;

      setSelection({ index: indexRef.current, direction });

      if (found === undefined) {
        onExitDirection?.(direction);
      }
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

    if (isSubMenu && selectionFrom) {
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
