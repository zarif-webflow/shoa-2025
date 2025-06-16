let transitionTrigger = document.querySelector(".transition-trigger");
let introDurationMS = 4900;
let exitDurationMS = 1200;
let excludedClass = "no-transition";

// Helper function to safely get body element
function getBodyElement() {
  const body = document.body;
  if (!body) {
    console.debug("Error: Body element not found");
    return null;
  }
  return body;
}

// On Page Load
window.addEventListener("DOMContentLoaded", () => {
  if (!transitionTrigger) {
    console.debug("Error: Transition trigger element (.transition-trigger) not found");
    return;
  }

  window.Webflow ||= [];
  window.Webflow.push(function () {
    transitionTrigger.click();
  });

  const body = getBodyElement();
  if (!body) return;

  body.classList.add("no-scroll-transition");
  setTimeout(() => {
    body.classList.remove("no-scroll-transition");
  }, introDurationMS);
});

// On Link Click
function attachLinkEventListeners() {
  const links = document.querySelectorAll("a");

  if (links.length === 0) {
    console.debug("Error: No anchor elements found");
    return;
  }

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");

      if (!href) {
        console.debug("Error: Link has no href attribute");
        return;
      }

      if (!transitionTrigger) {
        console.debug("Error: Transition trigger element (.transition-trigger) not found");
        return;
      }

      if (
        link.hostname === window.location.hostname &&
        href.indexOf("#") === -1 &&
        !link.classList.contains(excludedClass) &&
        link.getAttribute("target") !== "_blank"
      ) {
        e.preventDefault();

        const body = getBodyElement();
        if (!body) return;

        body.classList.add("no-scroll-transition");
        let transitionURL = href;
        transitionTrigger.click();
        setTimeout(function () {
          window.location = transitionURL;
        }, exitDurationMS);
      }
    });
  });
}

// Initialize link event listeners
attachLinkEventListeners();

// On Back Button Tap
window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

// Hide Transition on Window Width Resize
setTimeout(() => {
  window.addEventListener("resize", function () {
    setTimeout(() => {
      const transitionElements = document.querySelectorAll(".transition");
      if (transitionElements.length === 0) {
        console.debug("Error: No transition elements (.transition) found");
        return;
      }

      transitionElements.forEach((element) => {
        element.style.display = "none";
      });
    }, 50);
  });
}, introDurationMS);
