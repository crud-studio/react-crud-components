import React, {FunctionComponent, PropsWithChildren, useEffect, useState} from "react";
import {Button, ButtonProps, CircularProgress} from "@material-ui/core";
import {Check, Error} from "@material-ui/icons";

interface IProps extends ButtonProps, PropsWithChildren<any> {
  loading?: boolean;
  result?: any;
  error?: any;
  disabled?: boolean;
  className?: string;
}

const StatusButton: FunctionComponent<IProps> = ({
  loading = false,
  result = null,
  error = null,
  disabled = false,
  className = "",
  children,
  ...rest
}) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [fail, setFail] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (loading) {
      setSuccess(false);
      setFail(false);
      setSubmitted(true);
    }
  }, [loading]);

  useEffect(() => {
    if (!success) {
      setSubmitted(false);
    }
  }, [success]);

  useEffect(() => {
    if (!fail) {
      setSubmitted(false);
    }
  }, [fail]);

  useEffect(() => {
    if (submitted && result) {
      setSuccess(true);

      let timeout = setTimeout(() => setSuccess(false), 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [result]);

  useEffect(() => {
    if (submitted && error) {
      setFail(true);

      let timeout = setTimeout(() => setFail(false), 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [error]);

  return (
    <Button {...rest} disabled={loading || success || fail || disabled} className={className}>
      {success && !loading && <Check />}

      {fail && !loading && !success && <Error />}

      {loading && <CircularProgress size={24} color="secondary" />}

      {!loading && !success && !fail && children}
    </Button>
  );
};
export default StatusButton;
