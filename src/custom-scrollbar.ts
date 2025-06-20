import "overlayscrollbars/overlayscrollbars.css";

import { afterWebflowReady, getMultipleHtmlElements } from "@taj-wf/utils";
import {
  ClickScrollPlugin,
  OverlayScrollbars,
  ScrollbarsHidingPlugin,
  SizeObserverPlugin,
} from "overlayscrollbars";

const initCustomScrollbar = () => {
  const scrollTargetElements = getMultipleHtmlElements({ selector: "[data-custom-scrollbar]" });

  if (!scrollTargetElements) return;

  OverlayScrollbars.plugin([ClickScrollPlugin, SizeObserverPlugin, ScrollbarsHidingPlugin]);

  for (const element of scrollTargetElements) {
    OverlayScrollbars(element, {});
  }
};

afterWebflowReady(() => {
  initCustomScrollbar();
});
