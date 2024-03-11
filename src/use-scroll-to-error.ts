import { unrefElement, type MaybeComputedElementRef, type MaybeElement } from "@vueuse/core";

export type ScrollOptions = {
  rootElement?: MaybeComputedElementRef<MaybeElement>;
  offset?: number;
};

export function useScrollToError(options: ScrollOptions = {}) {
  const { rootElement, offset = 0 } = options;

  const scrollTo = () => {
    const element = (unrefElement(rootElement) || document).querySelector(
      '[aria-invalid="true"]'
    );
    if (!element) return;
    const topOffset =
      element.getBoundingClientRect().top -
      document.body.getBoundingClientRect().top -
      offset;

    window.scrollTo({
      behavior: "smooth",
      top: topOffset,
    });
  };

  return scrollTo;
}
