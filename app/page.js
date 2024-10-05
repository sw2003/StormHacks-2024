import Image from "next/image";
import {Button} from '@nextui-org/button'; 

export default function Home() {
  return (
      <div className=" max-w-[768px] mx-auto">
        <div className="p-2">
          <div className="p-2 bg-red-500 rounded text-center cursor-pointer">
            Record
          </div>
        </div>      
      </div>
  );
}
