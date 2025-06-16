/* @ts-expect-error barba js no types*/
import barba from "@barba/core";
import { afterWebflowReady, getGsap, getHtmlElement, getMultipleHtmlElements } from "@taj-wf/utils";

import { isAnchorLoadFromSameWebsite } from "./utils/load-type-getters";

// Extend the Window interface to include BarbaInstance
declare global {
  interface Window {
    BarbaInstance?: typeof barba;
  }
}

const stopScroller = () => {
  // @ts-expect-error smooth scroller type is not defined
  const smoothScroller = (document.body as HTMLBodyElement)?.smoothScroller;

  if (!smoothScroller) throw new Error("Smooth scroller script is not loaded.");

  smoothScroller.disableScrolling();
  return () => {
    smoothScroller.enableScrolling();
  };
};

const getLottie = () => {
  // @ts-expect-error lottie type is not defined
  const lottie = window.Webflow?.require?.("lottie")?.lottie;
  const lottieEl = getHtmlElement({ selector: ".transition-lottie", log: "error" });

  if (!lottie || !lottieEl) {
    throw new Error("Lottie is not loaded in webflow.");
  }

  const lottieDuration = Number.parseFloat(lottieEl?.getAttribute("data-default-duration") || "");

  if (Number.isNaN(lottieDuration)) {
    throw new Error("Lottie duration is not provided or invalid in the lottie element.");
  }

  // @ts-expect-error lottie type is not defined
  const lottieAnimation = lottie.getRegisteredAnimations().find((x) => x.wrapper === lottieEl);

  lottieAnimation.name = "logo-reveal-lottie";

  return { play: () => lottie.play(lottieAnimation.name), duration: lottieDuration, lottieEl };
};

const initPageAnimationTriggers = () => {
  const lottieObject = getLottie();

  const [gsap] = getGsap();

  if (!gsap) return;

  const pageWrapper = getHtmlElement({
    selector: ".page-wrapper",
    log: "error",
  });

  const transitionBgEls = getMultipleHtmlElements({
    selector: ".page-transition_bg",
    log: "error",
  });

  if (!pageWrapper || !transitionBgEls) return;

  document.body.setAttribute("data-barba", "wrapper");
  pageWrapper.setAttribute("data-barba", "container");

  const exitAnimation = () => {
    return gsap
      .fromTo(
        transitionBgEls,
        { yPercent: -102 },
        {
          yPercent: 0,
          duration: 0.4,
          ease: "power3.out",
          stagger: {
            each: 0.4,
            from: "end",
          },
        }
      )
      .then();
  };

  const changeAnimation = () => {
    const enableScroller = stopScroller();
    gsap.set(lottieObject.lottieEl, { opacity: 0 });
    return gsap.fromTo(
      transitionBgEls,
      { yPercent: 0 },
      {
        yPercent: -102,
        duration: 0.4,
        ease: "power3.out",
        stagger: 0.4,
        onComplete: () => {
          enableScroller();
        },
      }
    );
  };

  const initialAnimation = () => {
    const enableScroller = stopScroller();
    lottieObject.play();
    return gsap.fromTo(
      transitionBgEls,
      { yPercent: 0 },
      {
        yPercent: -102,
        duration: 0.4,
        ease: "power3.out",
        stagger: 0.4,
        delay: lottieObject.duration + 0.1,
        onComplete: () => {
          enableScroller();
        },
      }
    );
  };

  barba.init({
    transitions: [
      {
        name: "page-transition",
        leave() {
          return exitAnimation();
        },
        // @ts-expect-error barba js no types
        afterLeave({ next }) {
          window.location.href = next.url.href;
        },
        once() {
          if (isAnchorLoadFromSameWebsite()) {
            return changeAnimation();
          }
          return initialAnimation();
        },
      },
    ],
  });
};

window.BarbaInstance = barba;

afterWebflowReady(() => {
  initPageAnimationTriggers();
});
