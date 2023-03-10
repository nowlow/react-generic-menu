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
}

function useSelection(
  refs: React.RefObject<{ index: number; ref: MenuChildRef }[]>,
  menuUUID: string,
  { defaultIndex, infiniteNavigation, displayed, resetIndex, selected, selectionFrom }: UseSelectionConfig
) {
  const indexRef = useRef(defaultIndex === undefined ? -1 : defaultIndex);
  const [selection, setSelection] = useState<{ index: number, direction?: Direction }>({ index: indexRef.current });

  const isSubMenu = useMemo(() => selected !== undefined, [selected]);

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

      const rects: { index: number; rect: DOMRect }[] = refs.current
        .filter((child) => !!child.ref.current)
        .map((child) => {
          return {
            index: child.index,
            // @ts-ignore
            rect: child.ref.current.getBoundingClientRect(),
          };
        });

      const direction = e.key.replace("Arrow", "").toLowerCase() as Direction;
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

        context.setStack((old) => old.filter((id) => id !== menuUUID))

        return;
      }

      indexRef.current = found !== undefined ? found : indexRef.current;

      setSelection({ index: indexRef.current, direction });
    };

    window.addEventListener("keyup", onKey);

    return () => {
      window.removeEventListener("keyup", onKey);
    };
  }, [refs, infiniteNavigation, menuUUID, context, isSubMenu, selectionFrom]);

  return selection;
}

export default useSelection;
