import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, Stack } from '@mui/system';
import { IconButton } from '@mui/joy';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import NavProfile from '../NavProfile';
import { ChildrenProps } from '../../src/sharedTypes';
import RealtimeService from '../../src/realtime/realtimeService';
import PageNotificationService from '../../src/notifications/PageNotificationService';
import useHashParam from '../../src/hooks/useHashParam';

const queryClient = new QueryClient();

export function AppLayout(props: ChildrenProps) {
  const {
    children
  } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isFullScreen, setFullScreenHash] = useHashParam('fullscreen');

  PageNotificationService.setSnackbar(enqueueSnackbar, closeSnackbar);

  // Initiate SignalR communication
  useEffect(() => {
    RealtimeService.startAsync();
    RealtimeService.queryClient = queryClient;
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' }, height: '100%', width: '100%' }}>
          {isFullScreen !== 'on' && <NavProfile />}
          <Box sx={{ height: '100%', width: '100%', flexGrow: 1, position: 'relative' }}>
            {children}
          </Box>
        </Stack>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      {isFullScreen && (
        <IconButton
          size="lg"
          aria-label="Exit fullscreen"
          title="Exit fullscreen"
          sx={{ position: 'fixed', bottom: '12px', right: '12px' }}
          onClick={() => setFullScreenHash(undefined)}>
          <FullscreenExitIcon fontSize="medium" />
        </IconButton>
      )}
    </>
  );
}
