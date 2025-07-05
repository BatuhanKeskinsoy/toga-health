import CustomButton from "@/components/others/CustomButton";
import React from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

function AppointmentTimes() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center">
        <span>Temmuz 2025</span>
        <div className="flex gap-1 h-10 w-10">
          <CustomButton leftIcon={<IoArrowBack />} />
          <CustomButton rightIcon={<IoArrowForward />} />
        </div>
      </div>
      <hr className="border-gray-200" />
      <div className="flex gap-3 text-sm *:text-center">
        <div className="flex flex-col gap-1">
          <span>Bugün</span>
          <span className="min-w-max">5 Temmuz</span>
        </div>
        <div className="flex flex-col gap-1">
          <span>Yarın</span>
          <span className="min-w-max">6 Temmuz</span>
        </div>
        <div className="flex flex-col gap-1">
          <span>Pzt</span>
          <span className="min-w-max">7 Temmuz</span>
        </div>
        <div className="flex flex-col gap-1">
          <span>Sal</span>
          <span className="min-w-max">8 Temmuz</span>
        </div>
        <div className="flex flex-col gap-1">
          <span>Çar</span>
          <span className="min-w-max">9 Temmuz</span>
        </div>
        <div className="flex flex-col gap-1">
          <span>Per</span>
          <span className="min-w-max">10 Temmuz</span>
        </div>
        <div className="flex flex-col gap-1">
          <span>Çar</span>
          <span className="min-w-max">11 Temmuz</span>
        </div>
      </div>
      <div className="flex gap-3 text-sm *:text-center">
        <div className="flex flex-col gap-1">
          <div>14.00</div>
          <div>15.00</div>
          <div>16.00</div>
          <div>17.00</div>
          <div>18.00</div>
          <div>19.00</div>
          <div>20.00</div>
          <div>21.00</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>14.00</div>
          <div>15.00</div>
          <div>16.00</div>
          <div>17.00</div>
          <div>18.00</div>
          <div>19.00</div>
          <div>20.00</div>
          <div>21.00</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>14.00</div>
          <div>15.00</div>
          <div>16.00</div>
          <div>17.00</div>
          <div>18.00</div>
          <div>19.00</div>
          <div>20.00</div>
          <div>21.00</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>14.00</div>
          <div>15.00</div>
          <div>16.00</div>
          <div>17.00</div>
          <div>18.00</div>
          <div>19.00</div>
          <div>20.00</div>
          <div>21.00</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>14.00</div>
          <div>15.00</div>
          <div>16.00</div>
          <div>17.00</div>
          <div>18.00</div>
          <div>19.00</div>
          <div>20.00</div>
          <div>21.00</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>14.00</div>
          <div>15.00</div>
          <div>16.00</div>
          <div>17.00</div>
          <div>18.00</div>
          <div>19.00</div>
          <div>20.00</div>
          <div>21.00</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>14.00</div>
          <div>15.00</div>
          <div>16.00</div>
          <div>17.00</div>
          <div>18.00</div>
          <div>19.00</div>
          <div>20.00</div>
          <div>21.00</div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentTimes;
