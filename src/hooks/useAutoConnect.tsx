import { connect, getAccount, getNetwork } from '@wagmi/core';
import { SafeConnector } from '@wagmi/core/connectors/safe';
import { useEffect } from 'react';

function useAutoConnect() {
  const { chains } = getNetwork();
  const { address, connector: connectedConnector } = getAccount();

  const safeConnector = new SafeConnector({
    chains,
    options: {
      allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
      debug: false,
    },
  });

  useEffect(() => {
    async function handleConnect() {
      if (connectedConnector?.id == safeConnector?.id) return;
      await connect({
        connector: safeConnector,
      });
    }
    handleConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect, chains, address]);
}

export default useAutoConnect;
