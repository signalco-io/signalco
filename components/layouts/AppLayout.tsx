import { Box, Fab, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import NavProfile from '../NavProfile';
import { useSnackbar } from 'notistack';
import PageNotificationService from '../../src/notifications/PageNotificationService';
import RealtimeService from '../../src/realtime/realtimeService';
import useHashParam from '../../src/hooks/useHashParam';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { ChildrenProps } from '../../src/sharedTypes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RouterSharpIcon from '@mui/icons-material/RouterSharp';
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
        <Fab
          size="small"
          aria-label="Exit fullscreen"
          title="Exit fullscreen"
          sx={{ position: 'fixed', bottom: '12px', right: '12px' }}
          onClick={() => setFullScreenHash(undefined)}>
          <FullscreenExitIcon fontSize="medium" />
        </Fab>
      )}
    </>
  );
}
