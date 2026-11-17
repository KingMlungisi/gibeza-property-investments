declare module "page-flip/dist/js/page-flip.module.js" {
  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: HTMLElement[]): void;
    on(event: string, callback: (event: { data: number | string }) => void): this;
    destroy(): void;
    update(): void;
    flipNext(corner?: string): void;
    flipPrev(corner?: string): void;
    flip(page: number, corner?: string): void;
    getCurrentPageIndex(): number;
    getOrientation(): string;
  }
}
