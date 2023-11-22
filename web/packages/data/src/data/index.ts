import ChannelsData from './channelsData.json';
import ChannelCategories from './channelCategoriesData.json';

export type ChannelDataItem = {
    channelName: string,
	label: string,
	categories: string[],
	description?: string | undefined,
    planned?: boolean | undefined,
    officialUrl: string
};
export const channelsData: ChannelDataItem[] = ChannelsData;

export type ChannelCategory = {
    id: string,
    label: string
}
export const channelCategories: ChannelCategory[] = ChannelCategories;
