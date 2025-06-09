import { afterWebflowReady, getGsap, getHtmlElement } from "@taj-wf/utils";

const SELECTORS = {
  navLogo: "[data-nav-logo]",
  heroLogo: "[data-hero-logo]",
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

  if (!navLogo || !heroLogo) return;

  const navFlipId = navLogo.getAttribute(ATTRIBUTES.flipId)?.trim();
  const heroFlipId = heroLogo.getAttribute(ATTRIBUTES.flipId)?.trim();

  if (!navFlipId || !heroFlipId || navFlipId !== heroFlipId) {
    console.error(
      `Nav and hero logos must have the same flip ID with ${ATTRIBUTES.flipId} for morphing to work.`,
      "\n",
      "\n",
      "Hero Logo:",
      heroLogo,
      "\n",
      "Nav Logo:",
      navLogo
    );
    return;
  }

  gsap.registerPlugin(Flip);

  let currentState: "hero" | "nav" = "hero";

  const tempTrigger = document.querySelector(".hero-right");

  const morphHeroLogoToNavLogo = () => {
    const flipState = Flip.getState([navLogo, heroLogo]);

    heroLogo.style.display = "none";
    navLogo.style.removeProperty("display");

    Flip.from(flipState, {
      duration: 1,
      ease: "power3.inOut",
      absolute: true,
    });

    currentState = "nav";
  };

  const morphNavLogoToHeroLogo = () => {
    const flipState = Flip.getState([navLogo, heroLogo]);

    navLogo.style.display = "none";
    heroLogo.style.removeProperty("display");

    Flip.from(flipState, {
      duration: 1.5,
      ease: "power3.inOut",
      absolute: true,
    });

    currentState = "hero";
  };

  tempTrigger?.addEventListener("click", () => {
    if (currentState === "hero") {
      morphHeroLogoToNavLogo();
      return;
    }
    morphNavLogoToHeroLogo();
  });

  navLogo.setAttribute(ATTRIBUTES.initialized, "true");
  heroLogo.setAttribute(ATTRIBUTES.initialized, "true");

  morphNavLogoToHeroLogo();
};

afterWebflowReady(() => {
  initLogoMorphAnimation();
});
