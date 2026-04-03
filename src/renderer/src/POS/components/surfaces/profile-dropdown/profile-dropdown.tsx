import GavelIcon from '@mui/icons-material/Gavel';
import LogoutIcon from '@mui/icons-material/Logout';
import PolicyIcon from '@mui/icons-material/Policy';
import SettingsIcon from '@mui/icons-material/Settings';
import { Avatar, Tooltip } from '@mui/material';
import { colors } from "@shared/styles";
import { AppDispatch } from "@shared/types";
import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRoute } from "../../../hooks/use-route";
import { setActiveUser } from "../../../store/manager";
import { POSPages } from "../../../types/pages";
import * as S from './Styles';

function ProfileOption() {
  const [activeDropdown, setActiveDropdown] = useState<null | string>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { activeUser } = useSelector((state: any) => state.POS.manager)
  const {navigate} = useRoute()
  const dispatch = useDispatch<AppDispatch>()

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    )
      setActiveDropdown(null);
  };

  useEffect(() => {
    if (activeDropdown)
      document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const handleLogout = async () => {
    try {
      dispatch(setActiveUser(null))
    } catch(error:unknown){
      toast.error(
       (error as Error).message || "Sorry, Something went wrong."
      )
    }  finally {
      navigate(POSPages.LOGIN)
    }
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Tooltip title="" className="border-2">
        <Avatar
          src={activeUser?.image ?? ''}
          sx={{ background: colors.palette.neutral['200'] }}
          onClick={() =>
            setActiveDropdown(activeDropdown === 'Active' ? null : 'Active')
          }
          className="uppercase flex justify-center items-center cursor-pointer bg-primary text-primary"
        >
          <span className="text-primary font-semibold">
            {activeUser?.fullName?.charAt(0) ?? 'NA'}
          </span>
        </Avatar>
      </Tooltip>
      {activeDropdown === 'Active' && (
        <S.Dropdown className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <S.DropdownItem className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-center flex">
            <div className="flex items-center flex-row justify-start w-full gap-2  ">
              <Avatar
                src={activeUser?.image ?? ''}
                sx={{ background: colors.primary, fontSize:'1.5rem'}}
                className="uppercase flex justify-center items-center  bg-primary text-primary"
              >
                <span className="text-white font-semibold">
                  {activeUser?.fullName?.charAt(0) ?? 'NA'}
                </span>
              </Avatar>
              <div className="flex flex-col items-start  w-full overflow-hidden">
                {/* on overflow it should be ellipsis */}
                <span className="font-bold font-sans">{activeUser?.fullName ?? 'NA'}</span>
                <span className="font-sans text-slate-500">{activeUser?.type ?? 'NA'}</span>
              </div>
            </div>
          </S.DropdownItem>
          <hr className="border-gray-200"/>
      
            <S.DropdownItem
              className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-start flex"
              onClick={() => {
                setActiveDropdown(null);
                navigate(POSPages.SETTINGS);
              }}
            >
              <SettingsIcon sx={{fontSize:25}} className="text-primary" />
              <span className="ml-2">Settings</span>
            </S.DropdownItem>
    
          <S.DropdownItem
            className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-start flex"
            onClick={() => {
              setActiveDropdown(null);
              navigate(POSPages.PRIVACY_POLICY);
            }}
          >
            <PolicyIcon sx={{fontSize:25}} className="text-primary" />
            <span className="ml-2">Privacy Policy</span>
          </S.DropdownItem>
          <S.DropdownItem
            className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-start flex"
            onClick={() => {
              setActiveDropdown(null);
              navigate(POSPages.TERMS_AND_CONDITIONS);
            }}
          >
            <GavelIcon sx={{fontSize:25}} className="text-primary" />
            <span className="ml-2">Terms & Conditions</span>
          </S.DropdownItem>
          <S.DropdownItem
            className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-start flex"
            onClick={handleLogout}
          >
            <LogoutIcon sx={{fontSize:25}} className="text-primary" />
            <span className="ml-2">Sign Out</span>
          </S.DropdownItem>
        </S.Dropdown>
      )}
    </div>
  );
};
export default memo(ProfileOption);
