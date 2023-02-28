import { useCallback } from 'react';
import { Row, Stack, Loadable, NoDataPlaceholder, Typography } from '@signalco/ui';
import { useLoadAndError } from '@signalco/hooks';
import { WidgetSharedProps } from '../Widget';
import { DefaultRows, DefaultColumns } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import { JsonResponse } from '@signalco/js';

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

    const tickerData: JsonResponse<{ results: { ticker: string, name: string }[] }> = await tickerResponse.json();
    const previousPriceData: JsonResponse<{ results: { c: number, o: number }[] }> = await previousPriceResponse.json();

    if (!previousPriceData?.results?.length)
        return {
            error: previousPriceResponse.status,
            errorMessage: previousPriceResponse.statusText || previousPriceResponse.status === 429
                ? 'Too many requests'
                : `Invalid response ${previousPriceResponse.status}`
        };

    if (!tickerData?.results?.length)
        return {
            error: tickerResponse.status,
            errorMessage: tickerResponse.statusText || tickerResponse.status === 429
                ? 'Too many requests'
                : `Invalid response ${tickerResponse.status}`
        };

    return {
        ticker: tickerData.results[0].ticker,
        name: tickerData.results[0].name,
        close: previousPriceData.results[0].c,
        open: previousPriceData.results[0].o
    };
}

export default function WidgetFinanceStock(props: WidgetSharedProps<ConfigProps>) {
    const { config } = props;
    const loadPriceFunc = useCallback(() => loadPricePolygonApi(config?.ticker, config?.polygonApiKey), [config?.ticker, config?.polygonApiKey])
    const price = useLoadAndError(loadPriceFunc);

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
                        <Typography level="h6" marginBottom={'-4px'}>{ticker}</Typography>
                        <Typography level="body2">{name}</Typography>
                    </Stack>
                    <Stack>
                        {!price?.item ? (
                            <NoDataPlaceholder content={'No data'} />
                        ) : (
                            <>
                                <Typography level="h4" fontWeight="bold" lineHeight={0.9}>${closePrice}</Typography>
                                <Typography color={diffPerc >= 0 ? 'success' : 'danger'}>{diffPerc >= 0 ? '+' : ''}{diffPercDecimals}%</Typography>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Loadable>
        </Row>
    );
}
