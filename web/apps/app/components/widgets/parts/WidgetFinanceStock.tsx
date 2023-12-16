import { useCallback } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';
import { Loadable } from '@signalco/ui/Loadable';
import { objectWithKey } from '@signalco/js';
import { usePromise } from '@enterwell/react-hooks';
import { WidgetSharedProps } from '../Widget';
import { DefaultRows, DefaultColumns } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';

type ConfigProps = {
    ticker: string;
    polygonApiKey: string;
    rows: number;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    { label: 'Ticker', name: 'ticker', type: 'string' },
    { label: 'Polygon.io API key', name: 'polygonApiKey', type: 'string' },
    DefaultRows(2),
    DefaultColumns(2)
];

async function loadPricePolygonApi(ticker: string | undefined, apiKey: string | undefined) {
    if (!ticker || !apiKey)
        return undefined;

    const tickerResponsePromise = fetch(`https://api.polygon.io/v3/reference/tickers?ticker=${ticker}&active=true&sort=ticker&order=asc&limit=10&apiKey=${apiKey}`);
    const previousPriceResponsePromise = fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${apiKey}`);

    const [tickerResponse, previousPriceResponse] = await Promise.all([tickerResponsePromise, previousPriceResponsePromise]);

    const previousPriceData = await previousPriceResponse.json();
    const previousPriceDataResults = objectWithKey(previousPriceData, 'results')?.results;
    if (!Array.isArray(previousPriceDataResults) ||
        !previousPriceDataResults?.length)
        return {
            error: previousPriceResponse.status,
            errorMessage: previousPriceResponse.statusText || previousPriceResponse.status === 429
                ? 'Too many requests'
                : `Invalid response ${previousPriceResponse.status}`
        };

    const tickerData = await tickerResponse.json();
    const tickerDataResults = objectWithKey(tickerData, 'results')?.results;
    if (!Array.isArray(tickerDataResults) ||
        !tickerDataResults?.length)
        return {
            error: tickerResponse.status,
            errorMessage: tickerResponse.statusText || tickerResponse.status === 429
                ? 'Too many requests'
                : `Invalid response ${tickerResponse.status}`
        };

    return {
        ticker: Number(objectWithKey(tickerDataResults[0], 'ticker')?.ticker),
        name: Number(objectWithKey(tickerDataResults[0], 'name')?.name),
        close: Number(objectWithKey(previousPriceDataResults[0], 'c')?.c),
        open: Number(objectWithKey(previousPriceDataResults[0], 'o')?.o)
    };
}

export default function WidgetFinanceStock(props: WidgetSharedProps<ConfigProps>) {
    const { config } = props;
    const loadPriceFunc = useCallback(() => loadPricePolygonApi(config?.ticker, config?.polygonApiKey), [config?.ticker, config?.polygonApiKey])
    const price = usePromise(loadPriceFunc);

    useWidgetOptions(stateOptions, props);

    const ticker = price.item?.ticker ?? config?.ticker;
    const name = price.item?.name;
    const closePrice = price.item?.close;
    const diff = (price.item?.close ?? 0) - (price.item?.open ?? 0);
    const diffPerc = closePrice ? (Math.round(((diff / closePrice) * 100 + Number.EPSILON) * 100) / 100) : 0;
    const diffPercDecimals = diffPerc.toFixed(4).replace(/0{0,2}$/, '');

    return (
        <Row style={{ height: '100%' }} alignItems={price.isLoading ? 'center' : 'stretch'} justifyContent={price.isLoading ? 'center' : 'stretch'}>
            <Loadable isLoading={price.isLoading} loadingLabel="Loading data" error={price.error || price.item?.errorMessage}>
                <Stack style={{ padding: 3 * 8 }} justifyContent="space-between">
                    <Stack>
                        <div style={{ marginBottom: -4 }}>
                            <Typography level="h6">{ticker}</Typography>
                        </div>
                        <Typography level="body2">{name}</Typography>
                    </Stack>
                    <Stack>
                        {!price?.item ? (
                            <NoDataPlaceholder>
                                No data
                            </NoDataPlaceholder>
                        ) : (
                            <>
                                <Typography level="h4" bold>${closePrice}</Typography>
                                <Typography color={diffPerc >= 0 ? 'success' : 'danger'}>{diffPerc >= 0 ? '+' : ''}{diffPercDecimals}%</Typography>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Loadable>
        </Row>
    );
}
