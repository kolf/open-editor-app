import { message } from "antd";

/**
 * select and copy node content
 * @param text
 * @param e
 */
export const createTextCopyAndSelection = (
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  text?: string,
) => {
  function copy(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success("复制成功");
      })
      .catch((e) => message.info(e));
  }

  if (getSelection) {
    const selection = getSelection();
    const range = document.createRange();
    range.selectNodeContents(e.target as Node);
    selection.removeAllRanges();
    selection.addRange(range);

    copy(text || (e.target as HTMLElement).innerText);
  } else {
    message.info("该浏览器不支持点击复制到剪贴板");
  }
};