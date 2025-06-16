let transitionTrigger = $(".page-transition_initial-load-trigger");
let introDurationMS = 4900;
let exitDurationMS = 1200;
let excludedClass = "no-transition";

// On Page Load
window.addEventListener("DOMContentLoaded", (event) => {
  if (transitionTrigger.length > 0) {
    Webflow.push(function () {
      transitionTrigger.click();
    });
    $("body").addClass("no-scroll-transition");
    setTimeout(() => {
      $("body").removeClass("no-scroll-transition");
    }, introDurationMS);
  }
});
