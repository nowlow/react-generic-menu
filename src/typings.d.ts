import { Direction } from "./utils/findClosestRectIndex";

export type MenuOriginX = 'left' | 'center' | 'right';
export type MenuOriginY = 'top' | 'center' | 'bottom';
export type MenuOrigin = `${MenuOriginY}-${MenuOriginX}`;

export interface MenuElementProps {
    selected?: boolean;
    selectionFrom?: Direction;
    disabled?: boolean;
    displayed?: boolean;

    onExitDirection?: (direction: Direction) => boolean | undefined;
}