import { LoaderCircle } from "lucide-react";
import React from "react";
import { Hatch } from "ldrs/react";
import "ldrs/react/Hatch.css";

const Loader = ({text,color}) => {
  return (
    <div className="flex flex-col gap-3 items-center justify-center z-50">
      <Hatch size="28" stroke="4.5" speed="3" color={color || "green"} />
      <p
        className="font-roboto font-semibold bg-gradient-to-r bg-clip-text from-blue-600 to-purple-600 text-transparent
                 dark:from-blue-500 dark:to-purple-500
                   transition-all duration-200"
      >
        {text?text:""}
      </p>
    </div>
  );
};

export default Loader;

// Default values shown
