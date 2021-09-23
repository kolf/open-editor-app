import React, { ReactElement, useState } from 'react';
import { Input, Button } from 'antd';

interface Props {
  onFinish: (findValue: string, replaceValue: string) => void;
}

export default function FindAndReplace({ onFinish }: Props): ReactElement {
  const [value, setValue] = useState<string>('');
  const [replaceValue, setReplaceValue] = useState<string>('');

  return (
    <div style={{ paddingRight: 66, position: 'relative' }}>
      <Input placeholder="请输入查找的内容" style={{ marginBottom: 8 }} onChange={e => setValue(e.target.value)} />
      <Input placeholder="请输入要替换的内容" onChange={e => setReplaceValue(e.target.value)} />
      <Button style={{ position: 'absolute', right: 0, top: 19 }} onClick={e => onFinish(value, replaceValue)}>
        提交
      </Button>
    </div>
  );
}
