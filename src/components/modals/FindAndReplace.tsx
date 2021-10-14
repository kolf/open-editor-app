import React, { ReactElement, useState } from 'react';
import { Input, Button } from 'antd';
import { useIntl, FormattedMessage } from 'react-intl';

interface Props {
  onFinish: (searchValue: string, replaceValue: string) => void;
}

export default React.memo(function FindAndReplace({ onFinish }: Props): ReactElement {
  const { formatMessage } = useIntl();
  const [searchValue, setSearchValue] = useState<string>('');
  const [replaceValue, setReplaceValue] = useState<string>('');

  return (
    <div style={{ paddingRight: 72, position: 'relative' }}>
      <Input
        placeholder={formatMessage({ id: 'findAndReplace.search.placeholder' })}
        style={{ marginBottom: 8 }}
        onChange={e => setSearchValue(e.target.value)}
      />
      <Input
        placeholder={formatMessage({ id: 'findAndReplace.replace.placeholder' })}
        onChange={e => setReplaceValue(e.target.value)}
      />
      <Button style={{ position: 'absolute', right: 0, top: 19 }} onClick={e => onFinish(searchValue, replaceValue)}>
        <FormattedMessage id="modal.submitText" />
      </Button>
    </div>
  );
});
