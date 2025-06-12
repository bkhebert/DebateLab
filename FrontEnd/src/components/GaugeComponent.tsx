import { useState, useRef, useEffect } from "react";

export default function GaugeComponent({percentage}) {
  const [ progressBar, setProgressBar] = useState(0);
  const [ progressBarColor, setProgressBarColor] = useState("text-red-500");
  const [ progressReached, setProgressReached] = useState(false);
  const progIntervalRef = useRef(null);
  const progRef = useRef({ value: 0});

   useEffect(() => {
  
      if(!progressReached){
      progIntervalRef.current = setInterval(() => {
        const p = progRef.current;
       
        if(p.value === 25){
          setProgressBarColor('text-yellow-500')
        }
        if(p.value === 60){
          setProgressBarColor('text-green-500')
        }
  
  
        if(p.value < (Math.floor((percentage * 0.75)))) {
          p.value += 1
          
        }
  
        setProgressBar(p.value)
        if(p.value === Math.floor(percentage * 0.75)){ // This number must be changed to determine the total % of the gauge once filled. 75 is 100%
  
          setProgressReached(true);
          setProgressBarColor('text-cyan-500')
        }
      }, 100);
    }
  
      if(progressReached){
        clearInterval(progIntervalRef.current);
      
      }
  
      return (() => {
        clearInterval(progIntervalRef.current);
      });
  
    }, [progressReached, percentage])

  return (
                <div className="relative size-40 m-4" >
                <svg className="rotate-[135deg] size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-white" strokeWidth="1" strokeDasharray="75 100"></circle>
                  <circle cx="18" cy="18" r="16" fill="none" className={`stroke-current ${progressBarColor}`} strokeWidth="2" strokeDasharray={`${Math.floor(progRef.current.value)} 100`}></circle>
                </svg>

                <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-2xl font-semibold text-blue-50 font-mono">{Math.floor(progRef.current.value / .75)} %</span>
                  <span className="text-cyan-50 font-bold block font-mono">completed</span>
                </div>
            </div>
  )
};
