import { afterWebflowReady, getGsap, getHtmlElement } from "@taj-wf/utils";

const SELECTORS = {
  navLogo: "[data-nav-logo]",
  heroLogo: "[data-hero-logo]",
  heroLogoParent: "[data-hero-logo-parent]",
} as const;

const ATTRIBUTES = {
  initialized: "data-initialized",
  flipId: "data-flip-id",
} as const;

const initLogoMorphAnimation = () => {
  const [gsap, Flip] = getGsap(["Flip"], "error");

  if (!gsap) {
    console.error("GSAP is not available. Please ensure GSAP is loaded before this script.");
    return;
  }

  if (!Flip) {
    console.error(
      "GSAP Flip plugin is not available. Please ensure it is loaded before this script."
    );
    return;
  }

  const navLogo = getHtmlElement({ selector: SELECTORS.navLogo, log: "error" });
  const heroLogo = getHtmlElement({ selector: SELECTORS.heroLogo, log: "error" });
  const heroLogoParent = getHtmlElement({
    selector: SELECTORS.heroLogoParent,
    log: "error",
  });

  if (!navLogo || !heroLogo || !heroLogoParent) return;

  navLogo.setAttribute(ATTRIBUTES.flipId, "logo-morph");
  heroLogo.setAttribute(ATTRIBUTES.flipId, "logo-morph");

  gsap.registerPlugin(Flip);

  const morphHeroLogoToNavLogo = () => {
    const flipState = Flip.getState([navLogo, heroLogo]);

    heroLogo.classList.add("is-hidden");
    navLogo.classList.remove("is-hidden");

    Flip.from(flipState, {
      duration: 1,
      ease: "power3.inOut",
      absolute: true,
    });
  };

  const morphNavLogoToHeroLogo = () => {
    const flipState = Flip.getState([navLogo, heroLogo]);

    navLogo.classList.add("is-hidden");
    heroLogo.classList.remove("is-hidden");

    Flip.from(flipState, {
      duration: 1.5,
      ease: "power3.inOut",
      absolute: true,
    });
  };

  navLogo.setAttribute(ATTRIBUTES.initialized, "true");
  heroLogo.setAttribute(ATTRIBUTES.initialized, "true");

  const interSectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          morphNavLogoToHeroLogo();
          return;
        }
        morphHeroLogoToNavLogo();
      }
    },
    { threshold: 1 }
  );
  interSectionObserver.observe(heroLogoParent);
};

afterWebflowReady(() => {
  initLogoMorphAnimation();
});
