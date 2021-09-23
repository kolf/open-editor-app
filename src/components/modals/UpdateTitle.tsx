import React, { ReactElement, useState } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import FindAndReplace from 'src/components/modals/FindAndReplace';

export type PositionType = 'content' | 'after' | 'before';

interface Props {
  onAdd: (addValue: string, positionType: PositionType) => void;
  onReplace: (findValue: string, replaceValue: string) => void;
}

interface State {
  positionType: PositionType;
  addValue?: string;
}

export default function UpdateTitle({ onAdd, onReplace }: Props): ReactElement {
  const [state, setState] = useState<State>({
    positionType: 'content'
  });

  const handleChange = (field, value) => {
    setState({
      ...state,
      [field]: value
    } as State);
  };

  return (
    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} autoComplete="off">
      <Form.Item label="标题内容" name="content">
        <>
          <Radio.Group
            defaultValue="content"
            style={{ paddingBottom: 6 }}
            onChange={e => {
              handleChange('positionType', e.target.value);
            }}
          >
            <Radio value="content">覆盖</Radio>
            <Radio value="after">前追加</Radio>
            <Radio value="before">后追加</Radio>
          </Radio.Group>
          <Input
            placeholder="请输入内容"
            style={{ width: 330 }}
            onChange={e => handleChange('addValue', e.target.value)}
          />
          <Button style={{ marginLeft: 4 }} onClick={e => onAdd(state.addValue, state.positionType)}>
            提交
          </Button>
        </>
      </Form.Item>

      <Form.Item label="查找&替换" name="findContent" style={{ paddingTop: 12 }}>
        <FindAndReplace onFinish={onReplace} />
      </Form.Item>
    </Form>
  );
}
