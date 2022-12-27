import React, { useEffect } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useQueryClient } from '@tanstack/react-query';
import { Minimize } from '@signalco/ui-icons';
import { IconButton, MuiStack, Tooltip } from '@signalco/ui';
import NavProfile from '../NavProfile';
import { ChildrenProps } from '../../src/sharedTypes';
import RealtimeService from '../../src/realtime/realtimeService';
import useHashParam from '../../src/hooks/useHashParam';

export function AppLayout(props: ChildrenProps) {
  const {
    children
  } = props;
  const [isFullScreen, setFullScreenHash] = useHashParam('fullscreen');
  const queryClient = useQueryClient();

  // Initiate SignalR communication
  useEffect(() => {
    RealtimeService.startAsync();
    RealtimeService.queryClient = queryClient;
  }, [queryClient]);

  return (
    <>
      <MuiStack sx={{ flexDirection: { xs: 'column', sm: 'row' }, height: '100vh', width: '100%' }}>
        {isFullScreen !== 'on' && (
          <NavProfile />
        )}
        <div style={{ height: '100vh', overflow: 'auto', width: '100%', flexGrow: 1, position: 'relative' }}>
          {children}
        </div>
      </MuiStack>
      <ReactQueryDevtools initialIsOpen={false} />
      {isFullScreen && (
        <Tooltip title="Exit fullscreen">
          <IconButton
            size="lg"
            aria-label="Exit fullscreen"
            sx={{ position: 'fixed', bottom: '12px', right: '12px' }}
            onClick={() => setFullScreenHash(undefined)}>
            <Minimize />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}
