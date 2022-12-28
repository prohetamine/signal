import { useEffect, useState, useRef } from 'react'
import { Hands } from '@mediapipe/hands'
import { drawConnectors } from '@mediapipe/drawing_utils'

import { str2ab, HAND_CONNECTIONS } from './Libs'

const useCanvas = ({ width, height }) => {
  const canvasRef = useRef()
      , [ctx, setCtx] = useState(null)
      , [canvas, setCanvas] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas) {
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      setCtx(ctx)
      setCanvas(canvas)
    }

  }, [canvasRef, width, height])

  return [canvasRef, ctx, canvas]
}

const useCameraDevices = () => {
  const [devices, setDevices] = useState([])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(
        devices =>
          devices.filter(device => device.kind === 'videoinput')
      )
      .then(devices =>
        setDevices(devices)
      )
      .catch(err =>
        console.log(err)
      )
  }, [])

  return devices
}

const useCamera = (device, { width = 1280, height = 720 }) => {
  const videoRef = useRef()
      , [video, setVideo] = useState(null)

  useEffect(() => {
    const video = videoRef.current

    if (video && device) {
      const constraints = {
        width,
        height,
        deviceId: { exact: device.deviceId }
      }

      navigator.mediaDevices.getUserMedia({ video: constraints })
        .then(stream => {
          if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop())
            video.srcObject = null
          }
          video.srcObject = stream
          setVideo(video)
        })
        .catch(err => {
          alert('Camera not found')
          console.log(err)
        })
    }
  }, [videoRef, device, width, height])

  return [videoRef, video]
}

const useHands = obj => {
  const [hands, setHands] = useState(null)

  useEffect(() => {
    const hands = new Hands({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    })

    setHands(hands)
  }, [])

  useEffect(() => {
    if (hands && obj) {
      hands.setOptions(obj)
    }
  }, [obj, hands])

  return hands
}

const useBle = ({ service, characteristic }) => {
  const [ble, setBle] = useState(null)
      , [connectInfo, setConnectInfo] = useState(null)

  useEffect(() => {
    setConnectInfo({
      service,
      characteristic
    })
  }, [service, characteristic])

  const connect = async () => {
    const device = await window.navigator.bluetooth.requestDevice({
      filters: [{ services: [connectInfo.service || '4fafc201-1fb5-459e-8fcc-c5c9c331914f'] }]
    })

    const server = await device.gatt.connect()
        , service = await server.getPrimaryService(connectInfo.service || '4fafc201-1fb5-459e-8fcc-c5c9c331914f')
        , characteristic = await service.getCharacteristic(connectInfo.characteristic || 'beb5483e-36e1-4688-b7f5-ea07361b26a7')

    device.addEventListener('gattserverdisconnected', () => {
      setBle(null)
    })

    setBle({ device, server, service, characteristic })
  }

  const write = string => {
    const data = str2ab(string)
    ble.characteristic.writeValue(data)
  }

  return ({
    connect: connectInfo ? connect : null,
    disconnect: () => ble.server.disconnect(),
    isConnect: connectInfo ? !!ble : null,
    write: (connectInfo && ble && ble.characteristic && ble.characteristic.writeValue) ? write : null,
    ...(ble || {})
  })
}

const useControllBleDevice = ({ ble, signalEmulate, signalPredict }) => {
  const [isSingnalEmulate, setSingnalEmulate] = useState(false)

  useEffect(() => {
    if (!!Object.values(signalEmulate).find(value => value)) {
      setSingnalEmulate(true)
    } else {
      setSingnalEmulate(false)
    }
  }, [signalEmulate])

  useEffect(() => {
    if (ble.isConnect && isSingnalEmulate) {
      const timeId = setTimeout(() => {
        const predictEmulate = Object.keys(signalEmulate)
            .map(key => `${key}:${signalEmulate[key]}`).join(',')+','

        ble.write(predictEmulate)
      }, 100)

      return () => clearTimeout(timeId)
    }
  }, [ble, signalEmulate, isSingnalEmulate])

  useEffect(() => {
    if (ble.isConnect && !isSingnalEmulate) {
      const timeId = setTimeout(() => {
        const predictString = Object.keys(signalPredict)
          .map(key => `${key}:${signalPredict[key]}`).join(',')+','

        ble.write(predictString)
      }, 100)

      return () => clearTimeout(timeId)
    }
  }, [ble, signalPredict, isSingnalEmulate])
}

const useFindHandsVideoFrame = ({ hands, ctx, video, camDevice }) => {
  useEffect(() => {
    if (hands && ctx && video) {
      let isAllowSend = true
      const sendFrame = async () => {
        if (isAllowSend) {
          try {
            await hands.send({ image: video })
          } catch (e) {}
          setTimeout(sendFrame, 100)
        }
      }

      const timeId = setTimeout(() => {
        sendFrame()
      }, 5000)

      return () => {
        clearTimeout(timeId)
        isAllowSend = false
      }
    }
  }, [hands, ctx, video, camDevice])
}

const useMainHook = ({
  maxHands,
  modelComplexity,
  minDetectionConfidence,
  minTrackingConfidence,
  serviceBleDevice,
  characteristicBleDevice,
  camDevices,
  signalEmulate,
  signalPredict,
  camDevice,
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
}) => {
  const ble = useBle({
    service: serviceBleDevice,
    characteristic: characteristicBleDevice
  })

  useControllBleDevice({
    ble,
    signalEmulate,
    signalPredict
  })

  const [videoRef, video] = useCamera(camDevices[camDevice], {
    width: 1280,
    height: 720
  })

  const [canvasRef, ctx, canvas] = useCanvas({
    width: 1280 / 2,
    height: 720 / 2
  })

  const hands = useHands({
    maxNumHands: parseInt(maxHands) === (maxHands - 0) ? parseInt(maxHands) : 2,
    modelComplexity: parseInt(modelComplexity) === (modelComplexity - 0) ? parseInt(modelComplexity) : 1,
    minDetectionConfidence: parseFloat(minDetectionConfidence) === (minDetectionConfidence - 0) ? parseFloat(minDetectionConfidence) : 0.8,
    minTrackingConfidence: parseFloat(minTrackingConfidence) === (minTrackingConfidence - 0) ? parseFloat(minTrackingConfidence) : 0.8
  })

  useFindHandsVideoFrame({
    hands,
    ctx,
    video,
    camDevice
  })

  useEffect(() => {
    if (hands && ctx && canvas) {
      hands.onResults(results => {
        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

        if (results.multiHandLandmarks) {
          const signalNames = Object.keys(signals)

          const predicts = signalNames.reduce((ctx, signalName) => {
            ctx[signalName] = false
            return ctx
          }, {})

          for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 2 })

            if (signalNames.length > 0) {
              signalNames.forEach(signalName => {
                const signal = signals[signalName]

                const predict = signal.map(stack => {
                  return stack.points.map(({ x, y, z }, i) => {
                    const current = landmarks[i]

                    const baseX = stack.points[0].x - x
                        , baseY = stack.points[0].y - y
                        , baseZ = stack.points[0].z - z
                        , baseCX = landmarks[0].x - current.x
                        , baseCY = landmarks[0].y - current.y
                        , baseCZ = landmarks[0].z - current.z

                    const offsetX = parseFloat(maxOffsetX) === maxOffsetX - 0 ? ((maxOffsetX - 0) || 0.02) : 0.02
                        , offsetY = parseFloat(maxOffsetY) === maxOffsetY - 0 ? ((maxOffsetY - 0) || 0.02) : 0.02
                        , offsetZ = parseFloat(maxOffsetZ) === maxOffsetZ - 0 ? ((maxOffsetZ - 0) || 0.05) : 0.05

                    return (baseX > baseCX - offsetX && baseX < baseCX + offsetX) &&
                           (baseY > baseCY - offsetY && baseY < baseCY + offsetY) &&
                           (baseZ > baseCZ - offsetZ && baseZ < baseCZ + offsetZ)
                  }).find(cancelPoints => cancelPoints === false) !== false
                })

                const truePredict_ = predict.filter(p => p)

                if (truePredict_.length >= (parseFloat(truePredict) === truePredict - 0 ? ((truePredict - 0) || 3) : 3)) {
                  predicts[signalName] = true
                }

                if (truePredict_.length >= (parseFloat(lernTruePredict) === lernTruePredict - 0 ? ((lernTruePredict - 0) || 10) : 10) && isLernSignal) {
                  setSelectSignal(null)
                  setSignals(
                    s => ({
                      ...s,
                      [signalName]: [
                        ...s[signalName],
                        {
                          points: landmarks,
                          date: new Date() - 0
                        }
                      ]
                    })
                  )
                }
              })
            }

            if (isRecordSignal) {
              setSignals(
                s => ({
                  ...s,
                  [selectSignal]: [
                    ...s[selectSignal],
                    {
                      points: landmarks,
                      date: new Date() - 0
                    }
                  ]
                })
              )
            }
          }

          if (signalNames.length > 0) {
            setSignalPredict(predicts)
          }
        }

        ctx.restore()
      })
    }
  }, [hands, ctx, canvas, setSignals, setSignalPredict, setSelectSignal, isLernSignal, selectSignal, signals, isRecordSignal, maxOffsetX, maxOffsetY, maxOffsetZ, lernTruePredict, truePredict])

  return {
    videoRef,
    canvasRef,
    ble
  }
}

export {
  useCameraDevices,
  useCanvas,
  useMainHook
}
