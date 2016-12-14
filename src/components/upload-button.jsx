/**
 * Created by kiny on 16/10/7.
 */

import React, { PropTypes } from 'react';
import { SUCCESS } from '../server/define';
import ss from '../lib/SimpleAjaxUploader';

export default class UploadButton extends React.Component {
  static propTypes = {
    uploadURL: PropTypes.string.isRequired,
    allowExtenstions: PropTypes.arrayOf(PropTypes.string),
    fileValue: PropTypes.string,
    onSuccess: PropTypes.func,
  };

  static defaultProps = {
    allowExtenstions: ['jpg', 'jpeg', 'png', 'gif'],
  };

  state = {
    statusText: '',
  };

  componentDidMount() {
    const { uploadURL, allowExtenstions } = this.props;
    this.uploader = new ss.SimpleUpload({
      button: 'uploadButton', // file upload button
      url: uploadURL, // server side handler
      name: 'uploadfile', // upload parameter name
      progressUrl: 'uploadProgress.php', // enables cross-browser progress support (more info below)
      responseType: 'json',
      allowedExtensions: allowExtenstions,
      maxSize: 1024, // kilobytes
      hoverClass: 'ui-state-hover',
      focusClass: 'ui-state-focus',
      disabledClass: 'ui-state-disabled',
      onSubmit: (filename, extension) => {
        console.log(filename, extension);
        this.setState({ statusText: '上传中...' });
      },
      onComplete: (filename, response) => {
        if (!response) {
          this.setState({ statusText: '上传失败!' });
        }
        const { src, status } = response;
        if (status === SUCCESS) {
          this.file.value = src;
          this.setState({ statusText: '上传成功!' });
        }
        this.props.onSuccess(response);
      },
    });
  }

  componentWillUnmount() {
    this.uploader.destroy();
  }

  render() {
    return (
      <span>
        <input
          ref={(ref) => {
            this.file = ref;
          }} type="hidden" name="file"
          defaultValue={this.props.fileValue}
        />
        <input type="button" className="button small primary" id="uploadButton" value="上传文件" />
        <span>{this.state.statusText}</span>
      </span>
    );
  }
}
