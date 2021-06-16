import {Ref, useRef} from "react";

export const useScroll = <T extends HTMLElement>(): [() => void, Ref<T>] => {
  const htmlElRef = useRef<T>(null);

  const executeScroll = (): void => {
    if (htmlElRef.current) {
      htmlElRef.current.scrollIntoView({behavior: "smooth", block: "start"});
    }
  };

  return [executeScroll, htmlElRef];
};
