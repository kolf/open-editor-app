import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, ConfigProvider } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal/Modal';
import zhCN from 'antd/lib/locale/zh_CN';

const IS_REACT_16 = !!ReactDOM.createPortal;

interface IModleProps extends ModalFuncProps {
  footer?: React.ReactNode;
  autoIndex?: boolean;
  dragable?: boolean;
}

class Mod extends React.Component<IModleProps> {
  private container: any;
  private header: any;

  static defaultProps = {
    autoIndex: true,
    dragable: true,
    style: {
      top: 50
    },
    isMobile: false
  };

  created = false;
  simpleClass = Math.random().toString(36).substring(2);

  componentDidMount() {
    this.create(this.props.visible);
  }

  UNSAFE_componentWillReceiveProps({ visible }) {
    if (visible && visible !== this.props.visible) {
      this.create(visible);
      this.container && this.toTop();
    }
  }

  componentWillUnmount() {
    this.removeHandleMove();
    window.removeEventListener('mouseup', this.removeHandleUp, false);
  }

  get bodyMaxHeight() {
    return window.innerHeight - this.props.style.top - (this.props.footer === null ? 80 : 130);
  }

  handleMove = e => {
    const { top, left, right, width } = this.container.getBoundingClientRect();
    this.container.style.top = `${top + e.movementY}px`;
    this.container.style.left = `${left + e.movementX}px`;

    if (top + e.movementY > window.innerHeight - 50) this.container.style.top = `${window.innerHeight - 50}px`;
    if (top + e.movementY < 0) this.container.style.top = 0;
    if (right + e.movementX > window.innerWidth) this.container.style.left = `${window.innerWidth - width}px`;
    if (left + e.movementX < 0) this.container.style.left = 0;
  };

  removeHandleMove = () => {
    window.removeEventListener('mousemove', this.handleMove, false);
  };

  removeHandleUp = () => {
    document.body.onselectstart = () => true;
    this.removeHandleMove();
  };

  toTop = () => {
    const autoIndexArr = document.getElementsByClassName('autoIndex');
    if (autoIndexArr.length < 1) return false;
    let max = 0;
    for (let i = 0; i < autoIndexArr.length; i++) {
      const zIndex = parseInt((autoIndexArr[i] as HTMLElement).style.zIndex || '1000');
      if (zIndex > max) max = zIndex;
    }
    this.container.style.zIndex = max + 1;
  };

  create = visible => {
    if (this.created) return false;
    const { title, dragable, autoIndex, style, width, isMobile } = this.props;
    if (title && dragable && visible) {
      this.created = true;
      const timer = setTimeout(() => {
        clearTimeout(timer);
        this.container = document.getElementsByClassName(this.simpleClass)[0];
        if (!autoIndex) {
          this.container = this.container.getElementsByClassName('ant-modal')[0];
          this.container.style.paddingBottom = 0;
          this.container.style.display = 'inline-block';
          this.container.style.left = `${(window.innerWidth - (width || 520)) / 2}px`;
        } else {
          this.container.style.right = 'auto';
          this.container.style.overflow = 'visible';
          this.container.style.bottom = 'auto';
          this.container.style.left = `${(window.innerWidth - (width || 520)) / 2}px`;
          this.container.style.top = `${style.top}px`;
          this.container.addEventListener('mousedown', this.toTop, false);
          this.toTop();
        }
        this.header = this.container.getElementsByClassName('ant-modal-header')[0];
        this.header.style.cursor = 'all-scroll';
        this.header.onmousedown = () => {
          document.body.onselectstart = () => false;
          window.addEventListener('mousemove', this.handleMove, false);
        };
        window.addEventListener('mouseup', this.removeHandleUp, false);
      }, 0);
    }

    if (isMobile) {
      // 移动端弹窗兼容
      // 注意点：移动端将dragable同时修改为false
      this.container = document.getElementsByClassName(this.simpleClass)[0];
      const containerChild = this.container.children[0];
      containerChild.style.display = 'block';
      containerChild.style.margin = '20px';
    }
  };

  render() {
    const { children, wrapClassName = '', autoIndex, style, ...otherProps } = this.props;
    return (
      <ConfigProvider locale={zhCN}>
        <Modal
          {...otherProps}
          wrapClassName={`${wrapClassName} ${this.simpleClass} ${(autoIndex && 'autoIndex') || ''}`}
          mask={!autoIndex}
          style={
            (autoIndex && {
              top: 0,
              left: 0,
              width: 'auto',
              height: 'auto',
              paddingBottom: 0,
              display: 'inline-block'
            }) ||
            style
          }
          bodyStyle={{
            maxHeight: this.bodyMaxHeight,
            overflowY: 'auto'
          }}
        >
          {children}
        </Modal>
      </ConfigProvider>
    );
  }
}

export default function modal(config: IModleProps) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let currentConfig = {
    ...config,
    onCancel() {
      close();
      config.onCancel && config.onCancel();
    },
    visible: true
  };

  function close(...args) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: destroy.bind(this, ...args)
    };
    if (IS_REACT_16) {
      render(currentConfig);
    } else {
      destroy(...args);
    }
  }
  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig
    };
    render(currentConfig);
  }
  function confirmLoading() {
    update({
      confirmLoading: true
    });
  }
  function destroy(...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const triggerCancel = args && args.length && args.some(arg => arg && arg.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
  }
  function render(props) {
    ReactDOM.render(<Mod {...props}>{props.content}</Mod>, div);
  }

  render(currentConfig);
  return {
    close,
    update,
    confirmLoading
  };
}
