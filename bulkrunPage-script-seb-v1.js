(function() {
  // Add any present or future store mappings here
  var MODE_STORE_MAP = {
    bulkrun: 'data-entry-test',
    llm: 'llm-no-stream'
  };

  function updateBotSelectorForMode(mode) {
    var botSelector = document.getElementById('bot-selector');
    
    // Retrieve store ID dynamically
    var storeId = MODE_STORE_MAP[mode] || 'llm-no-stream';

    if (botSelector) {
        botSelector.setAttribute('data-store-id', storeId);
        botSelector.dataset.storeId = storeId;
        botSelector.style.display = 'inline-block';
    }

    // Keep global storeId updated
    window.storeId = storeId;

    // Trigger dynamic fetch in Shopify central script
    if (typeof window.getBots === 'function') {
        window.getBots(storeId);
    } else if (typeof window.getBotsData === 'function') {
        window.getBotsData(storeId);
    }
  }

  function initApp() {
    var modeSelector = document.getElementById('sidebar-mode-selector');
    var chatbotUI = document.getElementById('chatbot-main-ui');
    var quizUI = document.getElementById('quiz-main-ui');
    var ragModelSection = document.getElementById('rag-model-section');
    var ragDriveStatus = document.getElementById('rag-drive-status');
    var folderInputs = document.getElementById('folder-inputs');
    var settingsNavButton = document.getElementById('settings-nav-btn');
    var inputProviderSelector = document.getElementById('input-provider-selector');
    var outputProviderSelector = document.getElementById('output-provider-selector');
    var unifiedInputButton = document.getElementById('choose-input-folder');
    var unifiedOutputButton = document.getElementById('choose-output-folder');

    var inputButtonMap = {
      dropbox: document.getElementById('choose-folder'),
      gdrive: document.getElementById('choose-gdrive'),
      onedrive: document.getElementById('choose-od-input')
    };

    var outputButtonMap = {
      dropbox: document.getElementById('choose-db-output'),
      gdrive: document.getElementById('choose-output'),
      onedrive: document.getElementById('choose-od-output')
    };

    window.chatModeStates = {
      rag: { html: '', chatHistory: [], userHistory: [] },
      llm: { html: '', chatHistory: [], userHistory: [] },
      quiz: { html: '', chatHistory: [], userHistory: [] },
      bulkrun: { html: '', chatHistory: [], userHistory: [] }
    };
    var previousMode = modeSelector ? modeSelector.value : 'rag';
    var currentExamScreen = window.ExamApp && window.ExamApp.state ? window.ExamApp.state.screen : 'dashboard';

    function updateModeDisplay(mode) {
      // Save state before switching away from a chat mode
      if (previousMode !== mode) {
        var msgDiv = document.querySelector('.chatbot-messages');
        if (msgDiv && window.chatModeStates[previousMode]) {
          window.chatModeStates[previousMode] = {
            html: msgDiv.innerHTML,
            chatHistory: typeof window.chatHistory !== 'undefined' ? [...window.chatHistory] : [],
            userHistory: typeof window.userHistory !== 'undefined' ? [...window.userHistory] : []
          };
        }
      }

      // Restore state when entering a chat mode
      if (previousMode !== mode) {
        var msgDiv = document.querySelector('.chatbot-messages');
        if (msgDiv && window.chatModeStates[mode]) {
          msgDiv.innerHTML = window.chatModeStates[mode].html || '';
          window.chatHistory = [...window.chatModeStates[mode].chatHistory];
          window.userHistory = [...window.chatModeStates[mode].userHistory];
        }
      }
      
      previousMode = mode;

      if (modeSelector) modeSelector.value = mode;

      // Trigger bot reload for current mode storeId
      updateBotSelectorForMode(mode);

      var chatbotInput = document.querySelector('.chatbot-input');

      if (mode === 'quiz') {
        if (currentExamScreen === 'dashboard') {
          if (chatbotUI) chatbotUI.style.setProperty('display', 'flex', 'important');
          if (quizUI) quizUI.style.setProperty('display', 'none', 'important');
          if (chatbotInput) chatbotInput.style.setProperty('display', 'block', 'important');
        } else {
          if (chatbotUI) chatbotUI.style.setProperty('display', 'none', 'important');
          if (quizUI) quizUI.style.setProperty('display', 'flex', 'important');
          if (chatbotInput) chatbotInput.style.setProperty('display', 'none', 'important');
        }

        if (ragModelSection) ragModelSection.style.setProperty('display', 'none', 'important');
        if (ragDriveStatus) ragDriveStatus.style.setProperty('display', 'none', 'important');
        
        if (document.getElementById('send-button')) document.getElementById('send-button').style.display = 'none';
        if (document.getElementById('sidebar-mode-selector')) document.getElementById('sidebar-mode-selector').style.display = 'inline-block';
        if (document.getElementById('quiz-parameters-row')) document.getElementById('quiz-parameters-row').style.display = 'flex';
        if (document.getElementById('quiz-generate-buttons')) document.getElementById('quiz-generate-buttons').style.display = 'flex';
        if (folderInputs) folderInputs.style.display = 'none';
      } else {
        if (chatbotUI) chatbotUI.style.setProperty('display', 'flex', 'important');
        if (quizUI) quizUI.style.setProperty('display', 'none', 'important');
        if (chatbotInput) chatbotInput.style.setProperty('display', 'block', 'important');
        
        if (document.getElementById('send-button')) document.getElementById('send-button').style.display = 'inline-block';
        if (document.getElementById('sidebar-mode-selector')) document.getElementById('sidebar-mode-selector').style.display = 'inline-block';
        if (document.getElementById('quiz-parameters-row')) document.getElementById('quiz-parameters-row').style.display = 'none';
        if (document.getElementById('quiz-generate-buttons')) document.getElementById('quiz-generate-buttons').style.display = 'none';
        if (folderInputs) folderInputs.style.display = mode === 'bulkrun' ? 'flex' : 'none';

        if (mode === 'llm') {
          if (ragModelSection) ragModelSection.style.setProperty('display', 'none', 'important');
          if (ragDriveStatus) ragDriveStatus.style.setProperty('display', 'none', 'important');
        } else {
          if (ragModelSection) ragModelSection.style.setProperty('display', 'flex', 'important');
          if (ragDriveStatus) ragDriveStatus.style.setProperty('display', 'flex', 'important');
        }

        if (mode === 'bulkrun') {
          if (ragModelSection) ragModelSection.style.setProperty('display', 'none', 'important');
          if (ragDriveStatus) ragDriveStatus.style.setProperty('display', 'none', 'important');
        }
      }
    }

    function clickMappedButton(map, selector) {
      var provider = selector ? selector.value : 'dropbox';
      var target = map[provider];
      if (target) target.click();
    }

    if (unifiedInputButton) {
      unifiedInputButton.addEventListener('click', function() {
        clickMappedButton(inputButtonMap, inputProviderSelector);
      });
    }

    if (unifiedOutputButton) {
      unifiedOutputButton.addEventListener('click', function() {
        clickMappedButton(outputButtonMap, outputProviderSelector);
      });
    }

    // --- Settings page opener ---
    if (settingsNavButton) {
      settingsNavButton.addEventListener('click', function() {
        window.open('/pages/settings-v15', '_blank', 'noopener,noreferrer');
      });
    }

    function bindSelectedFolderVisibility(elementId) {
      var element = document.getElementById(elementId);
      if (!element) return;

      function syncVisibility() {
        var hasValue = (element.textContent || '').trim().length > 0;
        element.style.display = hasValue ? '' : 'none';
      }

      syncVisibility();
      var observer = new MutationObserver(syncVisibility);
      observer.observe(element, { childList: true, subtree: true, characterData: true });
    }

    bindSelectedFolderVisibility('selected-input-folder');
    bindSelectedFolderVisibility('selected-output-folder');

    document.addEventListener('exam:state-changed', function(e) {
      if (e.detail && e.detail.screen) {
        currentExamScreen = e.detail.screen;
        if (modeSelector && modeSelector.value === 'quiz') {
          updateModeDisplay('quiz');
        }
      }
    });

    if (modeSelector) {
      // Trigger initial state load
      updateModeDisplay(modeSelector.value);

      // Listen for dropdown changes
      modeSelector.addEventListener('change', function(e) {
        updateModeDisplay(e.target.value);
      });
    }
    
    // Bind Quiz actions from the shared chatbox
    var btnEdit = document.getElementById('quiz-generate-edit-btn');
    var btnStart = document.getElementById('quiz-generate-start-btn');
    var btnUpload = document.getElementById('chatbot-upload-questions-btn');
    var promptInput = document.getElementById('chatbot-input-field');
    
    function getQuizParams() {
      return {
        prompt: promptInput ? promptInput.value.trim() : '',
        quizTitle: document.getElementById('quiz-chat-title') ? document.getElementById('quiz-chat-title').value.trim() : '',
        quizSubtitle: document.getElementById('quiz-chat-subtitle') ? document.getElementById('quiz-chat-subtitle').value.trim() : '',
        numMc: parseInt(document.getElementById('quiz-param-mc').value || '5', 10),
        numQa: parseInt(document.getElementById('quiz-param-qa').value || '0', 10),
        passThreshold: parseInt(document.getElementById('quiz-param-pass').value || '60', 10),
        countdownTime: parseInt(document.getElementById('quiz-param-time').value || '30', 10),
        shuffleQuestions: document.getElementById('quiz-param-shuffle').checked
      };
    }
    
    if (btnEdit) {
      btnEdit.addEventListener('click', function(e) {
        e.preventDefault();
        var p = getQuizParams();
        if (!p.prompt) return alert('Please enter a prompt to generate questions.');
        if (!p.quizTitle) return alert('Please enter a Quiz Title.');
        if (p.numMc === 0 && p.numQa === 0) return alert('Please enter at least one question (MC or Q&A).');
        if (window.generateQuizFromChatbox) window.generateQuizFromChatbox(p, 'edit');
      });
    }
    
    if (btnStart) {
      btnStart.addEventListener('click', function(e) {
        e.preventDefault();
        var p = getQuizParams();
        if (!p.prompt) return alert('Please enter a prompt to generate questions.');
        if (!p.quizTitle) return alert('Please enter a Quiz Title.');
        if (p.numMc === 0 && p.numQa === 0) return alert('Please enter at least one question (MC or Q&A).');
        if (window.generateQuizFromChatbox) window.generateQuizFromChatbox(p, 'start');
      });
    }
    
    if (btnUpload) {
      btnUpload.addEventListener('click', function(e) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('exam:go-upload'));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
