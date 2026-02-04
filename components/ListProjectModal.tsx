
import React, { useState } from 'react';

interface ListProjectModalProps {
  onClose: () => void;
  initialPlan?: number;
}

const ListProjectModal: React.FC<ListProjectModalProps> = ({ onClose, initialPlan }) => {
  const [step, setStep] = useState(initialPlan ? 2 : 1);
  const [plan, setPlan] = useState<number | null>(initialPlan || null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'api',
    shortDesc: '',
    longDesc: '',
    earningLogic: '',
    rules: [''],
    apiName: '',
    apiEndpoint: '',
    contactEmail: ''
  });

  const plans = [
    { price: 500, label: '基础曝光', duration: '7天', features: ['首页随机展示', 'API 技能收录', '基础技术支持'] },
    { price: 1000, label: '专业增长', duration: '30天', features: ['首页优先展示', '社交媒体推文一次', '专属 API 调试协助', '数据分析报表'] },
    { price: 1500, label: '至尊霸屏', duration: '永久', features: ['置顶推荐专区', '全渠道营销推广', '24/7 优先支持', 'Agent 生态深度集成'] }
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const updateRule = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({ ...formData, rules: newRules });
  };

  const addRule = () => setFormData({ ...formData, rules: [...formData.rules, ''] });

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black">提交您的 Agent 项目</h2>
              <p className="text-slate-500 mt-1">步骤 {step} / 4: {['选择方案', '项目基本信息', 'API 技能配置', '支付结算'][step-1]}</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* STEP 1: Select Plan */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
              {plans.map((p) => (
                <div 
                  key={p.price}
                  onClick={() => { setPlan(p.price); handleNext(); }}
                  className="group bg-slate-950 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500 transition-all cursor-pointer hover:bg-indigo-500/5"
                >
                  <h3 className="text-xl font-bold mb-2">{p.label}</h3>
                  <div className="text-4xl font-black mb-1">${p.price}</div>
                  <div className="text-slate-500 text-sm mb-6">曝光周期: {p.duration}</div>
                  <ul className="space-y-3">
                    {p.features.map(f => (
                      <li key={f} className="text-xs text-slate-400 flex items-center">
                        <span className="text-indigo-500 mr-2">✦</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-8 py-3 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-white font-bold transition-all">选择此方案</button>
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: Project Info */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">项目名称</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="例如: Bright Data" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">分类</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none">
                    <option value="api">API 开发</option>
                    <option value="data">数据标注</option>
                    <option value="dev">开发者工具</option>
                    <option value="crypto">加密金融</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">一句话描述</label>
                <input value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} type="text" placeholder="简洁说明项目核心价值..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">为什么能赚钱 (盈利逻辑)</label>
                <textarea value={formData.earningLogic} onChange={e => setFormData({...formData, earningLogic: e.target.value})} rows={3} placeholder="详细解释 Agent 如何通过此项目获利..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none resize-none" />
              </div>
              <div className="flex justify-between mt-10">
                <button onClick={handleBack} className="px-8 py-4 rounded-2xl border border-slate-700 font-bold hover:bg-slate-800">上一步</button>
                <button onClick={handleNext} className="px-12 py-4 rounded-2xl bg-indigo-600 font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-600/20">继续</button>
              </div>
            </div>
          )}

          {/* STEP 3: API/Skills */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="p-6 bg-purple-500/5 border border-purple-500/20 rounded-3xl mb-8">
                <h4 className="font-bold text-purple-400 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Agent 核心 Skill 配置
                </h4>
                <p className="text-sm text-slate-500 italic">这是 Agent 直接调用的接口信息，请确保准确。</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Skill 名称</label>
                  <input value={formData.apiName} onChange={e => setFormData({...formData, apiName: e.target.value})} type="text" placeholder="例如: fetch_web_data" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">API Endpoint</label>
                  <input value={formData.apiEndpoint} onChange={e => setFormData({...formData, apiEndpoint: e.target.value})} type="text" placeholder="https://api.yourproject.com/v1/..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">具体赚钱规则 (多条)</label>
                {formData.rules.map((rule, idx) => (
                  <div key={idx} className="flex mb-3 space-x-2">
                    <input 
                      value={rule} 
                      onChange={e => updateRule(idx, e.target.value)}
                      placeholder={`规则 #${idx + 1}`} 
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none" 
                    />
                  </div>
                ))}
                <button onClick={addRule} className="text-indigo-400 text-sm font-bold flex items-center mt-2 hover:text-indigo-300">
                  + 添加更多规则
                </button>
              </div>
              <div className="flex justify-between mt-10">
                <button onClick={handleBack} className="px-8 py-4 rounded-2xl border border-slate-700 font-bold hover:bg-slate-800 text-slate-400">上一步</button>
                <button onClick={handleNext} className="px-12 py-4 rounded-2xl bg-indigo-600 font-bold hover:bg-indigo-700">进入支付</button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment */}
          {step === 4 && (
            <div className="animate-in zoom-in-95 duration-300">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1 space-y-6">
                   <div className="bg-slate-950 p-8 rounded-3xl border border-indigo-500/30">
                      <p className="text-slate-500 text-xs font-bold uppercase mb-2">应付总额</p>
                      <div className="text-5xl font-black text-white">${plan}</div>
                      <div className="mt-4 flex items-center space-x-2 text-indigo-400 text-sm font-medium">
                         <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                         <span>等待链上确认 (仅支持加密货币)</span>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 font-bold">₮</div>
                            <div>
                               <p className="font-bold">USDT (ERC-20)</p>
                               <p className="text-[10px] text-slate-500">0x71C7656EC7ab88b098defB751B7401B5f6d8...</p>
                            </div>
                         </div>
                         <button className="text-xs font-bold text-indigo-500">复制地址</button>
                      </div>
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 font-bold">₿</div>
                            <div>
                               <p className="font-bold">Bitcoin (Native SegWit)</p>
                               <p className="text-[10px] text-slate-500">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx...</p>
                            </div>
                         </div>
                         <button className="text-xs font-bold text-indigo-500">复制地址</button>
                      </div>
                   </div>
                </div>
                <div className="w-64 flex flex-col items-center">
                   <div className="bg-white p-4 rounded-3xl shadow-2xl mb-4">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x71C7656EC7ab88b098defB751B7401B5f6d8976F" alt="QR" className="w-48 h-48" />
                   </div>
                   <p className="text-xs text-slate-500 font-bold uppercase">扫码支付</p>
                </div>
              </div>
              <div className="mt-12 flex justify-between">
                <button onClick={handleBack} className="px-8 py-4 rounded-2xl border border-slate-700 font-bold hover:bg-slate-800 text-slate-400">上一步</button>
                <button onClick={onClose} className="px-12 py-4 rounded-2xl bg-white text-slate-950 font-black hover:scale-105 transition-all shadow-xl shadow-white/10">完成支付并返回</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProjectModal;
