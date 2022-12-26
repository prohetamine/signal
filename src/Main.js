import { useState } from 'react'
import useLocalStorage from 'use-local-storage'

import {
  Main,
  LogoWrapper,
  Logo,
  GitHubLink,
  PanelsWrapper,
  Panel,
  PanelTitle,
  Input,
  Button,
  RecButton,
  LernButton,
  Select,
  VideoWrapper,
  SignalsStorageWrapper,
  SignalsEmulateWrapper,
  SignalCard,
  SignalCardGhost,
  PredictWrapper,
  Predict,
  OverflowMainSettings,
  MainSettings,
  LoadConfigCard,
  DownloadConfigCard
} from './Components.js'

import {
  useCameraDevices,
  useCamera,
  useCanvas,
  useBle,
  useControllBleDevice,
  useMainHook
} from './Hooks'

const _Main = () => {
  const camDevices = useCameraDevices()

  const [signalName, setSignalName] = useState('')
      , [isRecordSignal, setRecordSignal] = useState(false)
      , [recordSignalTimeout, setRecordSignalTimeout] = useLocalStorage('record-timeout', '')
      , [isLernSignal, setLernSignal] = useState(false)
      , [lernSignalTimeout, setLernSignalTimeout] = useLocalStorage('lern-timeout', '')
      , [selectSignal, setSelectSignal] = useState(null)
      , [signalPredict, setSignalPredict] = useState({})
      , [signalEmulate, setSignalEmulate] = useState({})
      , [signals, setSignals] = useState({})
      , [isMoreSignals, setMoreSignals] = useState(false)
      , [isMoreSettings, setMoreSettings] = useState(false)
      , [maxOffsetX, setMaxOffsetX] = useLocalStorage('max-offset-x', '')
      , [maxOffsetY, setMaxOffsetY] = useLocalStorage('max-offset-y', '')
      , [maxOffsetZ, setMaxOffsetZ] = useLocalStorage('max-offset-z', '')
      , [lernTruePredict, setLernTruePredict] = useLocalStorage('lern-true-predict', '')
      , [truePredict, setTruePredict] = useLocalStorage('true-predict', '')
      , [camDevice, setCamDevice] = useLocalStorage('use-device', 0)
      , [loadFilename, setLoadFilename] = useState('signals-config.json')
      , [serviceBleDevice, setServiceBleDevice] = useLocalStorage('service-ble-device', '')
      , [characteristicBleDevice, setCharacteristicBleDevice] = useLocalStorage('characteristic-ble-device', '')

  const ble = useBle({
    service: serviceBleDevice,
    characteristic: characteristicBleDevice
  })

  useControllBleDevice({
    ble,
    signalEmulate,
    signalPredict
  })

  const [videoRef, video] = useCamera(camDevices[camDevice])

  const [canvasRef, ctx, canvas] = useCanvas({
    width: 1280 / 2,
    height: 720 / 2
  })

  useMainHook({
    video,
    camDevice,
    ctx,
    canvas,
    setSignals,
    setSignalPredict,
    setSelectSignal,
    isLernSignal,
    selectSignal,
    signals,
    isRecordSignal,
    maxOffsetX,
    maxOffsetY,
    maxOffsetZ,
    lernTruePredict,
    truePredict
  })

  const isSignalsCards = Object.keys(signals).map(key => signals[key]).flat().length > 0

  return (
    <Main>
      {
        isMoreSettings
          ? (
            <OverflowMainSettings
              id='main-overflow'
              onClick={
                event => {
                  if (event.target.id === 'main-overflow') {
                    setMoreSettings(false)
                  }
                }
              }
            >
              <MainSettings>
                <div style={{ marginBottom: '30px' }}>
                  <Input
                    style={{ width: '447px' }}
                    type='text'
                    value={recordSignalTimeout}
                    onChange={({ target: { value } }) => setRecordSignalTimeout(value)}
                    placeholder='Record timeout (default 5s)'
                  />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <Input
                    style={{ width: '447px' }}
                    type='text'
                    value={truePredict}
                    onChange={({ target: { value } }) => setTruePredict(value)}
                    placeholder='True predict (default 3)'
                  />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <Input
                    style={{ width: '447px' }}
                    type='text'
                    value={lernSignalTimeout}
                    onChange={({ target: { value } }) => setLernSignalTimeout(value)}
                    placeholder='Lern timeout (default ∞)'
                  />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <Input
                    style={{ width: '447px' }}
                    type='text'
                    value={lernTruePredict}
                    onChange={({ target: { value } }) => setLernTruePredict(value)}
                    placeholder='Lern true predict (default 10)'
                  />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <Input
                    style={{ width: '447px' }}
                    type='text'
                    value={maxOffsetX}
                    onChange={({ target: { value } }) => setMaxOffsetX(value)}
                    placeholder='Max offset X (default 0.02)'
                  />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <Input
                    style={{ width: '447px' }}
                    type='text'
                    value={maxOffsetY}
                    onChange={({ target: { value } }) => setMaxOffsetY(value)}
                    placeholder='Max offset Y (default 0.02)'
                  />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <Input
                    style={{ width: '447px' }}
                    type='text'
                    value={maxOffsetZ}
                    onChange={({ target: { value } }) => setMaxOffsetZ(value)}
                    placeholder='Max offset Z (default 0.05)'
                  />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <Input
                    style={{ width: '447px' }}
                    type='text'
                    value={serviceBleDevice}
                    onChange={({ target: { value } }) => setServiceBleDevice(value)}
                    placeholder='Service device (default 4fafc201-1fb5-459e-8fcc-c5c9c331914f)'
                  />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <Input
                    style={{ width: '447px' }}
                    type='text'
                    value={characteristicBleDevice}
                    onChange={({ target: { value } }) => setCharacteristicBleDevice(value)}
                    placeholder='Characteristic device (default beb5483e-36e1-4688-b7f5-ea07361b26a7)'
                  />
                </div>
                <div>
                  <Button
                    onClick={() => {
                      window.localStorage.clear()
                      window.location.reload()
                    }}
                    style={{ width: '447px' }}
                  >
                    Reset all settings
                  </Button>
                </div>
              </MainSettings>
            </OverflowMainSettings>
          )
          : null
      }
      <LogoWrapper>
        <Logo />
        <GitHubLink href='https://github.com/prohetamine/signal'>GitHub</GitHubLink>
      </LogoWrapper>
      <PanelsWrapper>
        <Panel style={{ marginLeft: '0px' }}>
          <PanelTitle>Camera</PanelTitle>
          <VideoWrapper>
            <video autoPlay={true} hidden ref={videoRef}></video>
            <canvas ref={canvasRef}></canvas>
            <PredictWrapper>
            {
              Object.keys(signalPredict).map(signalName => (
                <Predict key={signalName} style={(signalPredict[signalName] || signalEmulate[signalName]) ? { background: '#0f0' } : { background: '#eeeeeeaa' }}>{signalName}</Predict>
              ))
            }
            </PredictWrapper>
          </VideoWrapper>
        </Panel>
        <Panel>
          <PanelTitle>Controls</PanelTitle>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '19px' }}>
              <div style={{ marginBottom: '20px' }}>
                <RecButton
                  style={{
                    width: '100%',
                    minWidth: '243px',
                    maxWidth: '243px'
                  }}
                  isRecordSignal={isRecordSignal}
                  onClick={
                    () => {
                      if (selectSignal) {
                        setRecordSignal(true)

                        setTimeout(() => {
                          setRecordSignal(false)
                        }, parseFloat(recordSignalTimeout) === recordSignalTimeout - 0 ? ((parseFloat(recordSignalTimeout) * 1000) || 5000) : 5000)
                      }
                    }
                  }
                />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <LernButton
                  style={{
                    width: '100%',
                    minWidth: '243px',
                    maxWidth: '243px'
                  }}
                  isLernSignal={isLernSignal}
                  onClick={
                    () => {
                      if (lernSignalTimeout === '') {
                        setLernSignal(s => !s)
                      } else {
                        setLernSignal(true)
                        setTimeout(() => {
                          setLernSignal(false)
                        }, parseFloat(lernSignalTimeout) === lernSignalTimeout - 0 ? (parseFloat(lernSignalTimeout) * 1000) : 5000)
                      }
                    }
                  }
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <Button
                  style={{
                    width: '100%',
                    minWidth: '243px',
                    maxWidth: '243px'
                  }}
                  onClick={
                    ble.isConnect
                      ? () => ble.disconnect()
                      : () => ble.connect()
                  }
                >
                  {
                    ble.isConnect
                      ? 'Disconnect device'
                      : 'Connect device'
                  }
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setMoreSettings(true)}
                  style={{
                    width: '100%',
                    minWidth: '243px',
                    maxWidth: '243px'
                  }}
                >
                  More settings
                </Button>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: '20px' }}>
                <Input
                  type='text'
                  value={signalName}
                  onChange={({ target: { value } }) => setSignalName(value)}
                  placeholder='Signal name...'
                />
                <Button
                  onClick={
                    () => {
                      if (Object.keys(signals).length < 10) {
                        if (signalName.length > 0) {
                          setSignals(s => ({ ...s, [signalName]: [] }));
                          setSelectSignal(signalName)
                          setSignalName('')
                        }
                      } else {
                        setSignalName('limit 10 signals')
                      }
                    }
                  }
                  style={{ marginLeft: '16px' }}
                >
                  Add
                </Button>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <Select
                  width={373}
                  value={selectSignal}
                  onChange={value => setSelectSignal(value)}
                  placeholder='Signal'
                  items={Object.keys(signals).map(signalName => ({ label: signalName, value: signalName }))}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <Select
                  width={373}
                  value={camDevice}
                  onChange={
                    value =>
                      setCamDevice(
                        value
                      )
                  }
                  placeholder='Camera'
                  items={camDevices.map(({ label }, i) => ({ label: label.slice(0, 23), value: i }))}
                />
              </div>
            </div>
          </div>
        </Panel>
      </PanelsWrapper>
      {
        /*isSignalsCards*/ false
          ? (
            <Panel style={{ marginLeft: '0px' }}>
              <PanelTitle>Simulate signals</PanelTitle>
              <SignalsEmulateWrapper>
                <>
                  {
                    Object.keys(signals).map(signal => (
                      <Button
                        key={signal}
                        onMouseDown={
                          () => {
                            setSignalEmulate(
                              s => ({
                                ...s,
                                [signal]: true
                              })
                            )
                          }
                        }
                        onMouseUp={
                          () => {
                            setSignalEmulate(
                              s => ({
                                ...s,
                                [signal]: false
                              })
                            )
                          }
                        }
                        style={{ marginRight: '16px', marginBottom: '16px' }}
                      >
                        {signal}
                      </Button>
                    ))
                  }
                </>
                <Button
                  style={{ marginRight: '16px', marginBottom: '16px' }}
                  onClick={() => {
                    const popup = window.open('/signalEmulate', 'Signal Emulate', `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=100,height=100,left=0,top=0`);

                    setInterval(() => {
                      popup.postMessage("", 'https://signal.prohetamine.net.com.ru');
                    }, 1000)

                  }}
                >
                  Open mini window
                </Button>
              </SignalsEmulateWrapper>
            </Panel>
          )
          : (
            null
          )
      }
      <Panel style={{ marginLeft: '0px' }}>
        <PanelTitle>Signals</PanelTitle>
        <SignalsStorageWrapper>
          <LoadConfigCard
            onChange={
              ({ json, filename }) => {
                setSignals(json.signals)
                setLoadFilename(filename)
              }
            }
          />
          {
            isSignalsCards
              ? (
                <DownloadConfigCard
                  filename={loadFilename}
                  data={{
                    signals
                  }}
                />
              )
              : (
                null
              )
          }
          {
            isMoreSignals
              ? isSignalsCards
                ? (
                  <SignalCardGhost
                    onClick={() => setMoreSignals(s => !s)}
                  >
                    Hide...
                  </SignalCardGhost>
                )
                : (
                  null
                )
              : (
                null
              )
          }
          <>
            {
              (
                isLernSignal
                  ? (
                    Object.keys(signals)
                      .sort((a, b) => {
                        try {
                          return signals[b][signals[b].length - 1].date - signals[a][signals[a].length - 1].date
                        } catch (e) {
                          return 0
                        }
                      })
                  )
                  : (
                    Object.keys(signals)
                      .sort((a, b) => (b === selectSignal ? 1 : 0) - (a === selectSignal ? 1 : 0))
                  )
              )
              .map(
                signal =>
                  signals[signal].sort((a, b) => b.date - a.date).map(
                    (data, i) => (
                      <SignalCard key={signal + '-' + data.date + '-' + i} number={signals[signal].length - i} index={i} data={data} signal={signal} onRemove={i => setSignals(signals => ({ ...signals, [signal]: signals[signal].filter((_, i2) => i2 !== i) }))}/>
                    )
                  )
              )
              .flat()
              .slice(0, isMoreSignals ? 1000 : 5)
            }
          </>
          {
            isSignalsCards
              ? (
                <SignalCardGhost
                  onClick={() => setMoreSignals(s => !s)}
                >
                  {!isMoreSignals ? 'More...' : 'Hide...'}
                </SignalCardGhost>
              )
              : (
                null
              )
          }
        </SignalsStorageWrapper>
      </Panel>
    </Main>
  )
}

export default _Main
