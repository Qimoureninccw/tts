const TOKEN_REFRESH_BEFORE_EXPIRY = 3 * 60;
let tokenInfo = {
    endpoint: null,
    token: null,
    expiredAt: null
};

// ==================== HTML 页面模板 ====================
const HTML_PAGE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="page.title">SilenceTTSAPI</title>
    <meta name="description" content="" data-i18n-content="page.description">
    <meta name="keywords" content="" data-i18n-content="page.keywords">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --primary-light: #eff6ff;
            --success: #059669;
            --success-hover: #047857;
            --error: #dc2626;
            --warning: #d97706;
            --bg-page: #f8fafc;
            --surface: #ffffff;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-tertiary: #64748b;
            --border: #e2e8f0;
            --border-focus: #3b82f6;
            --radius-sm: 8px;
            --radius-md: 12px;
            --radius-lg: 16px;
            --radius-xl: 24px;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
            font-family: var(--font-sans);
            background: var(--bg-page);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 32px 20px 60px;
        }

        .app-container { max-width: 1024px; width: 100%; margin: 0 auto; }

        /* ---------- 语言切换器 ---------- */
        .language-switcher { position: fixed; top: 20px; right: 20px; z-index: 1000; }
        .language-btn {
            display: flex; align-items: center; gap: 8px;
            padding: 8px 14px; background: rgba(255,255,255,0.9);
            border: 1px solid var(--border); border-radius: 40px;
            cursor: pointer; font-size: 0.875rem; font-weight: 500;
            color: var(--text-secondary); transition: var(--transition);
            box-shadow: var(--shadow-sm); backdrop-filter: blur(8px);
        }
        .language-btn:hover {
            color: var(--primary); border-color: var(--primary);
            box-shadow: var(--shadow-md); transform: translateY(-1px);
        }
        .language-dropdown {
            position: absolute; top: 100%; right: 0; margin-top: 8px;
            background: var(--surface); border: 1px solid var(--border);
            border-radius: var(--radius-md); box-shadow: var(--shadow-lg);
            min-width: 140px; display: none; overflow: hidden; padding: 6px;
        }
        .language-dropdown.show { display: block; animation: fadeIn 0.15s ease-out; }
        .language-option {
            display: flex; align-items: center; gap: 10px;
            padding: 8px 14px; cursor: pointer; font-size: 0.875rem;
            color: var(--text-secondary); border-radius: var(--radius-sm);
            transition: background 0.1s ease;
        }
        .language-option:hover { background: var(--bg-page); color: var(--text-primary); }
        .language-option.active { background: var(--primary); color: white; }

        /* ---------- Hero ---------- */
        .hero { text-align: center; margin-bottom: 48px; padding: 20px 0; }
        .hero h1 {
            font-size: 3rem; font-weight: 800; letter-spacing: -0.03em;
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text; margin-bottom: 12px; line-height: 1.2;
        }
        .hero .subtitle {
            font-size: 1.25rem; color: var(--text-secondary);
            max-width: 560px; margin: 0 auto 28px; font-weight: 400;
        }
        .feature-badges {
            display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 20px;
        }
        .badge {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 6px 16px; background: var(--surface);
            border: 1px solid var(--border); border-radius: 40px;
            font-size: 0.875rem; font-weight: 500;
            color: var(--text-secondary); box-shadow: var(--shadow-sm);
        }

        /* ---------- 模式切换 ---------- */
        .mode-switcher {
            display: flex; justify-content: center; gap: 12px; margin-bottom: 32px;
        }
        .mode-btn {
            display: flex; align-items: center; gap: 10px;
            padding: 12px 32px; background: var(--surface);
            border: 2px solid var(--border); border-radius: 60px;
            font-size: 1rem; font-weight: 600; color: var(--text-secondary);
            cursor: pointer; transition: var(--transition); box-shadow: var(--shadow-sm);
        }
        .mode-btn:hover {
            border-color: var(--primary); color: var(--primary);
            transform: translateY(-2px); box-shadow: var(--shadow-md);
        }
        .mode-btn.active {
            background: var(--primary); border-color: var(--primary); color: white;
            box-shadow: 0 8px 20px -6px rgba(37, 99, 235, 0.4);
        }
        .mode-btn svg { width: 20px; height: 20px; }

        /* ---------- 卡片 ---------- */
        .card {
            background: var(--surface); border-radius: var(--radius-xl);
            box-shadow: var(--shadow-xl); border: 1px solid rgba(226,232,240,0.6);
            overflow: hidden; transition: var(--transition);
        }
        .card-body { padding: 40px; }

        /* ---------- Tab ---------- */
        .input-tabs {
            display: flex; gap: 6px; background: var(--bg-page);
            padding: 6px; border-radius: var(--radius-lg);
            border: 1px solid var(--border); margin-bottom: 28px;
        }
        .tab-btn {
            flex: 1; display: flex; align-items: center; justify-content: center;
            gap: 8px; padding: 12px 20px; border: none; background: transparent;
            color: var(--text-secondary); border-radius: var(--radius-md);
            font-size: 0.9rem; font-weight: 600; cursor: pointer;
            transition: var(--transition);
        }
        .tab-btn:hover { color: var(--primary); background: rgba(37,99,235,0.05); }
        .tab-btn.active {
            background: var(--surface); color: var(--primary);
            box-shadow: var(--shadow-sm); transform: translateY(-1px);
        }
        .tab-btn svg { width: 18px; height: 18px; }

        /* ---------- 表单 ---------- */
        .form-group { margin-bottom: 24px; }
        .form-label {
            display: block; margin-bottom: 8px; font-weight: 600;
            font-size: 0.875rem; color: var(--text-primary);
        }
        .form-input, .form-select, .form-textarea {
            width: 100%; padding: 12px 16px; border: 2px solid var(--border);
            border-radius: var(--radius-md); font-size: 16px;
            color: var(--text-primary); background: var(--surface);
            transition: var(--transition); font-family: inherit;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none; border-color: var(--border-focus);
            box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
        }
        .form-textarea { min-height: 120px; resize: vertical; }
        .controls-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px; margin-bottom: 32px;
        }

        /* ---------- 文件上传 ---------- */
        .file-drop-zone {
            border: 2px dashed var(--border); border-radius: var(--radius-lg);
            padding: 40px 24px; text-align: center; cursor: pointer;
            transition: var(--transition);
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        .file-drop-zone:hover, .file-drop-zone.dragover {
            border-color: var(--primary); background: var(--primary-light);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -8px rgba(37,99,235,0.2);
        }
        .file-drop-icon {
            width: 56px; height: 56px; display: flex; align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%);
            border-radius: var(--radius-lg); color: white; margin: 0 auto 16px;
            box-shadow: var(--shadow-md);
        }
        .file-drop-icon svg { width: 28px; height: 28px; }
        .file-drop-text { font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
        .file-drop-hint { font-size: 0.8rem; color: var(--text-tertiary); }
        .file-info {
            display: none; align-items: center; justify-content: space-between;
            padding: 16px 20px; background: var(--surface);
            border: 1px solid var(--border); border-radius: var(--radius-lg);
            margin-top: 16px; box-shadow: var(--shadow-sm);
        }
        .file-name {
            font-weight: 600; font-size: 0.9rem; color: var(--text-primary);
            display: flex; align-items: center; gap: 8px;
        }
        .file-name::before {
            content: ''; width: 10px; height: 10px;
            background: var(--primary); border-radius: 3px;
        }
        .file-size {
            font-size: 0.75rem; color: var(--text-tertiary);
            background: var(--bg-page); padding: 2px 10px;
            border-radius: 20px; margin-left: 8px;
        }
        .file-remove-btn {
            width: 32px; height: 32px; border: none; background: #fef2f2;
            color: var(--error); border-radius: var(--radius-sm);
            cursor: pointer; display: flex; align-items: center;
            justify-content: center; font-weight: 700; transition: var(--transition);
        }
        .file-remove-btn:hover { background: var(--error); color: white; }

        /* ---------- 按钮 ---------- */
        .btn-primary {
            width: 100%; display: flex; align-items: center; justify-content: center;
            gap: 10px; padding: 16px 32px; background: var(--primary); color: white;
            border: none; border-radius: var(--radius-md); font-size: 1rem;
            font-weight: 600; cursor: pointer; transition: var(--transition);
            box-shadow: 0 4px 14px -4px rgba(37,99,235,0.5);
        }
        .btn-primary:hover:not(:disabled) {
            background: var(--primary-hover); transform: translateY(-2px);
            box-shadow: 0 8px 25px -8px rgba(37,99,235,0.6);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-secondary {
            display: inline-flex; align-items: center; justify-content: center;
            gap: 8px; padding: 12px 24px; background: var(--success); color: white;
            border: none; border-radius: var(--radius-md); font-size: 0.9rem;
            font-weight: 600; cursor: pointer; text-decoration: none;
            transition: var(--transition);
            box-shadow: 0 4px 14px -4px rgba(5,150,105,0.4);
        }
        .btn-secondary:hover {
            background: var(--success-hover); transform: translateY(-2px);
            box-shadow: 0 8px 25px -8px rgba(5,150,105,0.5);
        }
        .btn-outline {
            display: inline-flex; align-items: center; justify-content: center;
            gap: 8px; padding: 12px 24px; background: transparent;
            color: var(--text-secondary); border: 2px solid var(--border);
            border-radius: var(--radius-md); font-size: 0.9rem; font-weight: 600;
            cursor: pointer; transition: var(--transition);
        }
        .btn-outline:hover {
            border-color: var(--primary); color: var(--primary);
            background: var(--primary-light);
        }

        /* ---------- 结果 ---------- */
        .result-container {
            margin-top: 32px; padding: 24px; background: var(--bg-page);
            border-radius: var(--radius-lg); border: 1px solid var(--border);
            display: none;
        }
        .audio-player { width: 100%; margin-bottom: 20px; border-radius: var(--radius-md); }
        .error-message {
            color: var(--error); background: #fef2f2; border: 1px solid #fecaca;
            padding: 16px 20px; border-radius: var(--radius-md);
            font-weight: 500; font-size: 0.9rem;
        }

        /* ---------- 加载 ---------- */
        .loading-container { text-align: center; padding: 32px 20px; }
        .loading-spinner {
            width: 40px; height: 40px; border: 3px solid var(--border);
            border-top-color: var(--primary); border-radius: 50%;
            animation: spin 0.8s linear infinite; margin: 0 auto 16px;
        }
        .loading-text { color: var(--text-secondary); font-weight: 500; font-size: 0.95rem; }
        .progress-info { margin-top: 10px; font-size: 0.8rem; color: var(--text-tertiary); }

        /* ---------- Token ---------- */
        .token-config { display: flex; gap: 24px; margin-bottom: 12px; flex-wrap: wrap; }
        .token-option { display: flex; align-items: center; }
        .token-label {
            display: flex; align-items: center; gap: 8px; cursor: pointer;
            font-weight: 500; color: var(--text-secondary); font-size: 0.9rem;
        }
        .token-label input[type="radio"] {
            width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer;
        }

        /* ---------- 结果操作 ---------- */
        .result-actions { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
        .result-actions .btn-secondary, .result-actions .btn-outline { flex: 1; min-width: 130px; }

        /* ---------- 推广 ---------- */
        .wechat-promotion {
            margin-top: 40px; background: var(--surface);
            border-radius: var(--radius-xl); box-shadow: var(--shadow-lg);
            border: 1px solid var(--border); overflow: hidden; display: none;
        }
        .promotion-header {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            padding: 24px 32px; border-bottom: 1px solid var(--border);
        }
        .promotion-title { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .promotion-subtitle { color: var(--text-secondary); font-size: 0.875rem; }
        .promotion-content {
            padding: 32px; display: grid; grid-template-columns: auto 1fr;
            gap: 32px; align-items: center;
        }
        .qr-code {
            width: 130px; height: 130px; border-radius: var(--radius-lg);
            overflow: hidden; border: 2px solid var(--border);
            background: white; display: flex; align-items: center; justify-content: center;
        }
        .qr-code img { width: 100%; height: 100%; object-fit: cover; }
        .promotion-info h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 10px; color: var(--text-primary); }
        .promotion-info p { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 16px; }
        .benefits-list {
            list-style: none; padding: 0; display: grid;
            grid-template-columns: 1fr 1fr; gap: 8px 16px;
        }
        .benefits-list li {
            display: flex; align-items: center; gap: 8px;
            font-size: 0.85rem; color: var(--text-secondary);
        }
        .benefits-list li::before { content: "✓"; color: var(--success); font-weight: 700; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.3s ease-out; }

        @media (max-width: 768px) {
            body { padding: 20px 16px 40px; }
            .hero h1 { font-size: 2.2rem; }
            .hero .subtitle { font-size: 1rem; }
            .card-body { padding: 24px; }
            .mode-switcher { flex-direction: column; gap: 10px; }
            .mode-btn { justify-content: center; padding: 12px 20px; }
            .controls-grid { grid-template-columns: 1fr; gap: 16px; }
            .promotion-content { grid-template-columns: 1fr; text-align: center; gap: 20px; }
            .qr-code { margin: 0 auto; }
            .benefits-list { grid-template-columns: 1fr; }
            .result-actions { flex-direction: column; }
            .result-actions .btn-secondary, .result-actions .btn-outline { width: 100%; }
            .language-switcher { top: 12px; right: 12px; }
        }
    </style>
</head>
<body>
    <!-- 语言切换器 -->
    <div class="language-switcher">
        <div class="language-btn" id="languageBtn">
            <span id="currentLangFlag">🌐</span>
            <span id="currentLangName" data-i18n="lang.current">English</span>
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>
        <div class="language-dropdown" id="languageDropdown">
            <div class="language-option" data-lang="en"><span>🇺🇸</span><span data-i18n="lang.en">English</span></div>
            <div class="language-option" data-lang="zh"><span>🇨🇳</span><span data-i18n="lang.zh">中文</span></div>
            <div class="language-option" data-lang="ja"><span>🇯🇵</span><span data-i18n="lang.ja">日本語</span></div>
            <div class="language-option" data-lang="ko"><span>🇰🇷</span><span data-i18n="lang.ko">한국어</span></div>
            <div class="language-option" data-lang="es"><span>🇪🇸</span><span data-i18n="lang.es">Español</span></div>
            <div class="language-option" data-lang="fr"><span>🇫🇷</span><span data-i18n="lang.fr">Français</span></div>
            <div class="language-option" data-lang="de"><span>🇩🇪</span><span data-i18n="lang.de">Deutsch</span></div>
            <div class="language-option" data-lang="ru"><span>🇷🇺</span><span data-i18n="lang.ru">Русский</span></div>
        </div>
    </div>

    <div class="app-container">
        <div class="hero">
            <h1 data-i18n="header.title">SilenceTTSAPI</h1>
            <p class="subtitle" data-i18n="header.subtitle">AI-Powered Voice Processing Platform</p>
            <div class="feature-badges">
                <div class="badge"><span>✨</span><span data-i18n="header.feature1">20+ Voice Options</span></div>
                <div class="badge"><span>⚡</span><span data-i18n="header.feature2">Lightning Fast</span></div>
                <div class="badge"><span>🆓</span><span data-i18n="header.feature3">Completely Free</span></div>
                <div class="badge"><span>📱</span><span data-i18n="header.feature4">Download Support</span></div>
            </div>
        </div>

        <!-- 模式切换 -->
        <div class="mode-switcher">
            <button type="button" class="mode-btn active" id="ttsMode">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11v0a5 5 0 0 1-10 0"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                <span data-i18n="mode.tts">Text to Speech</span>
            </button>
            <button type="button" class="mode-btn" id="transcriptionMode">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="9" r="4"/><path d="M9 17v4"/><path d="M15 9.5v-3a3 3 0 0 0-3-3h-1"/><line x1="19" y1="8" x2="19" y2="16"/><line x1="17" y1="9" x2="17" y2="15"/><line x1="21" y1="9" x2="21" y2="15"/></svg>
                <span data-i18n="mode.transcription">Speech to Text</span>
            </button>
        </div>

        <!-- TTS -->
        <div class="card" id="ttsContainer">
            <div class="card-body">
                <form id="ttsForm">
                    <div class="form-group">
                        <div class="input-tabs">
                            <button type="button" class="tab-btn active" id="textInputTab">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                <span>手动输入</span>
                            </button>
                            <button type="button" class="tab-btn" id="fileUploadTab">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>
                                <span>上传文件</span>
                            </button>
                        </div>
                    </div>

                    <div id="textInputArea">
                        <div class="form-group">
                            <label class="form-label" for="text">输入文本</label>
                            <textarea class="form-textarea" id="text" placeholder="请输入要转换为语音的文本内容，支持中文、英文、数字等..." required></textarea>
                        </div>
                    </div>

                    <div id="fileUploadArea" style="display: none;">
                        <div class="form-group">
                            <label class="form-label">上传 txt 文件</label>
                            <div class="file-drop-zone" id="fileDropZone">
                                <div class="file-drop-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L13.09 8.26L19 7L17.74 13.09L24 12L17.74 10.91L19 5L13.09 6.26L12 0L10.91 6.26L5 5L6.26 10.91L0 12L6.26 13.09L5 19L10.91 17.74L12 24L13.09 17.74L19 19L17.74 13.09L24 12Z"/><path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2M18 20H6V4H13V9H18V20Z"/></svg>
                                </div>
                                <p class="file-drop-text">拖拽 txt 文件到此处，或点击选择文件</p>
                                <p class="file-drop-hint">支持 txt 格式，最大 500KB</p>
                                <input type="file" id="fileInput" accept=".txt,text/plain" style="display: none;">
                            </div>
                            <div class="file-info" id="fileInfo">
                                <div>
                                    <span class="file-name" id="fileName"></span>
                                    <span class="file-size" id="fileSize"></span>
                                </div>
                                <button type="button" class="file-remove-btn" id="fileRemoveBtn">✕</button>
                            </div>
                        </div>
                    </div>

                    <div class="controls-grid">
                        <div class="form-group">
                            <label class="form-label" for="voice">语音选择</label>
                            <select class="form-select" id="voice">
                                <option value="zh-CN-XiaoxiaoNeural">晓晓 (女声·温柔)</option>
                                <option value="zh-CN-YunxiNeural">云希 (男声·清朗)</option>
                                <option value="zh-CN-YunyangNeural">云扬 (男声·阳光)</option>
                                <option value="zh-CN-XiaoyiNeural">晓伊 (女声·甜美)</option>
                                <option value="zh-CN-YunjianNeural">云健 (男声·稳重)</option>
                                <option value="zh-CN-XiaochenNeural">晓辰 (女声·知性)</option>
                                <option value="zh-CN-XiaohanNeural">晓涵 (女声·优雅)</option>
                                <option value="zh-CN-XiaomengNeural">晓梦 (女声·梦幻)</option>
                                <option value="zh-CN-XiaomoNeural">晓墨 (女声·文艺)</option>
                                <option value="zh-CN-XiaoqiuNeural">晓秋 (女声·成熟)</option>
                                <option value="zh-CN-XiaoruiNeural">晓睿 (女声·智慧)</option>
                                <option value="zh-CN-XiaoshuangNeural">晓双 (女声·活泼)</option>
                                <option value="zh-CN-XiaoxuanNeural">晓萱 (女声·清新)</option>
                                <option value="zh-CN-XiaoyanNeural">晓颜 (女声·柔美)</option>
                                <option value="zh-CN-XiaoyouNeural">晓悠 (女声·悠扬)</option>
                                <option value="zh-CN-XiaozhenNeural">晓甄 (女声·端庄)</option>
                                <option value="zh-CN-YunfengNeural">云枫 (男声·磁性)</option>
                                <option value="zh-CN-YunhaoNeural">云皓 (男声·豪迈)</option>
                                <option value="zh-CN-YunxiaNeural">云夏 (男声·热情)</option>
                                <option value="zh-CN-YunyeNeural">云野 (男声·野性)</option>
                                <option value="zh-CN-YunzeNeural">云泽 (男声·深沉)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="speed">语速调节</label>
                            <select class="form-select" id="speed">
                                <option value="0.5">🐌 很慢</option>
                                <option value="0.75">🚶 慢速</option>
                                <option value="1.0" selected>⚡ 正常</option>
                                <option value="1.25">🏃 快速</option>
                                <option value="1.5">🚀 很快</option>
                                <option value="2.0">💨 极速</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="pitch">音调高低</label>
                            <select class="form-select" id="pitch">
                                <option value="-50">📉 很低沉</option>
                                <option value="-25">📊 低沉</option>
                                <option value="0" selected>🎵 标准</option>
                                <option value="25">📈 高亢</option>
                                <option value="50">🎶 很高亢</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="style">语音风格</label>
                            <select class="form-select" id="style">
                                <option value="general" selected>🎭 通用风格</option>
                                <option value="assistant">🤖 智能助手</option>
                                <option value="chat">💬 聊天对话</option>
                                <option value="customerservice">📞 客服专业</option>
                                <option value="newscast">📺 新闻播报</option>
                                <option value="affectionate">💕 亲切温暖</option>
                                <option value="calm">😌 平静舒缓</option>
                                <option value="cheerful">😊 愉快欢乐</option>
                                <option value="gentle">🌸 温和柔美</option>
                                <option value="lyrical">🎼 抒情诗意</option>
                                <option value="serious">🎯 严肃正式</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" class="btn-primary" id="generateBtn">
                        <span>🎙️</span>
                        <span>开始生成语音</span>
                    </button>
                </form>

                <div id="result" class="result-container">
                    <div id="loading" class="loading-container" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p class="loading-text" id="loadingText">正在生成语音，请稍候...</p>
                        <div class="progress-info" id="progressInfo"></div>
                    </div>
                    <div id="success" style="display: none;">
                        <audio id="audioPlayer" class="audio-player" controls></audio>
                        <a id="downloadBtn" class="btn-secondary" download="speech.mp3">
                            <span>📥</span><span>下载音频文件</span>
                        </a>
                    </div>
                    <div id="error" class="error-message" style="display: none;"></div>
                </div>
            </div>
        </div>

        <!-- 转录 -->
        <div class="card" id="transcriptionContainer" style="display: none;">
            <div class="card-body">
                <form id="transcriptionForm">
                    <div class="form-group">
                        <label class="form-label">上传音频文件</label>
                        <div class="file-drop-zone" id="audioDropZone">
                            <div class="file-drop-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15l3-3 3 3"/></svg>
                            </div>
                            <p class="file-drop-text">拖拽音频文件到此处，或点击选择文件</p>
                            <p class="file-drop-hint">支持 mp3、wav、m4a、flac、aac、ogg、webm、amr、3gp，最大 10MB</p>
                            <input type="file" id="audioFileInput" accept=".mp3,.wav,.m4a,.flac,.aac,.ogg,.webm,.amr,.3gp,audio/*" style="display: none;">
                        </div>
                        <div class="file-info" id="audioFileInfo">
                            <div>
                                <span class="file-name" id="audioFileName"></span>
                                <span class="file-size" id="audioFileSize"></span>
                            </div>
                            <button type="button" class="file-remove-btn" id="audioFileRemoveBtn">✕</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">API Token 配置</label>
                        <div class="token-config">
                            <div class="token-option">
                                <label class="token-label">
                                    <input type="radio" name="tokenOption" value="default" checked>
                                    <span>使用默认 Token</span>
                                </label>
                            </div>
                            <div class="token-option">
                                <label class="token-label">
                                    <input type="radio" name="tokenOption" value="custom">
                                    <span>使用硅基流动自定义 Token</span>
                                </label>
                            </div>
                        </div>
                        <input type="password" class="form-input" id="tokenInput" placeholder="输入您的 API Token（可选）" style="display: none;">
                    </div>

                    <button type="submit" class="btn-primary" id="transcribeBtn">
                        <span>🎧</span>
                        <span>开始语音转录</span>
                    </button>
                </form>

                <div id="transcriptionResult" class="result-container">
                    <div id="transcriptionLoading" class="loading-container" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p class="loading-text" id="transcriptionLoadingText">正在转录音频，请稍候...</p>
                        <div class="progress-info" id="transcriptionProgressInfo"></div>
                    </div>
                    <div id="transcriptionSuccess" style="display: none;">
                        <div class="form-group">
                            <label class="form-label">转录结果</label>
                            <textarea class="form-textarea" id="transcriptionText" placeholder="转录结果将在这里显示..." readonly></textarea>
                        </div>
                        <div class="result-actions">
                            <button type="button" class="btn-outline" id="copyTranscriptionBtn"><span>📋</span><span>复制文本</span></button>
                            <button type="button" class="btn-outline" id="editTranscriptionBtn"><span>✏️</span><span>编辑文本</span></button>
                            <button type="button" class="btn-secondary" id="useForTtsBtn"><span>🎙️</span><span>转为语音</span></button>
                        </div>
                    </div>
                    <div id="transcriptionError" class="error-message" style="display: none;"></div>
                </div>
            </div>
        </div>
            </div>
        </div>
    </div>

    <script>
        let selectedFile = null;
        let currentInputMethod = 'text';
        let currentMode = 'tts';
        let selectedAudioFile = null;
        let currentLanguage = 'en';

        const translations = {
            en: {
                'page.title': 'SilenceTTSAPI - AI-Powered Voice Processing Platform',
                'page.description': 'SilenceTTSAPI is an AI-powered platform that converts text to speech and speech to text with 20+ voice options, lightning fast processing, completely free to use.',
                'page.keywords': 'text to speech,AI voice synthesis,online TTS,voice generator,free voice tools,speech to text,voice transcription',
                'lang.current': 'English', 'lang.en': 'English', 'lang.zh': '中文', 'lang.ja': '日本語',
                'lang.ko': '한국어', 'lang.es': 'Español', 'lang.fr': 'Français', 'lang.de': 'Deutsch', 'lang.ru': 'Русский',
                'header.title': 'SilenceTTSAPI',
                'header.subtitle': 'AI-Powered Voice Processing Platform',
                'header.feature1': '20+ Voice Options',
                'header.feature2': 'Lightning Fast',
                'header.feature3': 'Completely Free',
                'header.feature4': 'Download Support',
                'mode.tts': 'Text to Speech',
                'mode.transcription': 'Speech to Text'
            },
            zh: {
                'page.title': 'SilenceTTSAPI - AI驱动的语音处理平台',
                'page.description': 'SilenceTTSAPI是一个AI驱动的平台，支持文字转语音和语音转文字，拥有20+种语音选项，闪电般的处理速度，完全免费使用。',
                'page.keywords': '文字转语音,AI语音合成,在线TTS,语音生成器,免费语音工具,语音转文字,语音转录',
                'lang.current': '中文', 'lang.en': 'English', 'lang.zh': '中文', 'lang.ja': '日本語',
                'lang.ko': '한국어', 'lang.es': 'Español', 'lang.fr': 'Français', 'lang.de': 'Deutsch', 'lang.ru': 'Русский',
                'header.title': 'SilenceTTSAPI',
                'header.subtitle': 'AI驱动的语音处理平台',
                'header.feature1': '20+种语音选项',
                'header.feature2': '闪电般快速',
                'header.feature3': '完全免费',
                'header.feature4': '支持下载',
                'mode.tts': '文字转语音',
                'mode.transcription': '语音转文字'
            },
            ja: {
                'page.title': 'SilenceTTSAPI - AI音声処理プラットフォーム',
                'page.description': 'SilenceTTSAPIはAI駆動のプラットフォームで、テキスト読み上げと音声テキスト変換に対応。20以上の音声オプション、高速処理、完全無料でご利用いただけます。',
                'page.keywords': 'テキスト読み上げ,AI音声合成,オンラインTTS,音声ジェネレーター,無料音声ツール,音声テキスト変換,音声転写',
                'lang.current': '日本語', 'lang.en': 'English', 'lang.zh': '中文', 'lang.ja': '日本語',
                'lang.ko': '한국어', 'lang.es': 'Español', 'lang.fr': 'Français', 'lang.de': 'Deutsch', 'lang.ru': 'Русский',
                'header.title': 'SilenceTTSAPI',
                'header.subtitle': 'AI音声処理プラットフォーム',
                'header.feature1': '20以上の音声オプション',
                'header.feature2': '高速処理',
                'header.feature3': '完全無料',
                'header.feature4': 'ダウンロード対応',
                'mode.tts': 'テキスト読み上げ',
                'mode.transcription': '音声テキスト変換'
            },
            ko: {
                'page.title': 'SilenceTTSAPI - AI 음성 처리 플랫폼',
                'page.description': 'SilenceTTSAPI는 AI 기반 플랫폼으로 텍스트 음성 변환과 음성 텍스트 변환을 지원합니다. 20개 이상의 음성 옵션, 빠른 처리 속도, 완전 무료로 이용하실 수 있습니다.',
                'page.keywords': '텍스트 음성 변환,AI 음성 합성,온라인 TTS,음성 생성기,무료 음성 도구,음성 텍스트 변환,음성 전사',
                'lang.current': '한국어', 'lang.en': 'English', 'lang.zh': '中文', 'lang.ja': '日本語',
                'lang.ko': '한국어', 'lang.es': 'Español', 'lang.fr': 'Français', 'lang.de': 'Deutsch', 'lang.ru': 'Русский',
                'header.title': 'SilenceTTSAPI',
                'header.subtitle': 'AI 음성 처리 플랫폼',
                'header.feature1': '20개 이상의 음성 옵션',
                'header.feature2': '빠른 처리',
                'header.feature3': '완전 무료',
                'header.feature4': '다운로드 지원',
                'mode.tts': '텍스트 음성 변환',
                'mode.transcription': '음성 텍스트 변환'
            },
            es: {
                'page.title': 'SilenceTTSAPI - Plataforma de Procesamiento de Voz con IA',
                'page.description': 'SilenceTTSAPI es una plataforma impulsada por IA que convierte texto a voz y voz a texto con más de 20 opciones de voz, procesamiento ultrarrápido, completamente gratis.',
                'page.keywords': 'texto a voz,síntesis de voz IA,TTS en línea,generador de voz,herramientas de voz gratis,voz a texto,transcripción de voz',
                'lang.current': 'Español', 'lang.en': 'English', 'lang.zh': '中文', 'lang.ja': '日本語',
                'lang.ko': '한국어', 'lang.es': 'Español', 'lang.fr': 'Français', 'lang.de': 'Deutsch', 'lang.ru': 'Русский',
                'header.title': 'SilenceTTSAPI',
                'header.subtitle': 'Plataforma de Procesamiento de Voz con IA',
                'header.feature1': 'Más de 20 Opciones de Voz',
                'header.feature2': 'Ultrarrápido',
                'header.feature3': 'Completamente Gratis',
                'header.feature4': 'Soporte de Descarga',
                'mode.tts': 'Texto a Voz',
                'mode.transcription': 'Voz a Texto'
            },
            fr: {
                'page.title': 'SilenceTTSAPI - Plateforme de Traitement Vocal IA',
                'page.description': 'SilenceTTSAPI est une plateforme alimentée par IA qui convertit le texte en parole et la parole en texte avec plus de 20 options vocales, traitement ultra-rapide, entièrement gratuit.',
                'page.keywords': 'texte vers parole,synthèse vocale IA,TTS en ligne,générateur vocal,outils vocaux gratuits,parole vers texte,transcription vocale',
                'lang.current': 'Français', 'lang.en': 'English', 'lang.zh': '中文', 'lang.ja': '日本語',
                'lang.ko': '한국어', 'lang.es': 'Español', 'lang.fr': 'Français', 'lang.de': 'Deutsch', 'lang.ru': 'Русский',
                'header.title': 'SilenceTTSAPI',
                'header.subtitle': 'Plateforme de Traitement Vocal IA',
                'header.feature1': 'Plus de 20 Options Vocales',
                'header.feature2': 'Ultra-rapide',
                'header.feature3': 'Entièrement Gratuit',
                'header.feature4': 'Support de Téléchargement',
                'mode.tts': 'Texte vers Parole',
                'mode.transcription': 'Parole vers Texte'
            },
            de: {
                'page.title': 'SilenceTTSAPI - KI-gestützte Sprachverarbeitungsplattform',
                'page.description': 'SilenceTTSAPI ist eine KI-gestützte Plattform, die Text in Sprache und Sprache in Text umwandelt, mit über 20 Sprachoptionen, blitzschneller Verarbeitung, völlig kostenlos.',
                'page.keywords': 'Text zu Sprache,KI-Sprachsynthese,Online-TTS,Sprachgenerator,kostenlose Sprachtools,Sprache zu Text,Sprachtranskription',
                'lang.current': 'Deutsch', 'lang.en': 'English', 'lang.zh': '中文', 'lang.ja': '日本語',
                'lang.ko': '한국어', 'lang.es': 'Español', 'lang.fr': 'Français', 'lang.de': 'Deutsch', 'lang.ru': 'Русский',
                'header.title': 'SilenceTTSAPI',
                'header.subtitle': 'KI-gestützte Sprachverarbeitungsplattform',
                'header.feature1': 'Über 20 Sprachoptionen',
                'header.feature2': 'Blitzschnell',
                'header.feature3': 'Völlig Kostenlos',
                'header.feature4': 'Download-Unterstützung',
                'mode.tts': 'Text zu Sprache',
                'mode.transcription': 'Sprache zu Text'
            },
            ru: {
                'page.title': 'SilenceTTSAPI - ИИ-платформа обработки голоса',
                'page.description': 'SilenceTTSAPI - это платформа на базе ИИ, которая преобразует текст в речь и речь в текст с более чем 20 голосовыми опциями, молниеносной обработкой, совершенно бесплатно.',
                'page.keywords': 'текст в речь,ИИ синтез речи,онлайн TTS,генератор голоса,бесплатные голосовые инструменты,речь в текст,транскрипция речи',
                'lang.current': 'Русский', 'lang.en': 'English', 'lang.zh': '中文', 'lang.ja': '日本語',
                'lang.ko': '한국어', 'lang.es': 'Español', 'lang.fr': 'Français', 'lang.de': 'Deutsch', 'lang.ru': 'Русский',
                'header.title': 'SilenceTTSAPI',
                'header.subtitle': 'ИИ-платформа обработки голоса',
                'header.feature1': 'Более 20 голосовых опций',
                'header.feature2': 'Молниеносно',
                'header.feature3': 'Совершенно Бесплатно',
                'header.feature4': 'Поддержка Загрузки',
                'mode.tts': 'Текст в Речь',
                'mode.transcription': 'Речь в Текст'
            }
        };

        function detectLanguage() {
            const browserLang = navigator.language || navigator.userLanguage;
            const shortLang = browserLang.split('-')[0];
            if (translations[shortLang]) return shortLang;
            return 'en';
        }

        function setLanguage(lang) {
            currentLanguage = lang;
            localStorage.setItem('voicecraft-language', lang);
            document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
            applyTranslations();
            updateLanguageSwitcher();
        }

        function applyTranslations() {
            const langData = translations[currentLanguage];
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (langData[key]) el.textContent = langData[key];
            });
            document.querySelectorAll('[data-i18n-content]').forEach(el => {
                const key = el.getAttribute('data-i18n-content');
                if (langData[key]) el.setAttribute('content', langData[key]);
            });
            if (langData['page.title']) document.title = langData['page.title'];
        }

        function updateLanguageSwitcher() {
            const langFlags = { en:'🇺🇸', zh:'🇨🇳', ja:'🇯🇵', ko:'🇰🇷', es:'🇪🇸', fr:'🇫🇷', de:'🇩🇪', ru:'🇷🇺' };
            const langData = translations[currentLanguage];
            document.getElementById('currentLangFlag').textContent = langFlags[currentLanguage];
            document.getElementById('currentLangName').textContent = langData['lang.current'];
            document.querySelectorAll('.language-option').forEach(o => {
                o.classList.remove('active');
                if (o.getAttribute('data-lang') === currentLanguage) o.classList.add('active');
            });
        }

        function initializeI18n() {
            const savedLang = localStorage.getItem('voicecraft-language');
            currentLanguage = (savedLang && translations[savedLang]) ? savedLang : detectLanguage();
            setLanguage(currentLanguage);
        }

        function initializeLanguageSwitcher() {
            const btn = document.getElementById('languageBtn');
            const dd = document.getElementById('languageDropdown');
            btn.addEventListener('click', e => { e.stopPropagation(); dd.classList.toggle('show'); });
            document.addEventListener('click', () => dd.classList.remove('show'));
            document.querySelectorAll('.language-option').forEach(o => {
                o.addEventListener('click', function() {
                    setLanguage(this.getAttribute('data-lang'));
                    dd.classList.remove('show');
                });
            });
        }

        function initializeInputMethodTabs() {
            const textTab = document.getElementById('textInputTab');
            const fileTab = document.getElementById('fileUploadTab');
            const textArea = document.getElementById('textInputArea');
            const fileArea = document.getElementById('fileUploadArea');
            textTab.addEventListener('click', () => {
                currentInputMethod = 'text';
                textTab.classList.add('active'); fileTab.classList.remove('active');
                textArea.style.display = 'block'; fileArea.style.display = 'none';
                document.getElementById('text').required = true;
            });
            fileTab.addEventListener('click', () => {
                currentInputMethod = 'file';
                fileTab.classList.add('active'); textTab.classList.remove('active');
                textArea.style.display = 'none'; fileArea.style.display = 'block';
                document.getElementById('text').required = false;
            });
        }

        function initializeFileUpload() {
            const dz = document.getElementById('fileDropZone');
            const fi = document.getElementById('fileInput');
            const info = document.getElementById('fileInfo');
            const rm = document.getElementById('fileRemoveBtn');
            dz.addEventListener('click', () => fi.click());
            fi.addEventListener('change', e => { const f = e.target.files[0]; if (f) handleFileSelect(f); });
            dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
            dz.addEventListener('dragleave', e => { e.preventDefault(); dz.classList.remove('dragover'); });
            dz.addEventListener('drop', e => {
                e.preventDefault(); dz.classList.remove('dragover');
                const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f);
            });
            rm.addEventListener('click', () => {
                selectedFile = null; fi.value = '';
                info.style.display = 'none'; dz.style.display = 'block';
            });
        }

        function handleFileSelect(file) {
            if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
                alert('请选择txt格式的文本文件'); return;
            }
            if (file.size > 500 * 1024) { alert('文件大小不能超过500KB'); return; }
            selectedFile = file;
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('fileSize').textContent = formatFileSize(file.size);
            document.getElementById('fileInfo').style.display = 'flex';
            document.getElementById('fileDropZone').style.display = 'none';
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024, sizes = ['Bytes', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        document.getElementById('ttsForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const voice = document.getElementById('voice').value;
            const speed = document.getElementById('speed').value;
            const pitch = document.getElementById('pitch').value;
            const style = document.getElementById('style').value;
            const generateBtn = document.getElementById('generateBtn');
            const resultContainer = document.getElementById('result');
            const loading = document.getElementById('loading');
            const success = document.getElementById('success');
            const error = document.getElementById('error');

            if (currentInputMethod === 'text') {
                const text = document.getElementById('text').value;
                if (!text.trim()) { alert('请输入要转换的文本内容'); return; }
            } else if (!selectedFile) {
                alert('请选择要上传的txt文件'); return;
            }

            resultContainer.style.display = 'block';
            loading.style.display = 'block';
            success.style.display = 'none';
            error.style.display = 'none';
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<span>⏳</span><span>生成中...</span>';

            try {
                let response;
                const loadingText = document.getElementById('loadingText');
                const progressInfo = document.getElementById('progressInfo');

                if (currentInputMethod === 'text') {
                    const text = document.getElementById('text').value;
                    if (text.length > 3000) {
                        loadingText.textContent = '正在处理长文本，请耐心等待...';
                        progressInfo.textContent = '文本长度: ' + text.length + ' 字符，预计需要 ' + (Math.ceil(text.length / 1500) * 2) + ' 秒';
                    } else {
                        loadingText.textContent = '正在生成语音，请稍候...';
                        progressInfo.textContent = '文本长度: ' + text.length + ' 字符';
                    }
                    response = await fetch('/v1/audio/speech', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ input: text, voice, speed: parseFloat(speed), pitch, style })
                    });
                } else {
                    loadingText.textContent = '正在处理上传的文件...';
                    progressInfo.textContent = '文件: ' + selectedFile.name + ' (' + formatFileSize(selectedFile.size) + ')';
                    const formData = new FormData();
                    formData.append('file', selectedFile);
                    formData.append('voice', voice);
                    formData.append('speed', speed);
                    formData.append('pitch', pitch);
                    formData.append('style', style);
                    response = await fetch('/v1/audio/speech', { method: 'POST', body: formData });
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || '生成失败');
                }

                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById('audioPlayer').src = audioUrl;
                document.getElementById('downloadBtn').href = audioUrl;

                loading.style.display = 'none';
                success.style.display = 'block';

                setTimeout(() => {
                    const wp = document.getElementById('wechatPromotion');
                    wp.style.display = 'block';
                    wp.classList.add('fade-in');
                }, 1000);
            } catch (err) {
                loading.style.display = 'none';
                error.style.display = 'block';
                if (err.message.includes('Too many subrequests')) {
                    error.textContent = '错误: 文本过长导致请求过多，请缩短文本内容或分段处理';
                } else if (err.message.includes('频率限制') || err.message.includes('429')) {
                    error.textContent = '错误: 请求过于频繁，请稍后再试';
                } else {
                    error.textContent = '错误: ' + err.message;
                }
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<span>🎙️</span><span>开始生成语音</span>';
            }
        });

        function initializeModeSwitcher() {
            document.getElementById('ttsMode').addEventListener('click', () => switchMode('tts'));
            document.getElementById('transcriptionMode').addEventListener('click', () => switchMode('transcription'));
        }

        function switchMode(mode) {
            currentMode = mode;
            const ttsMode = document.getElementById('ttsMode');
            const tm = document.getElementById('transcriptionMode');
            const tts = document.getElementById('ttsContainer');
            const tc = document.getElementById('transcriptionContainer');
            const wp = document.getElementById('wechatPromotion');
            if (mode === 'tts') {
                ttsMode.classList.add('active'); tm.classList.remove('active');
                tts.style.display = 'block'; tc.style.display = 'none';
            } else {
                tm.classList.add('active'); ttsMode.classList.remove('active');
                tts.style.display = 'none'; tc.style.display = 'block';
            }
            wp.style.display = 'none';
        }

        function initializeAudioUpload() {
            const dz = document.getElementById('audioDropZone');
            const fi = document.getElementById('audioFileInput');
            const info = document.getElementById('audioFileInfo');
            const rm = document.getElementById('audioFileRemoveBtn');
            dz.addEventListener('click', () => fi.click());
            fi.addEventListener('change', e => { const f = e.target.files[0]; if (f) handleAudioFileSelect(f); });
            dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
            dz.addEventListener('dragleave', e => { e.preventDefault(); dz.classList.remove('dragover'); });
            dz.addEventListener('drop', e => {
                e.preventDefault(); dz.classList.remove('dragover');
                const f = e.dataTransfer.files[0]; if (f) handleAudioFileSelect(f);
            });
            rm.addEventListener('click', () => {
                selectedAudioFile = null; fi.value = '';
                info.style.display = 'none'; dz.style.display = 'block';
            });
        }

        function handleAudioFileSelect(file) {
            const allowed = ['audio/mpeg','audio/mp3','audio/wav','audio/m4a','audio/flac','audio/aac','audio/ogg','audio/webm','audio/amr','audio/3gpp'];
            const ok = allowed.some(t => file.type.includes(t) || file.name.toLowerCase().match(/\.(mp3|wav|m4a|flac|aac|ogg|webm|amr|3gp)$/i));
            if (!ok) { alert('请选择音频格式的文件（mp3、wav、m4a、flac、aac、ogg、webm、amr、3gp）'); return; }
            if (file.size > 10 * 1024 * 1024) { alert('音频文件大小不能超过10MB'); return; }
            selectedAudioFile = file;
            document.getElementById('audioFileName').textContent = file.name;
            document.getElementById('audioFileSize').textContent = formatFileSize(file.size);
            document.getElementById('audioFileInfo').style.display = 'flex';
            document.getElementById('audioDropZone').style.display = 'none';
        }

        function initializeTokenConfig() {
            document.querySelectorAll('input[name="tokenOption"]').forEach(r => {
                r.addEventListener('change', function() {
                    const ti = document.getElementById('tokenInput');
                    if (this.value === 'custom') { ti.style.display = 'block'; ti.required = true; }
                    else { ti.style.display = 'none'; ti.required = false; ti.value = ''; }
                });
            });
        }

        document.getElementById('transcriptionForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('transcribeBtn');
            const rc = document.getElementById('transcriptionResult');
            const ld = document.getElementById('transcriptionLoading');
            const sc = document.getElementById('transcriptionSuccess');
            const er = document.getElementById('transcriptionError');

            if (!selectedAudioFile) { alert('请选择要转录的音频文件'); return; }

            const tokenOption = document.querySelector('input[name="tokenOption"]:checked').value;
            const customToken = document.getElementById('tokenInput').value;
            if (tokenOption === 'custom' && !customToken.trim()) { alert('请输入自定义Token'); return; }

            rc.style.display = 'block'; ld.style.display = 'block';
            sc.style.display = 'none'; er.style.display = 'none';
            btn.disabled = true;
            btn.innerHTML = '<span>⏳</span><span>转录中...</span>';

            document.getElementById('transcriptionLoadingText').textContent = '正在转录音频，请稍候...';
            document.getElementById('transcriptionProgressInfo').textContent = '文件: ' + selectedAudioFile.name + ' (' + formatFileSize(selectedAudioFile.size) + ')';

            try {
                const fd = new FormData();
                fd.append('file', selectedAudioFile);
                if (tokenOption === 'custom') fd.append('token', customToken);
                const r = await fetch('/v1/audio/transcriptions', { method: 'POST', body: fd });
                if (!r.ok) {
                    const ed = await r.json();
                    throw new Error(ed.error?.message || '转录失败');
                }
                const result = await r.json();
                document.getElementById('transcriptionText').value = result.text || '';
                ld.style.display = 'none';
                sc.style.display = 'block';
                setTimeout(() => {
                    const wp = document.getElementById('wechatPromotion');
                    wp.style.display = 'block';
                    wp.classList.add('fade-in');
                }, 1000);
            } catch (err) {
                ld.style.display = 'none';
                er.style.display = 'block';
                er.textContent = '错误: ' + err.message;
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<span>🎧</span><span>开始语音转录</span>';
            }
        });

        document.getElementById('copyTranscriptionBtn').addEventListener('click', function() {
            const t = document.getElementById('transcriptionText');
            t.select();
            document.execCommand('copy');
            const o = this.innerHTML;
            this.innerHTML = '<span>✅</span><span>已复制</span>';
            setTimeout(() => { this.innerHTML = o; }, 2000);
        });

        document.getElementById('editTranscriptionBtn').addEventListener('click', function() {
            const t = document.getElementById('transcriptionText');
            if (t.readOnly) {
                t.readOnly = false; t.focus();
                this.innerHTML = '<span>💾</span><span>保存编辑</span>';
            } else {
                t.readOnly = true;
                this.innerHTML = '<span>✏️</span><span>编辑文本</span>';
            }
        });

        document.getElementById('useForTtsBtn').addEventListener('click', function() {
            const t = document.getElementById('transcriptionText').value;
            if (!t.trim()) { alert('转录结果为空，无法转换为语音'); return; }
            switchMode('tts');
            document.getElementById('text').value = t;
            document.getElementById('ttsContainer').scrollIntoView({ behavior: 'smooth' });
        });

        document.addEventListener('DOMContentLoaded', function() {
            initializeI18n();
            initializeInputMethodTabs();
            initializeFileUpload();
            initializeModeSwitcher();
            initializeAudioUpload();
            initializeTokenConfig();
            initializeLanguageSwitcher();
        });
    </script>
</body>
</html>`;
// ==================== 文档页模板 ====================
const DOCS_PAGE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SilenceTTSAPI · 接口文档</title>
    <meta name="description" content="SilenceTTSAPI 官方接口文档，一行 URL 即可调用 AI 语音合成。">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --bg-page: #f8fafc;
            --surface: #ffffff;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-tertiary: #64748b;
            --border: #e2e8f0;
            --code-bg: #0f172a;
            --code-text: #e2e8f0;
            --inline-code-bg: #f1f5f9;
            --inline-code-text: #be123c;
            --radius-md: 12px;
            --radius-lg: 16px;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
        }

        body {
            font-family: var(--font-sans);
            background: var(--bg-page);
            color: var(--text-primary);
            line-height: 1.7;
            min-height: 100vh;
            padding: 40px 20px 80px;
        }

        .layout {
            max-width: 900px;
            margin: 0 auto;
        }

        /* 顶部导航 */
        .topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
            padding: 16px 24px;
            background: var(--surface);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border);
        }

        .topbar .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 800;
            font-size: 1.1rem;
            color: var(--text-primary);
            text-decoration: none;
        }

        .topbar .logo span:first-child {
            font-size: 1.4rem;
        }

        .topbar .nav-links {
            display: flex;
            gap: 8px;
        }

        .topbar .nav-links a {
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.15s ease;
        }

        .topbar .nav-links a:hover {
            background: var(--bg-page);
            color: var(--primary);
        }

        .topbar .nav-links a.active {
            background: var(--primary);
            color: white;
        }

        /* 主内容 */
        .doc-card {
            background: var(--surface);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border);
            padding: 48px;
        }

        h1 {
            font-size: 2.2rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            margin-bottom: 12px;
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .doc-card > p:first-of-type {
            font-size: 1.05rem;
            color: var(--text-secondary);
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border);
        }

        h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-top: 48px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--border);
            color: var(--text-primary);
            scroll-margin-top: 20px;
        }

        h3 {
            font-size: 1.15rem;
            font-weight: 700;
            margin-top: 32px;
            margin-bottom: 12px;
            color: var(--text-primary);
        }

        p {
            margin-bottom: 16px;
            color: var(--text-secondary);
        }

        /* 表格 */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0 24px;
            font-size: 0.9rem;
            border-radius: var(--radius-md);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
        }

        th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }

        th {
            background: var(--bg-page);
            font-weight: 700;
            color: var(--text-primary);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        td {
            color: var(--text-secondary);
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover td {
            background: #f8fafc;
        }

        /* 行内代码 */
        code {
            font-family: var(--font-mono);
            font-size: 0.85em;
            padding: 2px 8px;
            background: var(--inline-code-bg);
            color: var(--inline-code-text);
            border-radius: 6px;
            font-weight: 500;
        }

        /* 代码块 */
        pre {
            background: var(--code-bg);
            color: var(--code-text);
            padding: 20px 24px;
            border-radius: var(--radius-md);
            overflow-x: auto;
            margin: 16px 0 24px;
            font-family: var(--font-mono);
            font-size: 0.875rem;
            line-height: 1.7;
            position: relative;
            box-shadow: var(--shadow-md);
        }

        pre code {
            background: transparent;
            color: inherit;
            padding: 0;
            font-size: inherit;
            border-radius: 0;
        }

        /* 提示框 */
        blockquote {
            border-left: 4px solid var(--primary);
            background: #eff6ff;
            padding: 16px 20px;
            margin: 16px 0 24px;
            border-radius: 0 var(--radius-md) var(--radius-md) 0;
            color: var(--text-secondary);
        }

        blockquote p { margin: 0; }

        /* 链接 */
        a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
            border-bottom: 1px solid transparent;
            transition: border-color 0.15s ease;
        }

        a:hover {
            border-bottom-color: var(--primary);
        }

        /* 列表 */
        ul, ol {
            margin: 12px 0 20px 24px;
            color: var(--text-secondary);
        }

        li {
            margin-bottom: 6px;
        }

        li code {
            font-size: 0.8em;
        }

        /* 目录 */
        .toc {
            background: var(--bg-page);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: 20px 24px;
            margin-bottom: 40px;
        }

        .toc-title {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-tertiary);
            margin-bottom: 12px;
        }

        .toc ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 8px 16px;
        }

        .toc li { margin: 0; }

        .toc a {
            font-size: 0.875rem;
            color: var(--text-secondary);
            border-bottom: none;
            display: block;
            padding: 4px 0;
        }

        .toc a:hover { color: var(--primary); }

        /* 底部 */
        .footer {
            text-align: center;
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid var(--border);
            color: var(--text-tertiary);
            font-size: 0.875rem;
        }

        /* 响应式 */
        @media (max-width: 768px) {
            body { padding: 16px 12px 60px; }
            .doc-card { padding: 24px; }
            h1 { font-size: 1.6rem; }
            h2 { font-size: 1.25rem; }
            .topbar { flex-direction: column; gap: 12px; padding: 12px 16px; }
            .toc ul { grid-template-columns: 1fr; }
            pre { padding: 16px; font-size: 0.8rem; }
            table { font-size: 0.8rem; }
            th, td { padding: 8px 10px; }
        }
    </style>
</head>
<body>
    <div class="layout">
        <div class="topbar">
            <a href="/" class="logo">
                <span>🎙️</span>
                <span>VoiceCraft</span>
            </a>
            <div class="nav-links">
                <a href="/">首页</a>
                <a href="/docs" class="active">API 文档</a>
            </div>
        </div>

        <div class="doc-card">
            <h1>SilenceTTSAPI 使用文档</h1>
            <p>AI 驱动的语音合成 API，一次请求返回 mp3 音频流。</p>

            <nav class="toc">
                <div class="toc-title">目录</div>
                <ul>
                    <li><a href="#basic">基础信息</a></li>
                    <li><a href="#endpoint">接口说明</a></li>
                    <li><a href="#examples">调用示例</a></li>
                    <li><a href="#voices">音色表</a></li>
                    <li><a href="#styles">风格表</a></li>
                    <li><a href="#notes">注意事项</a></li>
                    <li><a href="#errors">错误码</a></li>
                </ul>
            </nav>

            <h2 id="basic">基础信息</h2>
            <table>
                <tr><th>项目</th><th>说明</th></tr>
                <tr><td>名称</td><td>SilenceTTSAPI</td></tr>
                <tr><td>Base URL</td><td><code>https://silence-tts-api.de5.net/</code></td></tr>
                <tr><td>请求方式</td><td><code>GET</code></td></tr>
                <tr><td>返回格式</td><td><code>audio/mpeg</code>（mp3 音频流）</td></tr>
                <tr><td>CORS</td><td>已开启，支持跨域</td></tr>
                <tr><td>鉴权</td><td>无需鉴权</td></tr>
            </table>

            <h2 id="endpoint">接口：文字转语音</h2>
            <pre><code>GET /create?txt=文本</code></pre>

            <h3>请求参数</h3>
            <table>
                <tr><th>参数</th><th>必填</th><th>类型</th><th>默认值</th><th>说明</th></tr>
                <tr><td><code>txt</code></td><td>是</td><td>string</td><td>—</td><td>要转换的文本内容</td></tr>
                <tr><td><code>voice</code></td><td>否</td><td>string</td><td><code>zh-CN-XiaoxiaoNeural</code></td><td>音色，见下方音色表</td></tr>
                <tr><td><code>speed</code></td><td>否</td><td>number</td><td><code>1.0</code></td><td>语速，范围 <code>0.5</code> ~ <code>2.0</code></td></tr>
                <tr><td><code>pitch</code></td><td>否</td><td>number</td><td><code>0</code></td><td>音调，范围 <code>-50</code> ~ <code>50</code></td></tr>
                <tr><td><code>style</code></td><td>否</td><td>string</td><td><code>general</code></td><td>语音风格，见下方风格表</td></tr>
            </table>

            <h3>返回</h3>
            <p><strong>成功</strong>：<code>audio/mpeg</code> 二进制音频流（mp3）</p>
            <p><strong>失败</strong>：JSON 错误信息</p>
            <pre><code>{
  "error": {
    "message": "缺少参数 txt",
    "type": "invalid_request_error",
    "param": "txt",
    "code": "missing_txt"
  }
}</code></pre>

            <h2 id="examples">调用示例</h2>

            <h3>1. 最简用法</h3>
            <pre><code>https://silence-tts-api.de5.net/create?txt=你好世界</code></pre>

            <h3>2. 指定音色和语速</h3>
            <pre><code>https://silence-tts-api.de5.net/create?txt=你好世界&amp;voice=zh-CN-YunxiNeural&amp;speed=1.2</code></pre>

            <h3>3. 带音调和风格</h3>
            <pre><code>https://silence-tts-api.de5.net/create?txt=今天天气真好&amp;voice=zh-CN-XiaoxiaoNeural&amp;speed=1.0&amp;pitch=10&amp;style=cheerful</code></pre>

            <h3>4. 前端 audio 直接播放</h3>
            <pre><code>&lt;audio controls src="https://silence-tts-api.de5.net/create?txt=欢迎使用VoiceCraft"&gt;&lt;/audio&gt;</code></pre>

            <h3>5. JavaScript 调用</h3>
            <pre><code>const text = "你好，这是一段测试语音";
const url = \`https://silence-tts-api.de5.net/create?txt=\${encodeURIComponent(text)}&amp;voice=zh-CN-YunxiNeural\`;

const audio = new Audio(url);
audio.play();</code></pre>

            <h3>6. 下载音频</h3>
            <pre><code>const text = "要下载的内容";
const url = \`https://silence-tts-api.de5.net/create?txt=\${encodeURIComponent(text)}\`;

const a = document.createElement('a');
a.href = url;
a.download = 'speech.mp3';
a.click();</code></pre>

            <h3>7. curl 命令行</h3>
            <pre><code>curl "https://silence-tts-api.de5.net/create?txt=你好世界" -o output.mp3</code></pre>

            <h3>8. Python 示例</h3>
            <pre><code>import requests

url = "https://silence-tts-api.de5.net/create"
params = {
    "txt": "你好，这是Python调用的测试",
    "voice": "zh-CN-XiaoxiaoNeural",
    "speed": 1.0,
    "style": "cheerful"
}

resp = requests.get(url, params=params)
with open("output.mp3", "wb") as f:
    f.write(resp.content)</code></pre>

            <h3>9. Node.js 示例</h3>
            <pre><code>const fs = require('fs');
const https = require('https');

const text = encodeURIComponent('你好，这是Node.js调用的测试');
const url = \`https://silence-tts-api.de5.net/create?txt=\${text}&amp;voice=zh-CN-YunxiNeural\`;

https.get(url, (res) =&gt; {
  const file = fs.createWriteStream('output.mp3');
  res.pipe(file);
  file.on('finish', () =&gt; file.close());
});</code></pre>

            <h2 id="voices">音色表（voice）</h2>
            <table>
                <tr><th>值</th><th>说明</th></tr>
                <tr><td><code>zh-CN-XiaoxiaoNeural</code></td><td>晓晓（女声·温柔）默认</td></tr>
                <tr><td><code>zh-CN-YunxiNeural</code></td><td>云希（男声·清朗）</td></tr>
                <tr><td><code>zh-CN-YunyangNeural</code></td><td>云扬（男声·阳光）</td></tr>
                <tr><td><code>zh-CN-XiaoyiNeural</code></td><td>晓伊（女声·甜美）</td></tr>
                <tr><td><code>zh-CN-YunjianNeural</code></td><td>云健（男声·稳重）</td></tr>
                <tr><td><code>zh-CN-XiaochenNeural</code></td><td>晓辰（女声·知性）</td></tr>
                <tr><td><code>zh-CN-XiaohanNeural</code></td><td>晓涵（女声·优雅）</td></tr>
                <tr><td><code>zh-CN-XiaomengNeural</code></td><td>晓梦（女声·梦幻）</td></tr>
                <tr><td><code>zh-CN-XiaomoNeural</code></td><td>晓墨（女声·文艺）</td></tr>
                <tr><td><code>zh-CN-XiaoqiuNeural</code></td><td>晓秋（女声·成熟）</td></tr>
                <tr><td><code>zh-CN-XiaoruiNeural</code></td><td>晓睿（女声·智慧）</td></tr>
                <tr><td><code>zh-CN-XiaoshuangNeural</code></td><td>晓双（女声·活泼）</td></tr>
                <tr><td><code>zh-CN-XiaoxuanNeural</code></td><td>晓萱（女声·清新）</td></tr>
                <tr><td><code>zh-CN-XiaoyanNeural</code></td><td>晓颜（女声·柔美）</td></tr>
                <tr><td><code>zh-CN-XiaoyouNeural</code></td><td>晓悠（女声·悠扬）</td></tr>
                <tr><td><code>zh-CN-XiaozhenNeural</code></td><td>晓甄（女声·端庄）</td></tr>
                <tr><td><code>zh-CN-YunfengNeural</code></td><td>云枫（男声·磁性）</td></tr>
                <tr><td><code>zh-CN-YunhaoNeural</code></td><td>云皓（男声·豪迈）</td></tr>
                <tr><td><code>zh-CN-YunxiaNeural</code></td><td>云夏（男声·热情）</td></tr>
                <tr><td><code>zh-CN-YunyeNeural</code></td><td>云野（男声·野性）</td></tr>
                <tr><td><code>zh-CN-YunzeNeural</code></td><td>云泽（男声·深沉）</td></tr>
            </table>

            <h2 id="styles">风格表（style）</h2>
            <table>
                <tr><th>值</th><th>说明</th></tr>
                <tr><td><code>general</code></td><td>通用风格（默认）</td></tr>
                <tr><td><code>assistant</code></td><td>智能助手</td></tr>
                <tr><td><code>chat</code></td><td>聊天对话</td></tr>
                <tr><td><code>customerservice</code></td><td>客服专业</td></tr>
                <tr><td><code>newscast</code></td><td>新闻播报</td></tr>
                <tr><td><code>affectionate</code></td><td>亲切温暖</td></tr>
                <tr><td><code>calm</code></td><td>平静舒缓</td></tr>
                <tr><td><code>cheerful</code></td><td>愉快欢乐</td></tr>
                <tr><td><code>gentle</code></td><td>温和柔美</td></tr>
                <tr><td><code>lyrical</code></td><td>抒情诗意</td></tr>
                <tr><td><code>serious</code></td><td>严肃正式</td></tr>
            </table>

            <h2 id="notes">注意事项</h2>
            <ol>
                <li><strong>URL 编码</strong>：中文文本建议用 <code>encodeURIComponent()</code> 编码，尤其是通过 JS 调用时。</li>
                <li><strong>长文本</strong>：支持长文本（内部自动分块），但建议单次不超过 10000 字，避免超时。</li>
                <li><strong>参数优先级</strong>：不传参数时使用默认值，传了就用传入的值。</li>
                <li><strong>返回类型</strong>：永远是 mp3，<code>Content-Type</code> 为 <code>audio/mpeg</code>。</li>
            </ol>

            <h2 id="errors">错误码</h2>
            <table>
                <tr><th>HTTP 状态码</th><th>说明</th></tr>
                <tr><td><code>200</code></td><td>成功，返回 mp3 音频流</td></tr>
                <tr><td><code>400</code></td><td>参数错误（如缺少 <code>txt</code>）</td></tr>
                <tr><td><code>500</code></td><td>服务器内部错误（如合成失败）</td></tr>
            </table>

            <div class="footer">
                SilenceTTSAPI · Powered by VoiceCraft
            </div>
        </div>
    </div>
</body>
</html>`;

// ==================== Worker 入口 ====================
export default {
    async fetch(request, env, ctx) {
        return handleRequest(request);
    }
};

async function handleRequest(request) {
    if (request.method === "OPTIONS") {
        return handleOptions(request);
    }

    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname;

    // 返回前端页面
    if (path === "/" || path === "/index.html") {
        return new Response(HTML_PAGE, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                ...makeCORSHeaders()
            }
        });
    }

    if (path === "/v1/audio/transcriptions") {
        try {
            return await handleAudioTranscription(request);
        } catch (error) {
            console.error("Audio transcription error:", error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message,
                    type: "api_error",
                    param: null,
                    code: "transcription_error"
                }
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }
    }

    if (path === "/v1/audio/speech") {
        try {
            const contentType = request.headers.get("content-type") || "";
            if (contentType.includes("multipart/form-data")) {
                return await handleFileUpload(request);
            }

            const requestBody = await request.json();
            const {
                input,
                voice = "zh-CN-XiaoxiaoNeural",
                speed = '1.0',
                volume = '0',
                pitch = '0',
                style = "general"
            } = requestBody;

            let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
            let numVolume = parseInt(String(parseFloat(volume) * 100));
            let numPitch = parseInt(pitch);
            const response = await getVoice(
                input,
                voice,
                rate >= 0 ? `+${rate}%` : `${rate}%`,
                numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
                numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
                style,
                "audio-24khz-48kbitrate-mono-mp3"
            );
            return response;
        } catch (error) {
            console.error("Error:", error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message,
                    type: "api_error",
                    param: null,
                    code: "edge_tts_error"
                }
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }
    }
    // 新增：GET /create?txt=文本  → 直接返回 mp3 音频
    if (path === "/create") {
        try {
            const txt = requestUrl.searchParams.get("txt") || "";
            const cleanText = txt.trim();

            if (!cleanText) {
                return new Response(JSON.stringify({
                    error: {
                        message: "缺少参数 txt",
                        type: "invalid_request_error",
                        param: "txt",
                        code: "missing_txt"
                    }
                }), {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...makeCORSHeaders()
                    }
                });
            }

            // 固定使用默认音色（以后可以扩展 ?voice=&speed= 等）
            const voice = requestUrl.searchParams.get("voice") || "zh-CN-XiaoxiaoNeural";
            const speed = requestUrl.searchParams.get("speed") || "1.0";
            const pitch = requestUrl.searchParams.get("pitch") || "0";
            const style = requestUrl.searchParams.get("style") || "general";

            let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
            let numPitch = parseInt(pitch);
            const volume = 0;
            let numVolume = 0;

            const response = await getVoice(
                cleanText,
                voice,
                rate >= 0 ? `+${rate}%` : `${rate}%`,
                numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
                numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
                style,
                "audio-24khz-48kbitrate-mono-mp3"
            );

            return response;
        } catch (error) {
            console.error("GET /create error:", error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message || String(error),
                    type: "api_error",
                    param: null,
                    code: "create_error"
                }
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }
    }
        // 文档页
    if (path === "/docs" || path === "/docs/") {
        return new Response(DOCS_PAGE, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                ...makeCORSHeaders()
            }
        });
    }
    return new Response("Not Found", { status: 404 });
}

async function handleOptions(request) {
    return new Response(null, {
        status: 204,
        headers: {
            ...makeCORSHeaders(),
            "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
            "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "Authorization"
        }
    });
}

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function optimizedTextSplit(text, maxChunkSize = 1500) {
    const chunks = [];
    const sentences = text.split(/[。！？\n]/);
    let currentChunk = '';
    for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();
        if (!trimmedSentence) continue;
        if (trimmedSentence.length > maxChunkSize) {
            if (currentChunk) { chunks.push(currentChunk.trim()); currentChunk = ''; }
            for (let i = 0; i < trimmedSentence.length; i += maxChunkSize) {
                chunks.push(trimmedSentence.slice(i, i + maxChunkSize));
            }
        } else if ((currentChunk + trimmedSentence).length > maxChunkSize) {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = trimmedSentence;
        } else {
            currentChunk += (currentChunk ? '。' : '') + trimmedSentence;
        }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks.filter(chunk => chunk.length > 0);
}

async function processBatchedAudioChunks(chunks, voiceName, rate, pitch, volume, style, outputFormat, batchSize = 3, delayMs = 1000) {
    const audioChunks = [];
    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const batchPromises = batch.map(async (chunk, index) => {
            try {
                if (index > 0) await delay(index * 200);
                return await getAudioChunk(chunk, voiceName, rate, pitch, volume, style, outputFormat);
            } catch (error) {
                console.error(`处理音频块失败 (批次 ${Math.floor(i/batchSize) + 1}, 块 ${index + 1}):`, error);
                throw error;
            }
        });
        try {
            const batchResults = await Promise.all(batchPromises);
            audioChunks.push(...batchResults);
            if (i + batchSize < chunks.length) await delay(delayMs);
        } catch (error) {
            console.error(`批次处理失败:`, error);
            throw error;
        }
    }
    return audioChunks;
}

async function getVoice(text, voiceName = "zh-CN-XiaoxiaoNeural", rate = '+0%', pitch = '+0Hz', volume = '+0%', style = "general", outputFormat = "audio-24khz-48kbitrate-mono-mp3") {
    try {
        const cleanText = text.trim();
        if (!cleanText) throw new Error("文本内容为空");

        if (cleanText.length <= 1500) {
            const audioBlob = await getAudioChunk(cleanText, voiceName, rate, pitch, volume, style, outputFormat);
            return new Response(audioBlob, {
                headers: { "Content-Type": "audio/mpeg", ...makeCORSHeaders() }
            });
        }

        const chunks = optimizedTextSplit(cleanText, 1500);
        if (chunks.length > 40) {
            throw new Error(`文本过长，分块数量(${chunks.length})超过限制。请缩短文本或分批处理。`);
        }

        console.log(`文本已分为 ${chunks.length} 个块进行处理`);

        const audioChunks = await processBatchedAudioChunks(
            chunks, voiceName, rate, pitch, volume, style, outputFormat, 3, 800
        );

        const concatenatedAudio = new Blob(audioChunks, { type: 'audio/mpeg' });
        return new Response(concatenatedAudio, {
            headers: { "Content-Type": "audio/mpeg", ...makeCORSHeaders() }
        });
    } catch (error) {
        console.error("语音合成失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: error.message || String(error),
                type: "api_error",
                param: `${voiceName}, ${rate}, ${pitch}, ${volume}, ${style}, ${outputFormat}`,
                code: "edge_tts_error"
            }
        }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
        });
    }
}

async function getAudioChunk(text, voiceName, rate, pitch, volume, style, outputFormat = 'audio-24khz-48kbitrate-mono-mp3', maxRetries = 3) {
    const retryDelay = 500;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const endpoint = await getEndpoint();
            const url = `https://${endpoint.r}.tts.speech.microsoft.com/cognitiveservices/v1`;

            let m = text.match(/\[(\d+)\]\s*?$/);
            let slien = 0;
            if (m && m.length == 2) {
                slien = parseInt(m[1]);
                text = text.replace(m[0], '');
            }

            if (!text.trim()) throw new Error("文本块为空");
            if (text.length > 2000) throw new Error(`文本块过长: ${text.length} 字符，最大支持2000字符`);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": endpoint.t,
                    "Content-Type": "application/ssml+xml",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
                    "X-Microsoft-OutputFormat": outputFormat
                },
                body: getSsml(text, voiceName, rate, pitch, volume, style, slien)
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 429) {
                    if (attempt < maxRetries) {
                        console.log(`频率限制，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                        await delay(retryDelay * (attempt + 1));
                        continue;
                    }
                    throw new Error(`请求频率过高，已重试${maxRetries}次仍失败`);
                } else if (response.status >= 500) {
                    if (attempt < maxRetries) {
                        console.log(`服务器错误，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                        await delay(retryDelay * (attempt + 1));
                        continue;
                    }
                    throw new Error(`Edge TTS服务器错误: ${response.status} ${errorText}`);
                } else {
                    throw new Error(`Edge TTS API错误: ${response.status} ${errorText}`);
                }
            }
            return await response.blob();
        } catch (error) {
            if (attempt === maxRetries) {
                throw new Error(`音频生成失败（已重试${maxRetries}次）: ${error.message}`);
            }
            if (error.message.includes('fetch') || error.message.includes('network')) {
                console.log(`网络错误，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                await delay(retryDelay * (attempt + 1));
                continue;
            }
            throw error;
        }
    }
}

function escapeXmlText(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function getSsml(text, voiceName, rate, pitch, volume, style, slien = 0) {
    const escapedText = escapeXmlText(text);
    let slien_str = '';
    if (slien > 0) slien_str = `<break time="${slien}ms" />`;
    return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="zh-CN"> 
                <voice name="${voiceName}"> 
                    <mstts:express-as style="${style}" styledegree="2.0" role="default"> 
                        <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">${escapedText}</prosody> 
                    </mstts:express-as> 
                    ${slien_str}
                </voice> 
            </speak>`;
}

async function getEndpoint() {
    const now = Date.now() / 1000;
    if (tokenInfo.token && tokenInfo.expiredAt && now < tokenInfo.expiredAt - TOKEN_REFRESH_BEFORE_EXPIRY) {
        return tokenInfo.endpoint;
    }

    const endpointUrl = "https://dev.microsofttranslator.com/apps/endpoint?api-version=1.0";
    const clientId = crypto.randomUUID().replace(/-/g, "");

    try {
        const response = await fetch(endpointUrl, {
            method: "POST",
            headers: {
                "Accept-Language": "zh-Hans",
                "X-ClientVersion": "4.0.530a 5fe1dc6c",
                "X-UserId": "0f04d16a175c411e",
                "X-HomeGeographicRegion": "zh-Hans-CN",
                "X-ClientTraceId": clientId,
                "X-MT-Signature": await sign(endpointUrl),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": "0",
                "Accept-Encoding": "gzip"
            }
        });

        if (!response.ok) throw new Error(`获取endpoint失败: ${response.status}`);

        const data = await response.json();
        const jwt = data.t.split(".")[1];
        const decodedJwt = JSON.parse(atob(jwt));

        tokenInfo = { endpoint: data, token: data.t, expiredAt: decodedJwt.exp };
        return data;
    } catch (error) {
        console.error("获取endpoint失败:", error);
        if (tokenInfo.token) {
            console.log("使用过期的缓存token");
            return tokenInfo.endpoint;
        }
        throw error;
    }
}

function makeCORSHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
        "Access-Control-Max-Age": "86400"
    };
}

async function hmacSha256(key, data) {
    const cryptoKey = await crypto.subtle.importKey(
        "raw", key, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
    return new Uint8Array(signature);
}

async function base64ToBytes(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
}

async function bytesToBase64(bytes) {
    return btoa(String.fromCharCode.apply(null, bytes));
}

function uuid() { return crypto.randomUUID().replace(/-/g, ""); }

async function sign(urlStr) {
    const url = urlStr.split("://")[1];
    const encodedUrl = encodeURIComponent(url);
    const uuidStr = uuid();
    const formattedDate = dateFormat();
    const bytesToSign = `MSTranslatorAndroidApp${encodedUrl}${formattedDate}${uuidStr}`.toLowerCase();
    const decode = await base64ToBytes("oik6PdDdMnOXemTbwvMn9de/h9lFnfBaCWbGMMZqqoSaQaqUOqjVGm5NqsmjcBI1x+sS9ugjB55HEJWRiFXYFw==");
    const signData = await hmacSha256(decode, bytesToSign);
    const signBase64 = await bytesToBase64(signData);
    return `MSTranslatorAndroidApp::${signBase64}::${formattedDate}::${uuidStr}`;
}

function dateFormat() {
    const formattedDate = (new Date()).toUTCString().replace(/GMT/, "").trim() + " GMT";
    return formattedDate.toLowerCase();
}

async function handleFileUpload(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const voice = formData.get('voice') || 'zh-CN-XiaoxiaoNeural';
        const speed = formData.get('speed') || '1.0';
        const volume = formData.get('volume') || '0';
        const pitch = formData.get('pitch') || '0';
        const style = formData.get('style') || 'general';

        if (!file) {
            return new Response(JSON.stringify({
                error: { message: "未找到上传的文件", type: "invalid_request_error", param: "file", code: "missing_file" }
            }), { status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
        }

        if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
            return new Response(JSON.stringify({
                error: { message: "不支持的文件类型，请上传txt文件", type: "invalid_request_error", param: "file", code: "invalid_file_type" }
            }), { status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
        }

        if (file.size > 500 * 1024) {
            return new Response(JSON.stringify({
                error: { message: "文件大小超过限制（最大500KB）", type: "invalid_request_error", param: "file", code: "file_too_large" }
            }), { status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
        }

        const text = await file.text();
        if (!text.trim()) {
            return new Response(JSON.stringify({
                error: { message: "文件内容为空", type: "invalid_request_error", param: "file", code: "empty_file" }
            }), { status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
        }

        if (text.length > 10000) {
            return new Response(JSON.stringify({
                error: { message: "文本内容过长（最大10000字符）", type: "invalid_request_error", param: "file", code: "text_too_long" }
            }), { status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
        }

        let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
        let numVolume = parseInt(String(parseFloat(volume) * 100));
        let numPitch = parseInt(pitch);

        return await getVoice(
            text, voice,
            rate >= 0 ? `+${rate}%` : `${rate}%`,
            numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
            numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
            style,
            "audio-24khz-48kbitrate-mono-mp3"
        );
    } catch (error) {
        console.error("文件上传处理失败:", error);
        return new Response(JSON.stringify({
            error: { message: "文件处理失败", type: "api_error", param: null, code: "file_processing_error" }
        }), { status: 500, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
    }
}

async function handleAudioTranscription(request) {
    try {
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({
                error: { message: "只支持POST方法", type: "invalid_request_error", param: "method", code: "method_not_allowed" }
            }), { status: 405, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
        }

        const contentType = request.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return new Response(JSON.stringify({
                error: { message: "请求必须使用multipart/form-data格式", type: "invalid_request_error", param: "content-type", code: "invalid_content_type" }
            }), { status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
        }

        const formData = await request.formData();
        const audioFile = formData.get('file');
        const customToken = formData.get('token');

        if (!audioFile) {
            return new Response(JSON.stringify({
                error: { message: "未找到音频文件", type: "invalid_request_error", param: "file", code: "missing_file" }
            }), { status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
        }

        if (audioFile.size > 10 * 1024 * 1024) {
            return new Response(JSON.stringify({
                error: { message: "音频文件大小不能超过10MB", type: "invalid_request_error", param: "file", code: "file_too_large" }
            }), { status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
        }

        const allowedTypes = ['audio/mpeg','audio/mp3','audio/wav','audio/m4a','audio/flac','audio/aac','audio/ogg','audio/webm','audio/amr','audio/3gpp'];
        const isValidType = allowedTypes.some(type =>
            audioFile.type.includes(type) ||
            audioFile.name.toLowerCase().match(/\.(mp3|wav|m4a|flac|aac|ogg|webm|amr|3gp)$/i)
        );

        if (!isValidType) {
            return new Response(JSON.stringify({
                error: { message: "不支持的音频文件格式，请上传mp3、wav、m4a、flac、aac、ogg、webm、amr或3gp格式的文件", type: "invalid_request_error", param: "file", code: "invalid_file_type" }
            }), { status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
        }

        const token = customToken || 'sk-wtldsvuprmwltxpbspbmawtolbacghzawnjhtlzlnujjkfhh';

        const apiFormData = new FormData();
        apiFormData.append('file', audioFile);
        apiFormData.append('model', 'FunAudioLLM/SenseVoiceSmall');

        const apiResponse = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: apiFormData
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('硅基流动API错误:', apiResponse.status, errorText);
            let errorMessage = '语音转录服务暂时不可用';
            if (apiResponse.status === 401) errorMessage = 'API Token无效，请检查您的配置';
            else if (apiResponse.status === 429) errorMessage = '请求过于频繁，请稍后再试';
            else if (apiResponse.status === 413) errorMessage = '音频文件太大，请选择较小的文件';

            return new Response(JSON.stringify({
                error: { message: errorMessage, type: "api_error", param: null, code: "transcription_api_error" }
            }), { status: apiResponse.status, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
        }

        const transcriptionResult = await apiResponse.json();
        return new Response(JSON.stringify(transcriptionResult), {
            headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
        });
    } catch (error) {
        console.error("语音转录处理失败:", error);
        return new Response(JSON.stringify({
            error: { message: "语音转录处理失败", type: "api_error", param: null, code: "transcription_processing_error" }
        }), { status: 500, headers: { "Content-Type": "application/json", ...makeCORSHeaders() } });
    }
}
