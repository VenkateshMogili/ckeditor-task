import { Component } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'editor';
  public Editor = ClassicEditor;
  // public isDisabled = false;
  flag: boolean = false;
  count: number = 0;
  // toggleDisabled() {
  //   this.isDisabled = !this.isDisabled
  // }
  public model = {
    editorData: '<p id="hello">Hello world!</p>'
  };

  public config = {
    removePlugins: ['MediaEmbed', 'Link'], mediaEmbed: {}
  }

  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      return new UploadAdapter(loader);;
    };
  }
  click(editor) {
    if (editor.target.accept === "image/jpeg,image/png,image/gif,image/bmp,image/webp,image/tiff") {
      this.flag = true;
    }
  }
  public onChange({ editor }: ChangeEvent) {
    if (this.flag === true) {
      this.count++;
    }
    if (this.flag === true && this.count === 6) {
      const pos = editor.model.document.selection.getLastPosition();
      if (pos.nodeBefore.name === "image") {
        editor.model.change(writer => {
          writer.setSelection(writer.createPositionAt(pos, 'end'));
        });
      }
      this.flag = false;
      this.count = 0;
    }
  }

  // public onChange({ editor }: ChangeEvent) {

  //   const data = editor.getData();

  //   console.log(data);
  //   // if (data.includes("image")) {
  //   //   editor.model.change(writer => {
  //   //     writer.setSelection(writer.createPositionAt(editor.model.document.getRoot(), 'end'));
  //   //   });
  //   // }
  //   // editor.model.document.on('change:data', () => {
  //   //   console.log('The data has changed!');
  //   //   editor.model.change(writer => {
  //   //     // writer.insertText('Plain text', editor.model.document.selection.getLastPosition());
  //   //     writer.setSelection(writer.createPositionAt(editor.model.document.getRoot(), 'end'));
  //   //   });
  //   // });

  // }
}

class UploadAdapter {
  private loader;
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        var myReader = new FileReader();
        myReader.onloadend = (e) => {
          resolve({ default: myReader.result });
        }

        myReader.readAsDataURL(file);
        const event = new KeyboardEvent("keypress", {
          "key": "Enter"
        });
        document.dispatchEvent(event);
      }));
  };
  abort() {
    // Reject the promise returned from the upload() method.
    alert("canceled");
  }
}
