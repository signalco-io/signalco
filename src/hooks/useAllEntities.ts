import { IDeviceModel } from "../devices/Device";
import DevicesRepository from "../devices/DevicesRepository";
import useLoadingAndError from "./useLoadingAndError";

const useAllEntities = () => {
    return useLoadingAndError<IDeviceModel, IDeviceModel>(DevicesRepository.getDevicesAsync);
};

export default useAllEntities;