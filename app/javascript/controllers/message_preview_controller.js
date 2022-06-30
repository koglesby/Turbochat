import { Controller } from '@hotwired/stimulus';

/**
 *  This controller is responsible for displaying the message preview(s).
 *  @class MessagePreviewController
 */
export default class extends Controller {
  connect() {}

  /**
   * Creates the preview panel displayed above the message input.
   * This panel is used to display the file(s) this are being uploaded.
   */
  preview() {
    this.clearPreviews();
    for (let i = 0; i < this.targets.element.files.length; i++) {
      let file = this.targets.element.files[i];
      const reader = new FileReader();
      this.createAndDisplayFilePreviewElements(file, reader);
    }
    this.toggleVisibility();
  }
  /**
   * Toggle visibility of the attachment preview div
   */
  toggleVisibility() {
    let preview = document.getElementById('attachment-previews');
    preview.classList.toggle('d-none');
  }

  /**
   *  Creates and displays the preview elements for the file.
   *  this is used to display the file in the message preview.
   *  @param {*} file - The file to be previewed
   *  @param {*} reader - the FileReader object
   */
  createAndDisplayFilePreviewElements(file, reader) {
    reader.onload = () => {
      let element = this.constructPreviews(file, reader);
      element.src = reader.result;
      element.setAttribute('href', reader.result);
      element.setAttribute('target', '_blank');
      element.classList.add('attachment-preview');

      document.getElementById('attachment-previews').appendChild(element);
    };
    reader.readAsDataURL(file);
  }
  /**
   * Contructs the preview element for the file
   * these elements are used to display the file in the message preview.
   * supported file types are:
   * Audio: mp3, wav
   * Video: mp4, quicktime
   * Image: jpg, png, gif
   * Default: anything else
   * @param {*} file - the file to be previewed
   * @param {*} reader - the FileReader object
   * @returns {HTMLElement} - the element to be added to the DOM
   */

  constructPreviews(file, reader) {
    let element;
    let cancelFunction = (e) => this.removePreview(e);
    // switch (file.type) {
    //   case 'image/jpeg':
    //   case 'image/png':
    //   case 'image/gif':
    //     element = this.createImageElement(cancelFunction, reader);
    //     break;
    //   case 'video/mp4':
    //   case 'video/quicktime':
    //     element = this.createVideoElement(cancelFunction);
    //     break;
    //   case 'audio/mpeg':
    //   case 'audio/mp3':
    //   case 'audio/wav':
    //     element = this.createAudioElement(cancelFunction);
    //     break;
    //   default:
    //     element = this.createDefaultElement(cancelFunction);
    // }
    // element.dataset.filename = file.name;
    // return element;

    const CREATE_IMAGE_EL = this.createImageElement(cancelFunction, reader);
    const CREATE_VIDEO_EL = this.createVideoElement(cancelFunction);
    const CREATE_AUDIO_EL = this.createAudioElement(cancelFunction);

    const fileTypeMap = {
      'image/jpeg': CREATE_IMAGE_EL,
      'image/png': CREATE_IMAGE_EL,
      'image/gif': CREATE_IMAGE_EL,
      'video/mp4': CREATE_VIDEO_EL,
      'video/quicktime': CREATE_VIDEO_EL,
      'audio/mpeg': CREATE_AUDIO_EL,
      'audio/mp3': CREATE_AUDIO_EL,
      'audio/wav': CREATE_AUDIO_EL,
      default: this.createDefaultElement(cancelFunction),
    };

    element = fileTypeMap[file.type] || fileTypeMap['default'];
    element.dataset.filename = file.name;
    return element;
  }

  /**
   * @param {*} cancelFunction - The function to be called when the cancel button is clicked
   * @param {*} reader - the FileReader object
   * @returns {HTMLElement} - the element to be added to the DOM
   */
  createImageElement(cancelFunction, reader) {
    let cancelUploadButton, element;
    const image = document.createElement('img');
    image.setAttribute('style', 'background-image: url(' + reader.result + ')');
    image.classList.add('preview-image');
    element = document.createElement('div');
    element.classList.add('attachment-image-container', 'file-removal');
    element.appendChild(image);
    cancelUploadButton = document.createElement('i');
    cancelUploadButton.classList.add(
      'bi',
      'bi-x-circle-fill',
      'cancel-upload-button'
    );
    cancelUploadButton.onclick = cancelFunction;
    element.appendChild(cancelUploadButton);
    return element;
  }
  createAudioElement(cancelFunction) {
    let cancelUploadButton, element;
    element = document.createElement('i');
    element.classList.add(
      'bi',
      'bi-file-earmark-music-fill',
      'audio-preview-icon',
      'file-removal'
    );
    cancelUploadButton = document.createElement('i');
    cancelUploadButton.classList.add(
      'bi',
      'bi-x-circle-fill',
      'cancel-upload-button'
    );
    cancelUploadButton.onclick = cancelFunction;
    element.appendChild(cancelUploadButton);
    return element;
  }
  createVideoElement(cancelFunction) {
    let cancelUploadButton, element;
    element = document.createElement('i');
    element.classList.add(
      'bi',
      'bi-file-earmark-play-fill',
      'video-preview-icon',
      'file-removal'
    );
    cancelUploadButton = document.createElement('i');
    cancelUploadButton.classList.add(
      'bi',
      'bi-x-circle-fill',
      'cancel-upload-button'
    );
    cancelUploadButton.onclick = cancelFunction;
    element.appendChild(cancelUploadButton);
    return element;
  }
  createDefaultElement(cancelFunction) {
    let cancelUploadButton, element;
    element = document.createElement('i');
    element.classList.add(
      'bi',
      'bi-file-check-fill',
      'file-preview-icon',
      'file-removal'
    );
    cancelUploadButton = document.createElement('i');
    cancelUploadButton.classList.add(
      'bi',
      'bi-x-circle-fill',
      'cancel-upload-button'
    );
    cancelUploadButton.onclick = cancelFunction;
    element.appendChild(cancelUploadButton);
    return element;
  }

  removePreview(event) {
    const target = event.target.parentNode.closest('.attachment-preview');
    const dataTransfer = new DataTransfer();
    let fileInput = document.getElementById('message_attachments');
    let files = fileInput.files;
    let filesArray = Array.from(files);

    filesArray = filesArray.filter((file) => {
      let filename = target.dataset.filename;
      return file.name !== filename;
    });
    target.parentNode.removeChild(target);
    filesArray.forEach((file) => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;

    if (filesArray.length === 0) {
      this.toggleVisibility();
    }
  }

  /**
   * Clear all preview elements after submit
   */
  clearPreviews() {
    document.getElementById('attachment-previews').innerHTML = '';

    let preview = document.getElementById('attachment-previews');
    preview.classList.add('d-none');
  }
}
