(function() {
  async function startApp() {
    var appRoot = document.getElementById('app-root');
    if (appRoot) {
      try {
        var res = await fetch('https://cdn.jsdelivr.net/gh/sssebastians/bulkRunCodes@main/bulkrunPage-html-seb-v1.html');
        if (!res.ok) throw new Error('HTTP error! Status: ' + res.status);
        appRoot.innerHTML = await res.text();
      } catch (err) {
        console.error('Error fetching CDN HTML:', err);
      }
    }

    if (window.ShopifyAppData) {
      document.querySelectorAll('#rag-app, #shopify-customer').forEach(function(el) {
        el.setAttribute('data-customer-id', window.ShopifyAppData.customerId || '');
      });

      var ragApp = document.getElementById('rag-app');
      if (ragApp) {
        ragApp.setAttribute('data-customer-email', window.ShopifyAppData.customerEmail || '');
        ragApp.setAttribute('data-shop-domain', window.ShopifyAppData.shopDomain || '');
      }
    }

    initApp();
  }

  function initApp() {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
})();
