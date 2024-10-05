import Image from "next/image";
import {Button} from '@nextui-org/button'; 
import { RiRecordCircleLine } from "react-icons/ri";

export default function Home() {
  return (
      <div className=" max-w-[768px] mx-auto">
        <div className="p-2">
          <div className="p-2 bg-red-500 rounded-full text-center cursor-pointer flex gap-3 items-center justify-center">
            <RiRecordCircleLine size={20}></RiRecordCircleLine>
            Record
          </div>
        </div>      
      </div>
  );
}
