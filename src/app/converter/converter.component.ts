import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileUploadService } from '../file-upload.service';

declare var gifshot, $;

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit, OnDestroy {
  imageSource: string;
  uploadedFile: File;
  filePath: string = '';

  gifForm = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    width: new FormControl(),
    height: new FormControl(),
  });

  isUploading: boolean = false;
  isConverting: boolean = false;
  uploadBtnText = 'Upload';
  convertBtnText = 'Create GIF';
  hasGIF: boolean = false;
  downloadTrigger: any;

  subscriptions$: Subscription[] = [];

  constructor(private FileUploadService: FileUploadService) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions$.push(
      this.FileUploadService.deleteFile(this.filePath).subscribe((response) => {
        console.log(response);
      })
    );

    this.subscriptions$.forEach((s) => s.unsubscribe());
  }

  convertFile() {
    this.convertBtnText = 'Creating GIF...';
    this.isConverting = true;
    let video = document.createElement('video');
    video.preload = 'metadata';

    let videoDuration;

    const _this = this;
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      videoDuration = video.duration;

      // TODO: VALIDATION

      gifshot.createGIF(
        {
          video: `${environment.apiURL}${_this.filePath}`,
          numFrames:
            (_this.gifForm.get('end').value -
              _this.gifForm.get('start').value) *
            10,
          offset: _this.gifForm.get('start').value,
          gifWidth: _this.gifForm.get('width').value,
          gifHeight: _this.gifForm.get('height').value,
        },
        (obj) => {
          if (!obj.error) {
            _this.imageSource = obj.image;

            _this.downloadTrigger = $('<a>')
              .attr('href', _this.imageSource)
              .attr('download', _this.uploadedFile.name.split('.')[0] + '.gif')
              .appendTo('body');

            // _this.uploadedFile = null;
            _this.isConverting = false;
            _this.hasGIF = true;
            _this.convertBtnText = 'Create GIF';

            video.remove();
          }
        }
      );
    };

    video.src = URL.createObjectURL(this.uploadedFile);
  }

  uploadFile() {
    $('#customFile').val('');
    this.isUploading = true;
    this.uploadBtnText = 'Uploading...';
    this.subscriptions$.push(
      this.FileUploadService.uploadFile(this.uploadedFile).subscribe(
        (response: any) => {
          this.filePath = response.message;
          this.isUploading = false;
        }
      )
    );
  }

  fileBrowsed(event) {
    this.uploadedFile = event.target.files[0];
  }

  downloadGIF() {
    this.downloadTrigger[0].click();

    // this.downloadTrigger.remove();
  }
}
