import {EMAIL_REGEX} from "../constants/regex";

const UrlActionUtils = {
  sendEmail: function (to: string): void {
    if (!EMAIL_REGEX.test(to)) {
      return;
    }
    window.open(`mailto:${to}`);
  },
};
export default UrlActionUtils;
