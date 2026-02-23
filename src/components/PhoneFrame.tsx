import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

/**
 * Web演示专用手机设备框
 * 在桌面浏览器上展示移动App效果
 */
export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="relative mx-auto" style={{ width: 390, height: 844 }}>
      {/* 外壳 */}
      <div
        className="absolute inset-0 rounded-[54px] shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
          boxShadow: '0 50px 100px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
        }}
      />

      {/* 侧边按钮 — 左 */}
      <div className="absolute left-[-3px] top-[120px] w-[3px] h-[36px] bg-[#333] rounded-l-sm" />
      <div className="absolute left-[-3px] top-[168px] w-[3px] h-[64px] bg-[#333] rounded-l-sm" />
      <div className="absolute left-[-3px] top-[244px] w-[3px] h-[64px] bg-[#333] rounded-l-sm" />

      {/* 侧边按钮 — 右 */}
      <div className="absolute right-[-3px] top-[168px] w-[3px] h-[96px] bg-[#333] rounded-r-sm" />

      {/* 屏幕区域 */}
      <div
        className="absolute overflow-hidden bg-white"
        style={{
          top: 12,
          left: 12,
          right: 12,
          bottom: 12,
          borderRadius: 44,
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-black rounded-full"
          style={{ width: 120, height: 34 }}
        />

        {/* 内容区 */}
        <div className="absolute inset-0 overflow-hidden">
          {children}
        </div>
      </div>

      {/* 屏幕光泽 */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 12,
          left: 12,
          right: 12,
          bottom: 12,
          borderRadius: 44,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)',
        }}
      />
    </div>
  );
};
