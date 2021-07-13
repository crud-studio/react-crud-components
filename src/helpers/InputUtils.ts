import React from "react";

const InputUtils = {
  inputRemoveWhitespaces: function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const value = e.target.value;
    e.target.value = value.replace(/\s/g, "");
  },

  inputRemoveNonDigits: function (e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    e.target.value = value.replace(/[^0-9]/gi, "");
  },
};

export default InputUtils;
