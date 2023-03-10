export type MenuOriginX = 'left' | 'center' | 'right';
export type MenuOriginY = 'top' | 'center' | 'bottom';
export type MenuOrigin = `${MenuOriginY}-${MenuOriginX}`;

export interface MenuElementProps {
    selected?: boolean;
    disabled?: boolean;
}