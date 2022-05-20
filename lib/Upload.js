import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Button } from 'antd';
import { omit, flatten, isString, isFunction } from 'lodash';
import filesize from 'filesize';
import { Image } from '@ke/table';
import { LoadingOutlined, PlusOutlined } from './Icons';
import { getIconButtonProps } from './util';

const getBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = error => {
            reject(error);
        };
    });
};

const getFileList = value => {
    return flatten([value])
        .filter(Boolean)
        .map(v => {
            if (isString(v)) {
                return {
                    url: v,
                    name: v
                };
            }
            return {
                name: v.url,
                ...v
            };
        });
};

class Index extends Component {
    static displayName = 'DynamicFormUpload';

    static defaultProps = {
        limit: 1 // 文件数量
    };

    static propTypes = {
        limit: PropTypes.number,
        value: PropTypes.any,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            fileList: getFileList(props.value),
            previewVisible: false,
            previewImage: ''
        };
    }

    handleChange = ({ fileList }) => {
        const { props } = this;
        const { limit, onChange } = props;
        this.setState({ fileList });
        if (isFunction(onChange)) {
            if (limit === 1) {
                onChange(fileList[0]);
            } else {
                onChange(fileList);
            }
        }
    };

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true
        });
    };

    getUploadButton = () => {
        const { props, state } = this;
        const { limit, listType } = props;
        const { fileList } = state;
        if (fileList.length >= limit) {
          return null
        }
        if (listType === 'picture-card') {
            return (
                <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>上传</div>
                </div>
            );
        }
        return <Button {...getIconButtonProps('upload')}>上传</Button>;
    };

    render() {
        const { props, state } = this;
        const { limit } = props;
        const { loading, fileList, previewVisible, previewImage } = state;

        const UploadProps = omit(props, ['value', 'onChange', 'limit']);

        return (
            <>
                <Upload
                    fileList={fileList}
                    onChange={this.handleChange}
                    onPreview={props.onPreview || this.handlePreview}
                    {...UploadProps}
                >
                    {this.getUploadButton()}
                </Upload>
                <Image
                    width={200}
                    style={{ display: 'none' }}
                    src={previewImage}
                    preview={{
                        visible: previewVisible,
                        src: previewImage,
                        onVisibleChange: value => {
                            this.setState({
                                previewVisible: value
                            });
                        }
                    }}
                />
            </>
        );
    }
}

export default Index;
