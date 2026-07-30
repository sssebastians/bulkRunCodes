<script>
(function() {
  function initApp() {
    // 1. Grab DOM elements safely inside function scope
    var modeSelector = document.getElementById('sidebar-mode-selector');
    var chatbotUI = document.getElementById('chatbot-main-ui');
    var quizUI = document.getElementById('quiz-main-ui');
    var chatbotInput = document.querySelector('.chatbot-input');
    var ragModelSection = document.getElementById('rag-model-section');
    var ragDriveStatus = document.getElementById('rag-drive-status');
    var folderInputs = document.getElementById('folder-inputs');
    var settingsNavButton = document.getElementById('settings-nav-btn');
    
    var currentExamScreen = 'dashboard';

    function updateModeDisplay(mode) {
      if (modeSelector) modeSelector.value = mode;

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
        if (document.getElementById('quiz-parameters-row')) document.getElementById('quiz-parameters-row').style.display = 'flex';
        if (document.getElementById('quiz-generate-buttons')) document.getElementById('quiz-generate-buttons').style.display = 'flex';
        if (folderInputs) folderInputs.style.display = 'none';
      } else {
        if (chatbotUI) chatbotUI.style.setProperty('display', 'flex', 'important');
        if (quizUI) quizUI.style.setProperty('display', 'none', 'important');
        if (chatbotInput) chatbotInput.style.setProperty('display', 'block', 'important');
        
        if (document.getElementById('send-button')) document.getElementById('send-button').style.display = 'inline-block';
        if (document.getElementById('quiz-parameters-row')) document.getElementById('quiz-parameters-row').style.display = 'none';
        if (document.getElementById('quiz-generate-buttons')) document.getElementById('quiz-generate-buttons').style.display = 'none';
        if (folderInputs) folderInputs.style.display = mode === 'bulkrun' ? 'flex' : 'none';

        if (mode === 'llm' || mode === 'bulkrun') {
          if (ragModelSection) ragModelSection.style.setProperty('display', 'none', 'important');
          if (ragDriveStatus) ragDriveStatus.style.setProperty('display', 'none', 'important');
        } else {
          if (ragModelSection) ragModelSection.style.setProperty('display', 'flex', 'important');
          if (ragDriveStatus) ragDriveStatus.style.setProperty('display', 'flex', 'important');
        }
      }
    }

    if (settingsNavButton) {
      settingsNavButton.addEventListener('click', function() {
        window.open('/pages/settings-v15', '_blank', 'noopener,noreferrer');
      });
    }

    if (modeSelector) {
      updateModeDisplay(modeSelector.value);
      modeSelector.addEventListener('change', function(e) {
        updateModeDisplay(e.target.value);
      });
    }
  }

  // Safe check: If DOM is already interactive/complete, run immediately. Otherwise wait for DOMContentLoaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
</script>
