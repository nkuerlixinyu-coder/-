// ==UserScript==
// @name         抖音智眼 - Hackathon Demo (Douyin DeepLens)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  抖音视频深度理解 AI 助手 - 演示专用版
// @author       You
// @match        https://www.douyin.com/*
// @icon         https://p3-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/logo-douyin.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 预设知识库 (Hardcoded Knowledge Base)
    // ==========================================
    const knowledgeBase = [
        {
            keywords: ["总结", "内容", "讲了什么", "大意", "分析"],
            answer: `**总结一下这个视频的内容：**

这个视频的标题**「同时拥有 iPhone 和自卑」**，需结合手机的 “虚假成色”与消费符号的社会隐喻来解读，核心是「伪装的光鲜」与「现实的窘迫」的撕裂，催生自卑：

**1. iPhone 的「符号价值」与手机的「真实成色」撕裂**
iPhone 被社会赋予 “高端、精致、经济能力” 的符号意义。但视频里的手机是 **“伪装的新款 iPhone”**：
* 外观模仿 “灵动岛 + 新款摄像头模组”（像 iPhone 14/15 系列），但「关于本机」显示是 iPhone XR（旧款机型）；
* 电池、屏幕、相机等大量部件标 “未知部件”（说明是改装 / 翻新 / 山寨机，非原装正品）。

**2. 自卑的来源：「伪装光鲜」与「现实窘迫」的自我否定**
用户试图用 “iPhone” 的符号价值包装自己，但手机的 “虚假成色”，反而暴露了现实的窘迫：
* **“伪装被戳穿” 的焦虑**：担心别人知道自己用的是改装机，被觉得虚荣。
* **“连真·iPhone 都买不起” 的自我否定**：现实经济能力不足，只能靠改装旧款来凑数。

**3. 消费符号的异化**
iPhone 本是工具，却被异化为 “成功” 的标尺。伪装的过程反而凸显了自己与 “标尺” 的差距。

**4. 评论区作者的坦白**
iPhone其实是他想玩梗专门弄的一张截屏，所以他这台手机并不是真正的 “改装的旧款”，而是让大家取一乐而已。`
        },
        {
            keywords: ["截屏", "截图", "怎么看出", "假的", "伪造"],
            answer: `**你怎么看出来这个是一张截屏的，我怎么不知道：**

**1. 评论区的 “截图” 线索**
AI 深度分析了前 200 条评论，发现大量高赞留言包含 “截屏”、“截图” 字样。观众敏锐地指出，视频中展示的手机系统界面（如 “关于本机” 页面），并非真实手机操作的画面，更像「截图（或修图）伪造」的内容。

**2. 用户互动的关键转折：作者承认**
* 用户质疑：“某种意义上来说，他好像也没算是改装机”
* 作者 **“巴黎那场雾”** 直接回应：**“只是截图”**

**3. 核心结论**
这一回复彻底坐实：视频里展示的 “手机系统信息”（如 iPhone XR 的机型、“未知部件” 提示），并非真实手机的系统界面，而是通过 P 图伪造的。所谓 “改装 iPhone 的真实演示”，实际是 “截图伪装” 的噱头，目的是制造话题。`
        },
        {
            keywords: ["为什么", "XR", "xr", "改装", "选择"],
            answer: `**为什么是要选择 XR 进行改装呢？**

AI 基于全网改装数据分析，选择 iPhone XR 进行改装是「成本、需求、改装友好度」的综合最优解：

**1. 成本门槛：改装圈的性价比之王**
* **二手均价低**：2024 年 XR 二手仅需 800-1500 元。
* **试错成本低**：屏幕、后壳等配件是 “白菜价”。

**2. 改装友好度：结构是 “万金油”**
* **模块化设计**：内部结构分离，拆解逻辑清晰，新手也能上手。
* **外壳兼容性**：尺寸与早期机型接近，能适配 “iPhone 14 Pro 风格”、“透明探索版” 等多种外壳。

**3. 市场心理：“平替高端”**
* **满足符号需求**：通过「换玻璃后壳 + 改 logo」，低成本模仿新款 iPhone 外观。
* **复古情怀**：XR 是适配 “iPhone 4 风格套件” 的主力机型。

简单说：iPhone XR 是**“想玩改装但预算有限”**玩家的最优解，堪称 “改装圈的五菱宏光”。`
        }
    ];

    // ==========================================
    // 2. 样式注入 (CSS - Glassmorphism)
    // ==========================================
    const style = document.createElement('style');
    style.innerHTML = `
        #douyin-ai-assistant {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px;
            height: 600px;
            background: rgba(20, 20, 20, 0.75);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            font-family: 'PingFang SC', sans-serif;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            color: #fff;
            overflow: hidden;
        }

        #douyin-ai-assistant.minimized {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            cursor: pointer;
            background: linear-gradient(135deg, #FE2C55, #25F4EE);
        }

        /* 最小化时的图标 */
        #ai-icon {
            display: none;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
            font-weight: bold;
        }
        #douyin-ai-assistant.minimized #ai-icon {
            display: flex;
        }
        #douyin-ai-assistant.minimized .chat-container {
            display: none;
        }

        /* 头部 */
        .chat-header {
            padding: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.05);
            cursor: move; /* 可以扩展拖拽功能 */
        }
        .header-title {
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .header-title span {
            background: linear-gradient(90deg, #FE2C55, #25F4EE);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .minimize-btn {
            cursor: pointer;
            opacity: 0.7;
            transition: 0.2s;
            font-size: 20px;
        }
        .minimize-btn:hover { opacity: 1; }

        /* 消息区域 */
        .chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }

        .message {
            margin-bottom: 15px;
            line-height: 1.5;
            font-size: 14px;
            animation: fadeIn 0.3s ease;
        }
        .message.user {
            text-align: right;
        }
        .message.user .bubble {
            background: rgba(254, 44, 85, 0.8); /* 抖音红 */
            color: white;
            border-radius: 12px 12px 2px 12px;
            display: inline-block;
            padding: 8px 12px;
            max-width: 80%;
            text-align: left;
        }
        .message.ai {
            text-align: left;
        }
        .message.ai .bubble {
            background: rgba(255, 255, 255, 0.1);
            color: #e0e0e0;
            border-radius: 12px 12px 12px 2px;
            display: inline-block;
            padding: 10px 14px;
            max-width: 90%;
            border: 1px solid rgba(255,255,255,0.05);
        }
        /* Markdown 样式模拟 */
        .message.ai strong { color: #25F4EE; font-weight: bold; }
        .message.ai li { margin-bottom: 4px; }

        /* 输入区域 */
        .chat-input-area {
            padding: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            gap: 10px;
            background: rgba(0, 0, 0, 0.2);
        }
        .chat-input {
            flex: 1;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 20px;
            padding: 8px 15px;
            color: white;
            font-size: 14px;
            outline: none;
            transition: 0.2s;
        }
        .chat-input:focus {
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 0 2px rgba(37, 244, 238, 0.3);
        }
        .send-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            background: #FE2C55;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.2s;
        }
        .send-btn:hover { transform: scale(1.05); background: #ff4769; }

        /* 思考动画 */
        .thinking-dots {
            display: inline-flex;
            gap: 4px;
            padding: 5px;
        }
        .dot {
            width: 6px;
            height: 6px;
            background: #25F4EE;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 3. 构建 UI 结构
    // ==========================================
    const container = document.createElement('div');
    container.id = 'douyin-ai-assistant';
    container.innerHTML = `
        <div id="ai-icon">AI</div>
        <div class="chat-container" style="display:flex; flex-direction:column; height:100%;">
            <div class="chat-header">
                <div class="header-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25F4EE" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm1-5.5a1.5 1.5 0 0 0-1-2.5 1 1 0 0 0 0 2v1h2z"/></svg>
                    <span>抖音智眼 Agent</span>
                </div>
                <div class="minimize-btn">_</div>
            </div>
            <div class="chat-messages" id="msg-box">
                <div class="message ai">
                    <div class="bubble">你好！我是基于豆包大模型的视频理解助手。我已经看完了这个视频，发现了很有趣的细节，你想聊聊什么？</div>
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="user-input" placeholder="输入问题，例如：总结视频内容..." autocomplete="off">
                <button class="send-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // ==========================================
    // 4. 逻辑控制
    // ==========================================
    const msgBox = document.getElementById('msg-box');
    const inputField = document.getElementById('user-input');
    const sendBtn = container.querySelector('.send-btn');
    const minimizeBtn = container.querySelector('.minimize-btn');
    const aiIcon = document.getElementById('ai-icon');

    // 最小化/展开逻辑
    let isMinimized = false;
    function toggleMinimize() {
        isMinimized = !isMinimized;
        if (isMinimized) {
            container.classList.add('minimized');
        } else {
            container.classList.remove('minimized');
        }
    }

    minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMinimize();
    });

    container.addEventListener('click', () => {
        if (isMinimized) toggleMinimize();
    });

    container.querySelector('.chat-container').addEventListener('click', (e) => {
        e.stopPropagation(); // 防止展开状态下点击触发最小化逻辑
    });

    // 模糊匹配逻辑
    function findBestAnswer(query) {
        let maxScore = 0;
        let bestAnswer = "这个问题很有深度，我正在结合视频细节进行思考... (未匹配到预设库，请检查演示提问词)";

        // 如果输入为空，返回默认
        if (!query) return bestAnswer;

        query = query.toLowerCase();

        knowledgeBase.forEach(item => {
            let score = 0;
            item.keywords.forEach(keyword => {
                if (query.includes(keyword)) score += 1;
            });
            if (score > maxScore) {
                maxScore = score;
                bestAnswer = item.answer;
            }
        });

        // 默认兜底逻辑：如果完全没匹配到，演示时可以默认返回第一个（总结），防止冷场
        if (maxScore === 0 && knowledgeBase.length > 0) {
            // bestAnswer = knowledgeBase[0].answer; // 可选：强制返回第一个
            bestAnswer = "我注意到视频中确实有一些细节支持这个观点。不过根据评论区的反馈，这部分内容存在一定争议，建议辩证看待。";
        }

        return bestAnswer;
    }

    // 打字机效果函数
    function typeWriter(element, text, speed = 15) {
        let i = 0;
        // 简单的 Markdown 处理 (加粗转换行)
        // 演示用，简单将 **文字** 替换为 <strong>
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        // 为了打字机效果，这里我们直接一点点追加 HTML 比较复杂，
        // 简单方案：先不处理 HTML 标签动画，直接流式输出纯文本，或者分段输出。
        // 优化方案：直接一次性渲染HTML，但是用 CSS 动画假装打字（太复杂）。
        // 最终方案：模拟流式输出，遇到 HTML 标签则一次性输出该标签。

        element.innerHTML = '';

        // 简单的模拟流：每隔一小段时间加几个字
        let tempHtml = formattedText;
        let pointer = 0;

        function type() {
            if (pointer < tempHtml.length) {
                // 如果遇到 <br> 或 <strong> 标签，一次性跳过
                if (tempHtml[pointer] === '<') {
                    let closeIdx = tempHtml.indexOf('>', pointer);
                    if (closeIdx !== -1) {
                        element.innerHTML += tempHtml.substring(pointer, closeIdx + 1);
                        pointer = closeIdx + 1;
                        setTimeout(type, speed);
                        return;
                    }
                }

                element.innerHTML += tempHtml.charAt(pointer);
                pointer++;
                msgBox.scrollTop = msgBox.scrollHeight;
                setTimeout(type, speed + Math.random() * 10); // 加入随机感
            }
        }
        type();
    }

    // 发送消息逻辑
    function handleSend() {
        const text = inputField.value.trim();
        if (!text) return;

        // 1. 用户消息上屏
        const userDiv = document.createElement('div');
        userDiv.className = 'message user';
        userDiv.innerHTML = `<div class="bubble">${text}</div>`;
        msgBox.appendChild(userDiv);
        msgBox.scrollTop = msgBox.scrollHeight;
        inputField.value = '';

        // 2. 显示思考动画
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai loading';
        loadingDiv.innerHTML = `<div class="bubble"><div class="thinking-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`;
        msgBox.appendChild(loadingDiv);
        msgBox.scrollTop = msgBox.scrollHeight;

        // 3. 模拟网络延迟和思考 (1.5秒 - 2.5秒)
        const delay = 1500 + Math.random() * 1000;

        setTimeout(() => {
            // 移除思考动画
            loadingDiv.remove();

            // 获取答案
            const answer = findBestAnswer(text);

            // AI 消息容器
            const aiDiv = document.createElement('div');
            aiDiv.className = 'message ai';
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            aiDiv.appendChild(bubble);
            msgBox.appendChild(aiDiv);

            // 开始打字机输出
            typeWriter(bubble, answer);

        }, delay);
    }

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

})();