import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { Container, Row, Col, Button } from 'react-bootstrap';

const VideoRecorder = () => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isRecording) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRecording]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleDownload = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recorded-video.webm';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getTracks().find((track) => track.kind === 'audio');
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <Webcam
            audio={true}
            ref={videoRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'user' }}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>
      <Row className="mt-3 justify-content-center">
        <Col md={4}>
          <div className="d-flex justify-content-center align-items-center">
            <Button
              variant={isRecording ? 'danger' : 'success'}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            <span className="mx-3">{formatTime(timer)}</span>
            <Button variant="secondary" onClick={toggleMute}>
              {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="mt-3 justify-content-center">
        <Col md={4}>
          {!isRecording && recordedChunks.length > 0 && (
            <Button variant="primary" onClick={handleDownload} block>
              Download Recording
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default VideoRecorder;