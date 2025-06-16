/* @ts-expect-error barba js no types*/
import barba from "@barba/core";
import { wait } from "@finsweet/ts-utils";
import { afterWebflowReady, getHtmlElement } from "@taj-wf/utils";
import { preventBodyScroll } from "@zag-js/remove-scroll";

import { isAnchorLoadFromSameWebsite } from "./utils/load-type-getters";

console.log("page transition script called at", Date.now);

// Extend the Window interface to include BarbaInstance
declare global {
  interface Window {
    BarbaInstance?: typeof barba;
  }
}

// Attach barba instance to window object
window.BarbaInstance = barba;

const stopScroller = () => {
  // @ts-expect-error smooth scroller type is not defined
  const smoothScroller = (document.body as HTMLBodyElement)?.smoothScroller;
  let enableZagScroll: (() => void) | undefined = undefined;
  if (smoothScroller) {
    smoothScroller.disableScrolling();
    return () => {
      smoothScroller.enableScrolling();
    };
  }
  enableZagScroll = preventBodyScroll();
  return () => {
    enableZagScroll?.();
  };
};

const initPageAnimationTriggers = () => {
  const pageInitialLoadTrigger = getHtmlElement({
    selector: ".page-transition_initial-load-trigger",
  });
  const pageExitTrigger = getHtmlElement({
    selector: ".page-transition_exit-trigger",
  });
  const pageChangeTrigger = getHtmlElement({
    selector: ".page-transition_page-change-trigger",
  });
  if (!pageInitialLoadTrigger || !pageExitTrigger || !pageChangeTrigger) return;

  barba.init({
    transitions: [
      {
        name: "page-transition",
        leave() {
          pageExitTrigger.click();
          return wait(1 * 1000);
        },
        // @ts-expect-error barba js no types
        afterLeave({ next }) {
          window.location.href = next.url.href;
        },
        once() {
          const enableScroller = stopScroller();
          if (isAnchorLoadFromSameWebsite()) {
            pageChangeTrigger.click();
            return wait(1 * 1000).then(() => {
              enableScroller();
            });
          }
          pageInitialLoadTrigger.click();
          return wait(5 * 1000).then(() => {
            enableScroller();
          });
        },
      },
    ],
  });
};

afterWebflowReady(() => {
  initPageAnimationTriggers();
});
