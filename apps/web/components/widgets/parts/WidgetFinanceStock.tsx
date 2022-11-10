import { useCallback } from 'react';
import { Stack } from '@mui/system';
import { Typography } from '@mui/joy';
import { DefaultHeight, DefaultWidth } from 'src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from 'src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from 'src/hooks/widgets/useWidgetOptions';
import useLoadAndError from 'src/hooks/useLoadAndError';
import Loadable from 'components/shared/Loadable/Loadable';
import { WidgetSharedProps } from '../Widget';

const stateOptions: IWidgetConfigurationOption[] = [
    { label: 'Ticker', name: 'ticker', type: 'string' },
    { label: 'Polygon.io API key', name: 'polygonApiKey', type: 'string' },
    DefaultHeight(2),
    DefaultWidth(2)
];

async function loadPricePolygonApi(ticker: string, apiKey: string) {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${apiKey}`);
    const data: any = await response.json();

    const tickerResponse = await fetch(`https://api.polygon.io/v3/reference/tickers?ticker=${ticker}&active=true&sort=ticker&order=asc&limit=10&apiKey=${apiKey}`);
    const tickerData: any = await tickerResponse.json();

    return {
        ticker: tickerData.results[0].ticker,
        name: tickerData.results[0].name,
        close: data.results[0].c,
        open: data.results[0].o
    };
}

export default function WidgetFinanceStock(props: WidgetSharedProps) {
    const { config } = props;
    const loadPriceFunc = useCallback(() => loadPricePolygonApi(config.ticker, config.polygonApiKey), [config.ticker, config.polygonApiKey])
    const price = useLoadAndError(loadPriceFunc);

    useWidgetOptions(stateOptions, props);

    const ticker = price.item?.ticker;
    const name = price.item?.name;
    const closePrice = price.item?.close;
    const diff = price.item?.close - price.item?.open;
    const diffPerc = Math.round(((diff / closePrice) * 100 + Number.EPSILON) * 100) / 100;

    return (
        <Stack sx={{ height: '100%' }} alignItems={price.isLoading ? 'center' : 'stretch'} direction="row" justifyContent={price.isLoading ? 'center' : 'stretch'}>
            <Loadable isLoading={price.isLoading} error={price.error}>
                <Stack p={3} justifyContent="space-between">
                    <Stack>
                        <Typography level="h6" marginBottom={'-4px'}>{ticker}</Typography>
                        <Typography level="body2">{name}</Typography>
                    </Stack>
                    <Stack>
                        <Typography level="h4" fontWeight="bold" lineHeight={0.9}>${closePrice}</Typography>
                        <Typography color={diffPerc >= 0 ? 'success' : 'danger'}>{diffPerc}%</Typography>
                    </Stack>
                </Stack>
            </Loadable>
        </Stack>
    );
}
