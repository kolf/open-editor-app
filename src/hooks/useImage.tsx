import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, message } from 'antd';
import ImageDetails from 'src/components/modals/ImageDetails';
import Loading from 'src/components/common/LoadingBlock';
import ImageLogs from 'src/components/modals/ImageLogs';
import UpdateKeywords, { IListItem as IKeywordsInListItem } from 'src/components/modals/UpdateKeywords';
import { removedSourceTypeReg } from 'src/components/KeywordTextAreaGroup';
import UpdateTitle, { PositionType } from 'src/components/modals/UpdateTitle';
import { DataContext } from 'src/components/contexts/DataProvider';
import imageService from 'src/services/imageService';
import modal from 'src/utils/modal';
import * as tools from 'src/utils/tools';
import { FormattedMessage, useIntl } from 'react-intl';

type ITitleInListItem = Required<Pick<IImage, 'id' | 'title'>>;

interface Props<T> {
  list: T;
  onChange?: (list: T) => void;
}

export default function useImage({ list, onChange }: Props<IImage[]>) {
  const { formatMessage } = useIntl();
  const { reasonMap } = React.useContext(DataContext);
  const listRef = useRef<IImage[] | null>(list);
  const [selectedIds, setSelectedIds] = useState<IdList>([]);

  useEffect(() => {
    listRef.current = list;
  }, [list]);

  const keywordTags2string = React.useCallback(
    (keywordTags: IKeywordsTag[]): { keywords: string; keywordsAudit: string; keywordsAll: string } => {
      let keywordArr = [];
      let keywordsAuditArr = [];
      const keywordsAllObj = keywordTags.reduce((result, item) => {
        const { value, label, source, type } = item;
        let keywordStr = '';
        if (type === 0) {
          keywordStr = `${label}||0|0`;
          if (!removedSourceTypeReg.test(source)) {
            keywordsAuditArr.push(keywordStr);
          }
        } else if (type === 1) {
          keywordStr = value;
          if (!removedSourceTypeReg.test(source)) {
            keywordArr.push(keywordStr);
          }
        } else if (type === 2) {
          keywordStr = `${label}|${value.replace(/,/g, '::')}|2|0`;
          if (!removedSourceTypeReg.test(source)) {
            keywordsAuditArr.push(keywordStr);
          }
        }

        result[source] = result[source] ? result[source] + ',' + keywordStr : keywordStr;
        return result;
      }, {});

      return {
        keywords: keywordArr.join(','),
        keywordsAudit: keywordsAuditArr.join(','),
        keywordsAll: JSON.stringify(keywordsAllObj)
      };
    },
    []
  );

  const showSensitiveWowrds = React.useCallback((sensitiveWordsList): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const [idList, keywordList]: [IdList, string[]] = sensitiveWordsList.reduce(
        (result, item) => {
          const keywords = item.sensitiveWords.split(/,|???/) || [];
          if (!result[0].includes(item.id)) {
            result[0].push(item.id);
          }

          result[1] = [...result[1], ...keywords.filter(k => !result[1].includes(k))];
          return result;
        },

        [[], []]
      );

      const mod = modal({
        title: <FormattedMessage id="checkSensitiveWords.title" />,
        content: (
          <>
            <p>
              <FormattedMessage id="checkSensitiveWords.content" />
            </p>
            <p>
              <FormattedMessage id="checkSensitiveWords.id" />???
              {idList.map(id => (
                <span key={id + ''} className="text-error">
                  {id}???
                </span>
              ))}
            </p>
            <p>
              <FormattedMessage id="checkSensitiveWords.keywords" />???
              {keywordList.map(k => (
                <span key={k} className="text-error">
                  {k}???
                </span>
              ))}
            </p>
          </>
        ),
        onOk() {
          mod.close();
          resolve(true);
        },
        onCancel() {
          reject();
        }
      });
    });
  }, []);

  const getReasonTitle = React.useCallback(
    (value, otherValue?: string): string => {
      if (!value && !otherValue) {
        return '';
      }
      const valueList = typeof value === 'string' ? value.match(/\d+/g) : value;
      let result = (valueList || []).filter(v => reasonMap.has(v)).map(v => reasonMap.get(v));
      if (otherValue) {
        result.push(otherValue);
      }
      return result.join('???');
    },
    [reasonMap]
  );

  const updateKeywords = (idList: IdList): void => {
    if (idList.length === 0) {
      message.info(formatMessage({ id: 'image.error.unselect' }));
      return;
    }

    const selectedList = listRef.current.filter(item => idList.includes(item.id));

    if (!checkListLangType(selectedList)) {
      message.info(formatMessage({ id: 'image.error.langeType' }));
      return;
    }

    const langType = selectedList[0].osiKeywodsData.langType;
    const mod = modal({
      title: formatMessage({ id: 'image.setting' }, { value: formatMessage({ id: 'image.keywords' }) }),
      width: 760,
      autoIndex: false,
      content: (
        <UpdateKeywords
          onChange={update}
          langType={langType}
          defaultList={selectedList.map(
            item =>
              ({
                id: item.id,
                keywordTags: item.keywordTags.map(k => ({ ...k, color: null }))
              } as IKeywordsInListItem)
          )}
        />
      ),
      footer: null
    });

    async function update(list) {
      let nextList = await imageService.checkAmbiguityKeywords(list);
      setSelectedList(nextList);
    }

    function checkListLangType(list: IImage[]): boolean {
      const langType = list[0].osiKeywodsData.langType;
      return list.every(item => item.osiKeywodsData.langType === langType);
    }
  };

  // ????????????
  const updateTitle = (idList: IdList): void => {
    if (idList.length === 0) {
      message.info(formatMessage({ id: 'image.error.unselect' }));
      return;
    }

    const mod = modal({
      title: formatMessage({ id: 'image.setting' }, { value: formatMessage({ id: 'image.title' }) }),
      content: <UpdateTitle onAdd={onAdd} onReplace={onReplace} />,
      footer: null
    });

    function onAdd(value: string, updateType: PositionType) {
      const currentList: IImage[] = listRef.current || [];
      let changedList: ITitleInListItem[] = [];
      let newTitle = tools.trim(value);

      if (updateType === 'content') {
        changedList = idList.map(id => ({
          id,
          title: newTitle
        }));
      } else {
        changedList = idList.map(id => {
          const item = currentList.find(c => c.id === id);
          const prevTitle = item.title || '';
          const nextTitle = updateType === 'after' ? `${newTitle}${prevTitle}` : `${prevTitle}${newTitle}`;
          return {
            id,
            title: nextTitle
          };
        });
      }

      setSelectedList(changedList);
    }

    function onReplace(searchValue: string, replaceValue: string) {
      if (!searchValue) {
        message.info(formatMessage({ id: 'input.placeholder' }));
        return;
      }
      const currentList = listRef.current;
      const changedList: ITitleInListItem[] = idList.map(id => {
        const item = currentList.find(c => c.id === id);
        return {
          id,
          title: tools.trim(item.title).replace(new RegExp(tools.trim(searchValue), 'g'), tools.trim(replaceValue))
        };
      });

      setSelectedList(changedList);
    }
  };
  // ??????????????????
  const showDetails = async (index: number) => {
    const mod = modal({
      title: <FormattedMessage id="Photo Info/EXIF" />,
      width: 680,
      content: <Loading />,
      footer: null
    });

    update(index);

    async function update(index: number) {
      mod.update({
        content: <Loading />
      });

      const length = listRef.current.length;
      const { id, urlSmall, urlYuan } = listRef.current[index];
      try {
        const res = await Promise.all([imageService.getKeywords({ id }), imageService.getExif({ id })]);
        mod.update({
          content: <ImageDetails dataSource={{ ...res[0], imgUrl: urlSmall, urlYuan, exif: res[1] }} />,
          footer: (
            <div style={{ display: 'flex' }}>
              <Button disabled={index === 0} onClick={e => update(index - 1)}>
                <FormattedMessage id="Previous" />
              </Button>
              <div style={{ flex: 1, textAlign: 'center', paddingTop: 6 }}>
                {index + 1}/{length}
              </div>
              <Button disabled={index === length - 1} onClick={e => update(index + 1)}>
                <FormattedMessage id="Next" />
              </Button>
            </div>
          )
        });
      } catch (error) {
        message.error(formatMessage({ id: 'message.api.error' }));
        mod.close();
      }
    }
  };

  // ??????????????????
  const openLicense = (index: number) => {
    const { id } = listRef.current[index];
    window.open(`/image/license?id=${id}`);
  };

  // ????????????
  const openOriginImage = (index: number) => {
    const idList: IdList = index === -1 ? selectedIds : [listRef.current[index].id];
    if (idList.length === 0) {
      message.info(formatMessage({ id: 'image.error.unselect' }));
      return;
    }
    idList.forEach(id => {
      const { urlYuan } = listRef.current.find(item => item.id === id);
      window.open(urlYuan, '_blank');
    });
  };

  // ??????????????????
  const showLogs = async (index: number) => {
    const { id } = listRef.current[index];
    try {
      const res = await imageService.getLogList([id]);
      const mod = modal({
        title: formatMessage({ id: 'image.log' }),
        width: 640,
        content: <ImageLogs dataSource={res} />,
        footer: null
      });
    } catch (error) {
      message.error(formatMessage({ id: 'message.api.error' }));
    }
  };

  // ????????????
  const showMiddleImage = (index: number) => {
    const { urlSmall } = listRef.current[index];
    const mod = modal({
      title: formatMessage({ id: 'image.action.showMiddleImage' }),
      width: 640,
      content: (
        <div className="image-max">
          <img src={urlSmall} style={{ width: '100%' }} />
        </div>
      ),
      footer: null
    });
  };

  // ??????????????????
  const setSelectedList = <T extends IImage>(changedList: T[]) => {
    const nextList = listRef.current.map(item => ({
      ...item,
      ...changedList.find(c => c.id === item.id)
    }));

    onChange && onChange(nextList);
  };

  // ??????????????????????????? TODO?????????
  const onSelect = (index: number) => {
    const { id } = listRef.current[index];
    const nextSelectedIds = selectedIds.includes(id) ? selectedIds.filter(sid => sid !== id) : [...selectedIds, id];
    setSelectedIds(nextSelectedIds);
  };

  return {
    getReasonTitle,
    showSensitiveWowrds,
    keywordTags2string,
    openLicense,
    openOriginImage,
    showLogs,
    showDetails,
    showMiddleImage,
    updateTitle,
    updateKeywords,
    onSelect,
    selectedIds,
    setSelectedIds,
    setList: setSelectedList
  };
}
