import copy from "copy-to-clipboard";
import React from "react";

export const CopyToClipboard = {
  text: function (text: string, options?: {onSuccess?: () => void; onFailure: () => void}): void {
    if (!text) {
      options?.onFailure?.();
      return;
    }

    const copyResult = copy(text);

    if (copyResult) {
      options?.onSuccess?.();
    } else {
      options?.onFailure?.();
    }
  },
};
