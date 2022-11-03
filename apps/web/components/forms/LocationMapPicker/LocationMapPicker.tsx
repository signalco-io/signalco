import React, { useCallback, useState } from 'react';
import { Draggable, Map, Marker } from 'pigeon-maps';
import { MyLocation } from '@signalco/ui-icons';
import { Box, Stack } from '@mui/system';
import { IconButton, TextField, Typography } from '@mui/joy';
import { FieldConfig } from '@enterwell/react-form-builder/lib/esm/index.types';
import useUserTheme from 'src/hooks/useUserTheme';
import useLoadAndError from 'src/hooks/useLoadAndError';
import Loadable from 'components/shared/Loadable/Loadable';
import Accordion from 'components/shared/layout/Accordion';
import PageNotificationService from '../../../src/notifications/PageNotificationService';

const mapBoxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function mapTiler(dark: boolean, x: number, y: number, z: number, dpr?: number) {
    const styleLight = 'aleksandartopleksignalco/cl1zcgzi7008p15o9g09jf38n';
    const styleDark = 'aleksandartopleksignalco/cl1zd3zut008q15o9vgx8l662';
    return `https://api.mapbox.com/styles/v1/${dark ? styleDark : styleLight}/tiles/512/${z}/${x}/${y}${(dpr ?? 1) >= 2 ? '@2x' : ''}?access_token=${mapBoxAccessToken}`;
}

export interface LocationMapPickerProps {
    label?: string,
    value?: [number, number],
    onChange: (value: [number, number], config: FieldConfig) => void
}

async function latLngToAddress(latLng?: [number, number]) {
    if (!latLng) return '';

    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${latLng[1]},${latLng[0]}.json?types=place%2Cpostcode%2Caddress&limit=1&access_token=${mapBoxAccessToken}`);
    const data = await response.json();
    const newPlaceName = data.features && data.features.length
        ? data.features[0].place_name
        : `${latLng[1].toFixed(4)}, ${latLng[0].toFixed(4)}`
    return newPlaceName;
}

export default function LocationMapPicker(props: LocationMapPickerProps) {
    const { label, value: latLng, onChange: setLatLng } = props;

    const [expanded, setExpanded] = useState<boolean>(false);
    const loadLatLngToAddress = useCallback(() => latLngToAddress(latLng), [latLng]);
    const placeName = useLoadAndError(loadLatLngToAddress);
    const [zoom, setZoom] = useState<number | undefined>(3);
    const themeContext = useUserTheme();

    const handleMove = ({ center, zoom }: { center: [number, number], zoom: number }) => {
        setZoom(zoom);
        setLatLng([center[0], center[1]], { receiveEvent: false });
    }

    const handleGetLocation = () => {
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            setLatLng([position.coords.latitude, position.coords.longitude], { receiveEvent: false });
            setZoom(15);
        }, () => {
            PageNotificationService.show('Failed to retrieve your location. Make sure access to location is not blocked.', 'warning')
        }, {
            enableHighAccuracy: true,
            timeout: 10000
        });
    };

    return (
        <Accordion
            open={expanded}
            onChange={(_, open) => setExpanded(open)}
            // expandIcon={<ExpandMoreIcon />}
        >
            {expanded
                ? <Typography>Pick position on map</Typography>
                : (
                    <Stack>
                        <Typography sx={{ width: '33%', flexShrink: 0, fontSize: '0.8em', color: 'text.secondary' }}>
                            {label}
                        </Typography>
                        <Loadable isLoading={placeName.isLoading}>
                            <Typography>{placeName.item}</Typography>
                        </Loadable>
                    </Stack>
                )}
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="stretch" spacing={1}>
                    <IconButton onClick={handleGetLocation} size="lg">
                        <MyLocation />
                    </IconButton>
                    <TextField value={placeName.item ?? ''} />
                </Stack>
                <Box sx={{ '&>div': { background: 'transparent !important' } }}>
                    <Map
                        provider={(x, y, z, dpr) => mapTiler(themeContext.isDark, x, y, z, dpr)}
                        dprs={[1, 2]}
                        height={320}
                        center={latLng}
                        zoom={zoom}
                        attribution={false}
                        onBoundsChanged={handleMove}
                    >
                        <Draggable offset={[0, 50]} anchor={latLng} onDragEnd={(point) => setLatLng(point, { receiveEvent: false })}>
                            <Marker
                                width={50}
                                anchor={latLng}
                                color="black"
                            />
                        </Draggable>
                    </Map>
                </Box>
            </Stack>
        </Accordion>
    );
}
