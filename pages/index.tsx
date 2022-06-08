import { useState } from 'react';

import axios from '../node_modules/axios/index';
import Button from '../node_modules/react-bootstrap/esm/Button';
import Container from '../node_modules/react-bootstrap/esm/Container';
import Form from '../node_modules/react-bootstrap/esm/Form';
import FormGroup from '../node_modules/react-bootstrap/esm/FormGroup';
import { Col } from '../node_modules/react-bootstrap/esm/index';
import Row from '../node_modules/react-bootstrap/esm/Row';

export default function Home() {
  const [data, setData] = useState(['']);
  const [result, setResult] = useState<string>('');
  const [isSearched, setIsSearched] = useState<boolean>(false);

  const skillToDifficulty = (skill: string) => {
    if (
      skill === 'ロンダート' ||
      skill === '転回' ||
      skill === 'バク転' ||
      skill === 'ダイビング前転'
    ) {
      //A難度
      return 1;
    } else if (
      skill === 'バク宙' ||
      skill === 'スワン宙' ||
      skill === 'テンポ宙' ||
      skill === '前宙' ||
      skill === '女側宙' ||
      skill === '手なしロンダート'
    ) {
      //B難度
      return 2;
    } else if (
      skill === 'ハーフ' ||
      skill === 'ダイビング前宙' ||
      skill === '前宙半ひねり' ||
      skill === 'きりもみ' ||
      skill === '男側宙' ||
      skill === '転宙'
    ) {
      //BC難度
      return 3;
    } else if (
      skill === 'ダイビング前宙伏臥' ||
      skill === '後方宙返り1回ひねり' ||
      skill === '後方宙返り１回半ひねり' ||
      skill === '前方伸身宙返り' ||
      skill === '前宙1回ひねり' ||
      skill === '前宙1回半ひねり' ||
      skill === '前宙伏臥'
    ) {
      //C難度
      return 4;
    } else if (
      skill === '後方宙返り１回半ひねり伏臥' ||
      skill === '後方宙返り2回ひねり' ||
      skill === '後方2回以上の宙返り' ||
      skill === '前宙2回ひねり' ||
      skill === '前方ダブル'
    ) {
      //D難度
      return 5;
    } else {
      return skill;
    }
  };

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (data.indexOf('') !== -1 || data.indexOf('err') !== -1) {
      return alert('入力が空です');
    }

    let exceptionData = data.slice();

    //特別な難度判定
    let formatFinished = false;
    while (exceptionData.length >= 2) {
      if (formatFinished === true) {
        break;
      }

      //難度判定
      for (let j = 0; j < exceptionData.length; j++) {
        if (exceptionData[j + 1] !== undefined) {
          if (
            (exceptionData[j] === 'ロンダート' ||
              exceptionData[j] === 'バク転') &&
            exceptionData[j + 1] === 'ダイビング前転'
          ) {
            exceptionData[j + 1] = String(2);

            break;
          }
          if (
            (exceptionData[j] === '転回' && exceptionData[j + 1] === '前宙') ||
            (exceptionData[j] === 'バク転' &&
              exceptionData[j + 1] === 'スワン宙')
          ) {
            exceptionData[j + 1] = String(3);

            break;
          }
          if (
            exceptionData[j] === '転回' &&
            exceptionData[j + 1] === 'きりもみ'
          ) {
            exceptionData[j + 1] = String(4);

            break;
          }
        }

        //最後の前まできて、条件を通らなかったらreturn
        if (j === exceptionData.length - 1) {
          formatFinished = true;
          break;
        }
      }
    }

    let formatData = exceptionData
      .map((d) => {
        return skillToDifficulty(d);
      })
      .map(Number);
    let isFinished = false;
    while (formatData.length >= 2) {
      //D難度があった時点でreturn
      if (formatData.indexOf(5) !== -1 || isFinished === true) {
        break;
      }

      //難度判定
      for (let i = 0; i < formatData.length; i++) {
        if (formatData[i + 1] !== undefined) {
          //B難度＋B難度＝C難度
          if (
            (formatData[i] === 2 && formatData[i + 1] === 2) ||
            (formatData[i] === 3 && formatData[i + 1] === 2) ||
            (formatData[i] === 2 && formatData[i + 1] === 3) ||
            (formatData[i] === 3 && formatData[i + 1] === 3)
          ) {
            formatData[i] = 4;
            formatData.splice(i + 1, 1);
            break;
          }
          //B難度＋C難度 or C難度＋C難度＝D難度
          if (
            (formatData[i] === 2 && formatData[i + 1] === 4) ||
            (formatData[i] === 3 && formatData[i + 1] === 4) ||
            (formatData[i] === 4 && formatData[i + 1] === 2) ||
            (formatData[i] === 4 && formatData[i + 1] === 3) ||
            (formatData[i] === 4 && formatData[i + 1] === 4)
          ) {
            formatData[i] = 5;
            formatData.splice(i + 1, 1);
            break;
          }
        }

        //つなぎで難度が上がる技
        if (formatData[i + 2] !== undefined) {
          //(B難度 or BC難度)＋A難度＋(B難度＋BC難度)＝C難度
          if (
            (formatData[i] === 2 || formatData[i] === 3) &&
            formatData[i + 1] === 1 &&
            (formatData[i + 2] === 3 || formatData[i + 2] === 2)
          ) {
            formatData[i] = 4;
            formatData.splice(i + 1, 2);
            break;
          }

          //(B難度 or BC難度 or C難度)＋A難度＋C難度＝D難度
          if (
            (formatData[i] === 2 ||
              formatData[i] === 3 ||
              formatData[i] === 4) &&
            formatData[i + 1] === 1 &&
            formatData[i + 2] === 4
          ) {
            formatData[i] = 5;
            formatData.splice(i + 1, 2);
            break;
          }
        }

        //最後の前まできて、条件を通らなかったらreturn
        if (i === formatData.length - 1) {
          isFinished = true;
          break;
        }
      }
    }

    const maxResult = Math.max(...formatData);

    switch (maxResult) {
      case 1:
        setResult('A難度');
        break;
      case 2:
        setResult('B難度');
        break;
      case 3:
        setResult('B難度(6人でC難度)');
        break;
      case 4:
        setResult('C難度');
        break;
      case 5:
        setResult('D難度');
        break;
    }
    setIsSearched(true);
  };

  const TumblingOptions = () => (
    <>
      <option value=''>選択してください</option>
      <option value='ロンダート'>ロンダート→A難度</option>
      <option value='転回'>転回(ハンドスプリング)→A難度</option>
      <option value='バク転'>バク転→A難度</option>
      <option value='err'>------後方系------</option>
      <option value='バク宙'>バク宙(後方宙返り)→B難度</option>
      <option value='スワン宙'>スワン宙(伸身宙返り)→B難度</option>
      <option value='テンポ宙'>テンポ宙→B難度</option>
      <option value='ハーフ'>ハーフ(後方宙返り半ひねり)→B難度(6人でC)</option>
      <option value='ダイビング前転'>
        ダイビング前転(後ろとびひねり前転)→A難度
      </option>
      <option value='ダイビング前宙'>ダイビング前宙(猫宙)→B難度(6人でC)</option>
      <option value='ダイビング前宙伏臥'>
        ダイビング前宙伏臥(猫宙伏臥)→C難度
      </option>
      <option value='後方宙返り1回ひねり'>後方宙返り1回ひねり→C難度</option>
      <option value='後方宙返り１回半ひねり'>
        後方宙返り１回半ひねり(ドライブ)→C難度
      </option>
      <option value='後方宙返り１回半ひねり伏臥'>
        後方宙返り１回半ひねり伏臥(ドライブ伏臥)→D難度
      </option>
      <option value='後方宙返り2回ひねり'>
        後方宙返り2回ひねり以上のひねり技→D難度
      </option>
      <option value='後方2回以上の宙返り'>
        後方2回以上の宙返り(ダブル以上の技)→D難度
      </option>
      <option value='err'>------前方系------</option>
      <option value='前宙'>前宙→B難度</option>
      <option value='前方伸身宙返り'>前方伸身宙返り→C難度</option>
      <option value='前宙半ひねり'>前宙半ひねり→B難度(6人でC)</option>
      <option value='前宙1回ひねり'>前宙1回ひねり→C難度</option>
      <option value='前方伸身1回ひねり宙返り'>
        前方伸身1回ひねり宙返り以上のひねり技→D難度
      </option>
      <option value='前宙1回半ひねり'>前宙1回半ひねり→C難度</option>
      <option value='前宙2回ひねり'>前宙2回ひねり以上のひねり技→D難度</option>
      <option value='前方ダブル'>前方ダブル(前方2回宙返り)→D難度</option>
      <option value='きりもみ'>
        きりもみ(前とび１回ひねり前転)→B難度(6人でC)
      </option>
      <option value='前宙伏臥'>前宙伏臥→C難度</option>
      <option value='err'>------その他------</option>
      <option value='女側宙'>女側宙(アラビア宙返り)→B難度</option>
      <option value='男側宙'>男側宙(側方宙返り)→B難度(6人でC)</option>
      <option value='転宙'>
        転宙(片足踏切前方開脚伸身宙返り)→B難度(6人でC)
      </option>
      <option value='手なしロンダート'>手なしロンダート→B難度</option>
    </>
  );
  return (
    <Container className='text-center' style={{ backgroundColor: '#F0EDD1' }}>
      <h1 className='m-4 text-primary' style={{ fontWeight: 'bold' }}>
        男子新体操
        <br />
        タンブリング難度
        <br />
        教えるクン
      </h1>
      <div className='m-4'>
        <small>男子新体操のタンブリングの難度を教えてくれるアプリ</small>
      </div>

      <Form onSubmit={onSubmit}>
        {data.map((d, i) => {
          return (
            <div key={i}>
              {i !== 0 && <div className='mb-3'>から</div>}
              <div className='mb-2'>
                <Form.Control
                  as='select'
                  value={data[i]}
                  onChange={(e) => {
                    let copy = data.slice();
                    copy[i] = e.target.value;
                    return setData(copy);
                  }}
                >
                  <TumblingOptions />
                </Form.Control>

                <div style={{ whiteSpace: 'nowrap' }}>
                  <Button
                    className='bg-danger m-2'
                    onClick={(e) => {
                      const deleteData = data.filter((d, index) => index !== i);
                      return setData(deleteData);
                    }}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        <div>
          <Button
            className='m-2'
            onClick={(e) => {
              e.preventDefault();
              setData([...data, '']);
            }}
          >
            技を追加する
          </Button>
        </div>
        <div className='pb-4'>
          <Button type='submit' className='bg-success m-2 '>
            難度を検索!!
          </Button>
        </div>
      </Form>
      {isSearched && (
        <h1 style={{ fontWeight: 'bold' }} className='text-danger m-3 pb-4'>
          {result}です
        </h1>
      )}
      <div className='my-4'>
        <small className='text-danger'>
          ※6人で3回以上の連続でバク転からのスワン宙→D難度
          <br />
          および
          <br />
          6人で3回以上の連続でバク転からのバク宙→C難度
          <br />
          は省いています
        </small>
      </div>
    </Container>
  );
}
