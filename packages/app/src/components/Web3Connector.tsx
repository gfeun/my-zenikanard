import React, { useMemo, useEffect, FC, Suspense } from 'react'

import { InjectedConnector } from '@web3-react/injected-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'

import styles from './Web3Connector.module.css'

const Web3Connector = () => {
  const AVALANCHE_TESTNET_PARAMS = {
    chainId: '0xA869',
    chainName: 'Avalanche Testnet C-Chain',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax-test.network/'],
  }

  const injected = new InjectedConnector({
    supportedChainIds: [parseInt(AVALANCHE_TESTNET_PARAMS.chainId, 16)],
  })

  const {
    chainId,
    active,
    account,
    library,
    connector,
    activate,
    deactivate,
    error,
  } = useWeb3React()

  console.log(error)
  async function connect() {
    console.log('connect')
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    console.log('disconnect')
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  const isUnsupportedChainIdError = useMemo(() => {
    return error instanceof UnsupportedChainIdError
  }, [error])

  useEffect(() => {
    if (isUnsupportedChainIdError) {
      console.log('useEffect called')
      injected.getProvider().then((provider) => {
        provider
          .request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_TESTNET_PARAMS],
          })
          .catch((error: any) => {
            console.log(error)
          })
      })
    }
  }, [AVALANCHE_TESTNET_PARAMS, connector, injected, isUnsupportedChainIdError])

  console.log({
    chainId,
    isUnsupportedChainIdError,
    c: parseInt(AVALANCHE_TESTNET_PARAMS.chainId, 16),
  })

  return (
    <div className={styles.connector}>
      {isUnsupportedChainIdError ? <p>Network change required</p> : null}
      <button onClick={connect}>Connect to MetaMask</button>
      {active ? (
        <span className={styles.address}>
          Connected with <b>{account}</b>
        </span>
      ) : (
        <span className={styles.address}>Not connected</span>
      )}
      <button onClick={disconnect}>Disconnect</button>
    </div>
  )
}

export default Web3Connector
