'use client';
import { useState, useEffect } from 'react';

export const AssessmentQuestion = () => {
  const [timer, setTimer] = useState(0);
  const [start, setStart] = useState(true);

  useEffect(() => {
    const myInterval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    if (start) {
      clearInterval(myInterval);
    }

    return () => {
      clearInterval(myInterval);
    };
  }, [start]);

  return (
    <>
      TIMER: {displayTime(timer)}
      <br />
      Timer 2: {formatTime(timer)}
      <div className="flex gap-4">
        <button
          onClick={() => setStart(prev => !prev)}
          className="cursor-pointer border bg-blue-800 rounded-md px-2 py-1 my-2"
        >
          {start && timer > 0 ? 'Resume' : start ? 'Start' : 'Pause'}{' '}
        </button>
        <button
          onClick={() => {
            setTimer(0);
            setStart(true);
          }}
          className="cursor-pointer border bg-blue-800 rounded-md px-2 py-1 my-2"
        >
          Reset
        </button>
      </div>
    </>
  );
};

function displayTime(time: number) {
  return (
    ('0' + Math.floor(time / (60 * 60))).slice(-2) +
    ':' +
    ('0' + (Math.floor(time / 60) % 60)).slice(-2) +
    ':' +
    ('0' + (time % 60)).slice(-2)
  );
}

const formatTime = (time: number) => {
  const getSeconds = `0${time % 60}`.slice(-2);
  const minutes = Math.floor(time / 60);
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

  return `${getHours}:${getMinutes}:${getSeconds}`;
};
