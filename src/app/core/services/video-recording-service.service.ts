import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';

interface RecordedVideoOutput {
  blob: Blob;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoRecordingService {

  constructor() { }


  private stream !: any;
  private recorder !: any;
  private interval !: any;
  private startTime !: any;
  private _stream = new Subject<MediaStream>();
  private _recorded = new Subject<RecordedVideoOutput>();
  private _recordedUrl = new Subject<string>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();
  private videoConf = { video: { facingMode:"user", width: 320 }, audio: true}



  getRecordedUrl(): Observable<string> {
    return this._recordedUrl.asObservable();
  }

  getRecordedBlob(): Observable<RecordedVideoOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  getStream(): Observable<MediaStream> {
    return this._stream.asObservable();
  }

  startRecording() {
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this._recordingTime.next('00:00');
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia(this.videoConf).then((stream: MediaStream) => {
        this.stream = stream;
        this.record();
        resolve(this.stream);
      }).catch(() => {
        this._recordingFailed.next('');
        reject;
      });
    });
  }

  private record() {
    this.recorder = new RecordRTC(this.stream, {
      type: 'video',
      mimeType: 'video/webm',
      bitsPerSecond: 128000,
      frameInterval: 120,
    });
    this.recorder.startRecording();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this._recordingTime.next(time);
        this._stream.next(this.stream);
      },
      500
    );
  }

  private toString(value: string | number) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording() {
    this.recorder?.stopRecording((audioVideoWebMURL: any) => {
      const recordedBlob = this.recorder.getBlob();
      const recordedName = encodeURIComponent('audio_' + new Date().getTime() + '.webm');

      this._recorded.next({
        blob: recordedBlob,
        name: recordedName,
      });
  
      this.stopMedia();
    });
  }
  
  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach((track: { stop: () => any; }) => track.stop());
        this.stream.getVideoTracks().forEach((track: { stop: () => any; }) => track.stop());
        this.stream.stop();
        this.stream = null;
      }
    }
  }

  public abortRecording() {
    this.stopMedia();
  }

}
