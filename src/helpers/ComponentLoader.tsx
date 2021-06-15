import {ComponentType} from "react";

export default function componentLoader(
  lazyComponent: () => Promise<{default: ComponentType<any>}>,
  attemptsLeft: number = 3
): Promise<{default: ComponentType<any>}> {
  return new Promise((resolve, reject) => {
    lazyComponent()
      .then(resolve)
      .catch(() => {
        if (attemptsLeft === 0) {
          window.location.reload();
          return;
        }

        // let us retry after 1500 ms
        setTimeout(() => {
          componentLoader(lazyComponent, attemptsLeft - 1).then(resolve, reject);
        }, 1500);
      });
  });
}
