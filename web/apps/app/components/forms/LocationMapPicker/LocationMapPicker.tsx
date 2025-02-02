import React, { useCallback, useState } from 'react';
import { Draggable, Map, Marker } from 'pigeon-maps';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { showNotification } from '@signalco/ui-notifications';
import { MyLocation } from '@signalco/ui-icons';
import { Loadable } from '@signalco/ui/Loadable';
import { Accordion } from '@signalco/ui/Accordion';
import { asArray, objectWithKey } from '@signalco/js';
import { usePromise } from '@enterwell/react-hooks';
import { FieldConfig } from '@enterwell/react-form-builder/lib/index.types';
import useUserTheme from '../../../src/hooks/useUserTheme';

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
    const dataFeatures = objectWithKey(data, 'features')?.features;
    const newPlaceName = Array.isArray(dataFeatures) && dataFeatures.length
        ? objectWithKey(asArray(dataFeatures)?.at(0), 'place_name')?.place_name
        : `${latLng[1].toFixed(4)}, ${latLng[0].toFixed(4)}`;
    return typeof newPlaceName !== 'string' ? '' : newPlaceName;
}

export default function LocationMapPicker(props: LocationMapPickerProps) {
    const { label, value: latLng, onChange: setLatLng } = props;

    const [expanded, setExpanded] = useState<boolean>(false);
    const loadLatLngToAddress = useCallback(() => latLngToAddress(latLng), [latLng]);
    const placeName = usePromise(loadLatLngToAddress);
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
            showNotification('Failed to retrieve your location. Make sure access to location is not blocked.', 'warning')
        }, {
            enableHighAccuracy: true,
            timeout: 10000
        });
    };

    return (
        <Accordion
            open={expanded}
            onOpenChanged={(_, open) => setExpanded(open)}
        >
            {expanded
                ? <Typography>Pick position on map</Typography>
                : (
                    <Stack>
                        <div style={{ width: '33%', flexShrink: 0 }}>
                            <Typography level="body2">
                                {label}
                            </Typography>
                        </div>
                        <Loadable isLoading={placeName.isLoading} loadingLabel="Loading location">
                            <Typography>{placeName.item}</Typography>
                        </Loadable>
                    </Stack>
                )}
            <Stack spacing={2}>
                <Row spacing={1}>
                    <IconButton onClick={handleGetLocation} size="lg" title="Get location">
                        <MyLocation />
                    </IconButton>
                    <Input value={placeName.item ?? ''} readOnly />
                </Row>
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
            </Stack>
        </Accordion>
    );
}
