declare module 'masonry-layout' {
  interface MasonryOptions {
    itemSelector?: string;
    columnWidth?: string | number;
    horizontalOrder?: boolean;
    transitionDuration?: string;
    stagger?: string | number;
    gutter?: string | number;
    fitWidth?: boolean;
    originLeft?: boolean;
    originTop?: boolean;
    containerStyle?: object;
    resize?: boolean;
    initLayout?: boolean;
  }

  class Masonry {
    constructor(element: Element | string, options?: MasonryOptions);

    // Layout methods
    layout(): void;
    layoutItems(items: Element[]): void;

    // Add and remove items
    addItems(elements: Element | Element[]): void;
    appended(elements: Element | Element[]): void;
    prepended(elements: Element | Element[]): void;
    remove(elements: Element | Element[]): void;

    // Events
    on(eventName: string, listener: Function): void;
    off(eventName: string, listener: Function): void;
    once(eventName: string, listener: Function): void;

    // Utilities
    reloadItems(): void;
    destroy(): void;
    getItemElements(): Element[];

    // Properties
    element: Element;
    items: any[];
    options: MasonryOptions;
  }

  export = Masonry;
}
