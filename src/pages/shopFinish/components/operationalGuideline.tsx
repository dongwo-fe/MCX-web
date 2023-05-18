import React from "react";
import { Button } from "antd";
import './operationalGuideline.less'

interface OperationalGuidelineProps {
  element: any;
  currentStep: number; // 记录当前操作步骤;
  callBack: (type: 'prev' | 'next' | 'break') => void; // 回调
}


const OperationalGuideline = ({ element, currentStep, callBack }: OperationalGuidelineProps) => {

  return (
    <div className='operational-guideline'>
      <div
        className='change-shop'
        style={{
          width: `${currentStep === 1 ? '183px' : currentStep === 2 ? '1055px' : currentStep === 3 ? '1055px' : '153px'}`,
          height: `${currentStep === 1 ? '99px' : currentStep === 2 ? '419px' : currentStep === 3 ? '419px' : '99px'}`,
          position: 'relative',
          left: `${currentStep === 1 ? `${element.left - 20}px` : currentStep === 2 ? `${element.left - 90}px` : currentStep === 3 ? `${element.left - 90}px` : `${element.left - 50}px`}`,
          top: `${currentStep === 1 ? `${element.top - 35}px` : currentStep === 2 ? `${element.top - 90}px` : currentStep === 3 ? `${element.top - 90}px` : `${element.top - 30}px`}`,
        }}>
        {currentStep === 1 && (
          <img src="https://ossprod.jrdaimao.com/file/1680507455842124.png" alt="" style={{ width: '100%', height: '100%', borderRadius: 8 }} />
        )}

        {currentStep === 2 && (
          <img src="https://ossprod.jrdaimao.com/file/168050884555150.png" style={{ width: '100%', height: '100%', borderRadius: 8 }} alt="" />
        )}

        {currentStep === 3 && (
          <img src="https://ossprod.jrdaimao.com/file/1680587050814278.png" style={{ width: '100%', height: '100%', borderRadius: 8 }} alt="" />
        )}

        {currentStep === 4 && (
          <img src="https://ossprod.jrdaimao.com/file/1680508674176349.png" style={{ width: '100%', height: '100%', borderRadius: 8 }} alt="" />
        )}

        <div
          className='change-shop-content'
          style={currentStep === 4 ? {
            position: 'absolute',
            right: '20px',
            bottom: '-150px',
            padding: '16px',
          } : (currentStep === 2 || currentStep === 3) ? {
            position: 'absolute',
            left: '20px',
            bottom: '-190px',
            padding: '16px',
          } : {
            position: 'absolute',
            left: '20px',
            bottom: '-150px',
            padding: '16px',
          }
          }
        >
          <span
            className="triangle"
            style={currentStep === 4 ? {
              position: 'absolute',
              right: '25px',
              top: '-4px',
            } : {
              position: 'absolute',
              left: '25px',
              top: '-4px',
            }}
          />
          <div className='title'>
            <span>
              <span className='first'>{currentStep}</span>
              /4
            </span>
            <span>
              {currentStep === 1 ? '选择要装修的店铺' : currentStep === 2 ? '想要店铺在洞窝小程序中脱颖而出吗？' : currentStep === 3 ? '选爆款商品增加曝光，提升获客量' : '小程序店铺首页换装完成'}
            </span>
          </div>
          <div className='desc'>
            {currentStep === 1 ? '单击更换店铺,可以选择您想要装修的店铺' : currentStep === 2 ? '点击左侧主图,然后在右侧操作区,上传最多10张店铺主图,支持调整图片顺序。' : currentStep === 3 ? '点击左侧区域,然后在右侧操作区,设置推荐商品,进行排序以及商品推荐语' : '编辑完成后,单击发布,立刻生效'}
          </div>
          <div className='btn'>
            <div
              className='break'
              onClick={() => callBack('break')}
            >
              跳出
            </div>
            <div style={{ display: 'flex' }}>
              {currentStep !== 1 && (
                <Button
                  type='ghost'
                  onClick={() => callBack('prev')}
                >
                  上一步
                </Button>
              )}
              {currentStep === 4 ? (
                <Button
                  type='primary'
                  onClick={() => callBack('break')}
                >
                  开始
                </Button>
              ) : (
                <Button
                  type='primary'
                  onClick={() => callBack('next')}
                >
                  下一步
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default OperationalGuideline;


