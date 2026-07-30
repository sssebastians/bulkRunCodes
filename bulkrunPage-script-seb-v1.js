<script>
  if (modeSelector) modeSelector.value = mode;

      var chatbotInput = document.querySelector('.chatbot-input');

      if (mode === 'quiz') {
        if (currentExamScreen === 'dashboard') {
          // Dashboard acts as chat bot
          if (chatbotUI) chatbotUI.style.setProperty('display', 'flex', 'important');
          if (quizUI) quizUI.style.setProperty('display', 'none', 'important');
          if (chatbotInput) chatbotInput.style.setProperty('display', 'block', 'important');
        } else {
          // Player/Editor screen
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

    // Listen to exam screen state to correctly toggle UI while in quiz mode
    document.addEventListener('exam:state-changed', function(e) {
      if (e.detail && e.detail.screen) {
        currentExamScreen = e.detail.screen;
        if (modeSelector && modeSelector.value === 'quiz') {
          updateModeDisplay('quiz');
        }
      }
    });

    if (modeSelector && chatbotUI && quizUI) {
      updateModeDisplay(modeSelector.value);
      modeSelector.addEventListener('change', function(e) {
        updateModeDisplay(e.target.value);
      });
    }
    
    // Bind new Quiz actions from the shared chatbox
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
</script>
