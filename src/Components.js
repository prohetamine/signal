import { useEffect, useState, useRef } from 'react'
import { Hands } from '@mediapipe/hands'
import { drawConnectors } from '@mediapipe/drawing_utils'
import styled from 'styled-components'
import arrow from './assets/arrow.svg'
import arrowCards from './assets/arrow-cards.svg'
import cards from './assets/cards.svg'
import remove from './assets/remove.svg'
import notFoundCamera from './assets/not-found-camera.svg'
import logo from './assets/logo.svg'

const HAND_CONNECTIONS = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]]

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

const useCamera = device => {
  const videoRef = useRef()
      , [video, setVideo] = useState(null)

  useEffect(() => {
    const video = videoRef.current

    if (video && device) {
      const constraints = {
        width: 1280,
        height: 720,
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
  }, [videoRef, device])

  return [videoRef, video]
}

const useHands = obj => {
  const [hands, setHands] = useState(null)

  useEffect(() => {
    const hands = new Hands({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    })

    hands.setOptions(obj)
    setHands(hands)
  }, [])

  return hands
}

const str2ab = str => {
  const buf = new ArrayBuffer(str.length*2)
  let bufView = new Uint8Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

const PredictWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 10px;
  overflow-y: scroll;
  height: 341px;
`

const Predict = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  padding: 5px 8px;
  border-radius: 3px;
  margin-bottom: 5px;
`

const Main = styled.div`
  width: 100%;
  padding: 0px 47px;
  box-sizing: border-box;
`

const LogoWrapper = styled.div`
  width: 100%;
  height: 136px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Logo = (() => {
  const Image = styled.img`
    width: 271px;
    height: 90px;
    user-select: none;
  `

  return () => (
    <Image src={logo} />
  )
})()

const GitHubLink = styled.a`
  position: absolute;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 33px;
  line-height: 40px;
  background: linear-gradient(180deg, #888888 0%, #4A4A4A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  text-shadow: 0px 1px 3px rgba(147, 147, 147, 0.17);
  right: 47px;
  cursor: pointer;
  user-select: none;
`

const PanelsWrapper = styled.div`
  display: flex;
  @media (max-width: 1416px) {
    flex-direction: column;
    align-items: center;
  }
`

const Panel = styled.div`
  margin-top: 38px;
  margin-left: 52px;

  @media (max-width: 1416px) {
    margin-left: 0px;
  }
`

const PanelTitle = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 23px;
  line-height: 28px;
  color: #505050;
  margin-bottom: 17px;
`

const Input = styled.input`
  width: 252px;
  height: 60px;
  box-sizing: border-box;
  background: #FFFFFF;
  box-shadow: 0px 2px 9px rgba(41, 41, 41, 0.2);
  border-radius: 9px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  color: #505050;
  padding: 16px 15px;
  border: none;
  outline: none;
  transition: 0.1s;

  &::placeholder{
    color: #BDBDBD;
  }

  &:hover {
    background: #F2F2F2;
  }
`

const Button = styled.button`
  height: 60px;
  box-sizing: border-box;
  background: #FFFFFF;
  box-shadow: 0px 2px 9px rgba(41, 41, 41, 0.2);
  border-radius: 9px;
  padding: 16px 33px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  border: none;
  outline: none;
  color: #505050;
  transition: 0.1s;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #F2F2F2;
  }
`

const VideoWrapper = styled.div`
  position: relative;
  width: 634px;
  height: 356px;
  background: url(${notFoundCamera});
  filter: drop-shadow(0px 2px 9px rgba(41, 41, 41, 0.2));
  border-radius: 9px;
  overflow: hidden;
`

const OverflowMainSettings = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: #000000b0;
  z-index: 99999999999999;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`

const MainSettings = styled.div`
  background: radial-gradient(54.78% 89.94% at 49.06% 10.06%, #2DE000 0%, #B3F200 100%);
  border-radius: 13px;
  padding: 40px;
  overflow-y: auto;
  height: 80vh;
`

const Select = (() => {
  const Body = styled.div`
    position: relative;
    height: 60px;
    box-sizing: border-box;
    background: #FFFFFF;
    box-shadow: 0px 2px 9px rgba(41, 41, 41, 0.2);
    border-radius: 9px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    border: none;
    outline: none;
    color: #505050;
    transition: 0.1s;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: #F2F2F2;
    }
  `

  const Wrapper = styled.div`
    position: absolute;
    height: 60px;
    overflow: hidden;
    border-radius: 9px;
  `

  const TopItemWrapper = styled.div`
    box-sizing: border-box;
    height: 60px;
    display: inline-flex;
    padding: 16px 33px;
    width: 100%;
    justify-content: center;
    align-items: center;
  `

  const ArrowIcon = styled.div`
    position: absolute;
    right: 33px;
    background-image: url(${arrow});
    background-size: cover;
    width: 20px;
    height: 20px;
    transition: 0.1s;
    transform: rotateX(${props => props.isOpen ? 0 : 180}deg);
  `

  const Item = styled.div`
    box-sizing: border-box;
    height: 60px;
    display: inline-flex;
    padding: 16px 33px;
    width: 100%;
    justify-content: center;
    align-items: center;
    background: #ffffff;

    &:hover {
      background: #F2F2F2;
    }
  `

  return ({ placeholder, items, value, width, onChange }) => {
    const [isOpen, setOpen] = useState(false)

    const select = items.find(item => item.value === value)

    return (
      <Body
        onClick={() => setOpen(s => items.length > 0 ? !s : false)}
        style={{
          width: '100%',
          minWidth: `${width}px`,
          maxWidth: `${width}px`,
          zIndex: isOpen ? 9999 : 0
        }}
        onBlur={() => setOpen(false)}
        tabIndex="-1"
      >
        <Wrapper
          style={
            isOpen
              ? ({
                width: '100%',
                minWidth: `${width}px`,
                maxWidth: `${width}px`,
                height: `${((items ? items.length : 0) * 60) + 60}px`,
                background: '#fff'
              })
              : ({
                width: '100%',
                minWidth: `${width}px`,
                maxWidth: `${width}px`,
                height: '60px'
              })
          }
        >
          <TopItemWrapper>
            {select ? select.label : placeholder}
            <ArrowIcon isOpen={isOpen} />
          </TopItemWrapper>
          {
            items.map((item, i) => (
              <Item onClick={() => onChange(item.value)} key={item.value}>{item.label}</Item>
            ))
          }
        </Wrapper>
      </Body>
    )
  }
})()

const SignalsStorageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const SignalsSimulateWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const SignalCardBody = styled.div`
  width: 166px;
  min-width: 166px;
  max-width: 166px;
  height: 166px;
  min-height: 166px;
  max-height: 166px;
  background: #FFFFFF;
  box-shadow: 0px 2px 9px rgba(41, 41, 41, 0.2);
  border-radius: 9px;
  margin-right: 22px;
  margin-bottom: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  user-select: none;
`

const LabelSignalCardBig = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 29px;
  line-height: 35px;
  display: flex;
  align-items: center;
  aling-text: center;
  color: #505050;
`

const SignalCardGhost = (() => {
  const Icon = styled.div`
    background-image: url(${cards});
    background-size: cover;
    width: 68.55px;
    height: 37.78px;
    margin-bottom: 11.22px;
  `

  return ({ children, onClick }) => (
    <SignalCardBody
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Icon />
      <LabelSignalCardBig>{children}</LabelSignalCardBig>
    </SignalCardBody>
  )
})()

const SignalCard = (() => {
  const RemoveIcon = styled.div`
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
    background-image: url(${remove});
    background-size: cover;
    width: 22.63px;
    height: 22.63px;
  `

  const Signal = styled.div`
    position: absolute;
    left: 10px;
    bottom: 10px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    color: #505050;
  `

  return ({ data, signal, index, number, onRemove }) => {
    const [canvasRef, ctx] = useCanvas({
      width: 166,
      height: 166
    })

    useEffect(() => {
      if (ctx) {
        ctx.clearRect(0, 0, 166, 166)
        drawConnectors(
          ctx,
          data.points,
          HAND_CONNECTIONS,
          {
            color: '#505050',
            lineWidth: 3
          }
        )
      }
    }, [ctx, data])

    return (
      <SignalCardBody>
        <RemoveIcon onClick={() => onRemove(index)} />
        <Signal>{signal} #{number}</Signal>
        <canvas ref={canvasRef}></canvas>
      </SignalCardBody>
    )
  }
})()


const RecButton = (() => {
  const RedCircle = styled.div`
    width: 14px;
    height: 14px;
    background: #ff0000;
    border-radius: 100%;
    margin-left: 7px;
    animation: 1s blink ease infinite;
  `

  const GrayCircle = styled.div`
    width: 14px;
    height: 14px;
    background: #cccccc;
    border-radius: 100%;
    margin-left: 7px;
  `

  return props => {
    return (
      <Button
        {...props}
        style={
          props.style
            ? ({
              ...props.style,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            })
            : ({
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            })}
      >
        REC
        {
          props.isRecordSignal
            ? (
              <RedCircle />
            )
            : (
              <GrayCircle />
            )
        }
      </Button>
    )
  }
})()

const LernButton = (() => {
  const OrangeCircle = styled.div`
    width: 14px;
    height: 14px;
    background: #ffaa00;
    border-radius: 100%;
    margin-left: 7px;
  `

  const GrayCircle = styled.div`
    width: 14px;
    height: 14px;
    background: #cccccc;
    border-radius: 100%;
    margin-left: 7px;
  `

  return props => {
    return (
      <Button
        {...props}
        style={
          props.style
            ? ({
              ...props.style,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            })
            : ({
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            })}
      >
        Auto lern
        {
          props.isLernSignal
            ? (
              <OrangeCircle />
            )
            : (
              <GrayCircle />
            )
        }
      </Button>
    )
  }
})()

const LoadConfigCard = (() => {
  const Icon = styled.div`
    background-image: url(${arrowCards});
    background-size: cover;
    width: 27.29px;
    height: 35.09px;
    transform: rotateX(180deg);
    margin-bottom: 11.22px;
  `

  return ({ onChange }) => {
    const fileRef = useRef()
    const [json, setJson] = useState(null)
    const [filename, setFilename] = useState(null)

    useEffect(() => {
      const node = fileRef.current

      if (node) {
        const handler = event => {
          try {
            const input = event.target

            const reader = new FileReader()
            reader.onload = () => {
              try {
                const json = JSON.parse(reader.result)
                setJson(json)
                setFilename(input.files[0].name)
              } catch (err) {
                setJson(null)
                alert('Error: config | ' + err.stack)
              }
            }

            reader.readAsText(input.files[0])
          } catch (e) {}
        }

        node.addEventListener('change', handler)
        return () => node.removeEventListener('change', handler)
      }
    }, [fileRef])

    useEffect(() => {
      if (json && filename) {
        onChange({ json, filename })
        setJson(null)
        setFilename(null)
      }
    }, [json, filename, onChange])

    return (
      <label htmlFor='load-signals-config'>
        <input hidden id='load-signals-config' ref={fileRef} type='file' />
        <SignalCardBody style={{ cursor: 'pointer' }}>
          <Icon />
          <LabelSignalCardBig>Load</LabelSignalCardBig>
        </SignalCardBody>
      </label>
    )
  }
})()

const DownloadConfigCard = (() => {
  const Icon = styled.div`
    background-image: url(${arrowCards});
    background-size: cover;
    width: 27.29px;
    height: 35.09px;
    margin-bottom: 11.22px;
  `

  return ({ data, filename }) => {
    const fileRef = useRef()

    useEffect(() => {
      const node = fileRef.current

      if (node && data && filename) {
        const handler = () => {
          const link = document.createElement('a')
          link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)))
          link.setAttribute('download', filename)
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }

        node.addEventListener('click', handler)
        return () => node.removeEventListener('click', handler)
      }
    }, [fileRef, data, filename])

    return (
      <SignalCardBody
        ref={fileRef}
        style={{ cursor: 'pointer' }}
      >
        <Icon />
        <LabelSignalCardBig>Download</LabelSignalCardBig>
      </SignalCardBody>
    )
  }
})()

export {
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
  VideoWrapper,
  Select,
  SignalsStorageWrapper,
  SignalsSimulateWrapper,
  SignalCard,
  SignalCardGhost,
  PredictWrapper,
  Predict,
  OverflowMainSettings,
  MainSettings,
  LoadConfigCard,
  DownloadConfigCard,
  useCameraDevices,
  useCamera,
  useCanvas,
  useHands,
  HAND_CONNECTIONS,
  str2ab
}
