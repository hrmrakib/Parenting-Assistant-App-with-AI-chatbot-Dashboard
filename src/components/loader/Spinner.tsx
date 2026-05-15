import { Loader } from "lucide-react";
import React from "react";

const Spinner = ({ size }: { size?: number }) => {
  return (
    <div className='flex items-center justify-center'>
      <Loader className='animate-spin text-primary' size={size || 24} />
    </div>
  );
};

export default Spinner;
