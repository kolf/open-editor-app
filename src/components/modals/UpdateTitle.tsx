import React, { ReactElement, useState } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import FindAndReplace from 'src/components/modals/FindAndReplace';
import { useIntl, FormattedMessage } from 'react-intl';

export type PositionType = 'content' | 'after' | 'before';

interface Props {
  onAdd: (addValue: string, positionType: PositionType) => void;
  onReplace: (findValue: string, replaceValue: string) => void;
}

interface State {
  positionType: PositionType;
  addValue?: string;
}

export default React.memo(function UpdateTitle({ onAdd, onReplace }: Props): ReactElement {
  const { formatMessage } = useIntl();
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
    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} autoComplete="off">
      <Form.Item label={formatMessage({ id: 'findAndReplace.title' })} name="content">
        <>
          <Radio.Group
            defaultValue="content"
            style={{ paddingBottom: 6 }}
            onChange={e => {
              handleChange('positionType', e.target.value);
            }}
          >
            <Radio value="content">
              <FormattedMessage id="findAndReplace.positionType.content" />
            </Radio>
            <Radio value="after">
              <FormattedMessage id="findAndReplace.positionType.after" />
            </Radio>
            <Radio value="before">
              <FormattedMessage id="findAndReplace.positionType.before" />
            </Radio>
          </Radio.Group>
          <Input
            placeholder={formatMessage({ id: 'input.placeholder' })}
            style={{ width: 298 }}
            onChange={e => handleChange('addValue', e.target.value)}
          />
          <Button style={{ marginLeft: 2 }} onClick={e => onAdd(state.addValue, state.positionType)}>
            <FormattedMessage id="modal.submitText" />
          </Button>
        </>
      </Form.Item>

      <Form.Item label={formatMessage({ id: 'findAndReplace' })} name="findContent" style={{ paddingTop: 12 }}>
        <FindAndReplace onFinish={onReplace} />
      </Form.Item>
    </Form>
  );
});
