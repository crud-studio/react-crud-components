import React, {useState} from "react";
import Confetti from "react-confetti";
import {useUpdateEffect, useWindowSize} from "react-use";
import {useDebounceFn} from "@crud-studio/react-crud-core";

interface IProps {
  startConfetti: any;
}

export default ({startConfetti}: IProps) => {
  const {width, height} = useWindowSize();
  const duration = 10000;

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const setShowConfettiDebounced = useDebounceFn(setShowConfetti, duration);

  useUpdateEffect(() => {
    if (!startConfetti) {
      return;
    }

    if (showConfetti) {
      return;
    }

    setShowConfetti(true);
    setShowConfettiDebounced(false);
  }, [startConfetti]);

  return (
    <>
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={1000} tweenDuration={duration} />
      )}
    </>
  );
};
