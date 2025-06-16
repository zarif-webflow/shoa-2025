/* @ts-expect-error barba js no types*/
import barba from "@barba/core";
import { wait } from "@finsweet/ts-utils";
import { afterWebflowReady, getHtmlElement } from "@taj-wf/utils";
import { preventBodyScroll } from "@zag-js/remove-scroll";

import { isAnchorLoadFromSameWebsite } from "./utils/load-type-getters";

// Extend the Window interface to include BarbaInstance
declare global {
  interface Window {
    BarbaInstance?: typeof barba;
  }
}

const getActiveScript = () => {
  const currentModuleUrl = import.meta.url;
  return getHtmlElement<HTMLScriptElement>({
    selector: `script[src="${currentModuleUrl}"]`,
  });
};

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
  const scriptElement = getActiveScript();

  if (!scriptElement) return;

  const { initialDuration, changeDuration, exitDuration } = scriptElement.dataset;

  const initialDurationValue = Number.parseInt(initialDuration || "");
  const changeDurationValue = Number.parseInt(changeDuration || "");
  const exitDurationValue = Number.parseInt(exitDuration || "");

  if (Number.isNaN(initialDurationValue)) {
    console.error(
      "data-initial-duration is not provided or invalid in the script tag. Please add a value in ms."
    );
    return;
  }

  if (Number.isNaN(changeDurationValue)) {
    console.error(
      "data-change-duration is not provided or invalid in the script tag. Please add a value in ms."
    );
    return;
  }

  if (Number.isNaN(exitDurationValue)) {
    console.error(
      "data-exit-duration is not provided or invalid in the script tag. Please add a value in ms."
    );
    return;
  }

  const pageInitialLoadTrigger = getHtmlElement({
    selector: ".page-transition_initial-load-trigger",
  });
  const pageExitTrigger = getHtmlElement({
    selector: ".page-transition_exit-trigger",
  });
  const pageChangeTrigger = getHtmlElement({
    selector: ".page-transition_page-change-trigger",
  });
  const pageWrapper = getHtmlElement({
    selector: ".page-wrapper",
  });

  if (!pageInitialLoadTrigger || !pageExitTrigger || !pageChangeTrigger || !pageWrapper) return;

  document.body.setAttribute("data-barba", "wrapper");
  pageWrapper.setAttribute("data-barba", "container");

  barba.init({
    transitions: [
      {
        name: "page-transition",
        leave() {
          pageExitTrigger.click();
          return wait(exitDurationValue);
        },
        // @ts-expect-error barba js no types
        afterLeave({ next }) {
          window.location.href = next.url.href;
        },
        once() {
          const enableScroller = stopScroller();
          if (isAnchorLoadFromSameWebsite()) {
            pageChangeTrigger.click();
            return wait(changeDurationValue).then(() => {
              enableScroller();
            });
          }
          pageInitialLoadTrigger.click();
          return wait(initialDurationValue).then(() => {
            enableScroller();
          });
        },
      },
    ],
  });
};

window.BarbaInstance = barba;

afterWebflowReady(() => {
  initPageAnimationTriggers();
});
