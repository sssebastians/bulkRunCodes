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
    var modeSelector = document.getElementById('sidebar-mode-selector');[cite: 1]
    var chatbotUI = document.getElementById('chatbot-main-ui');[cite: 1]
    var quizUI = document.getElementById('quiz-main-ui');[cite: 1]
    var chatbotInput = document.querySelector('.chatbot-input');[cite: 1]
    var ragModelSection = document.getElementById('rag-model-section');[cite: 1]
    var ragDriveStatus = document.getElementById('rag-drive-status');[cite: 1]
    var folderInputs = document.getElementById('folder-inputs');[cite: 1]
    var settingsNavButton = document.getElementById('settings-nav-btn');[cite: 1]
    
    var currentExamScreen = 'dashboard';[cite: 1]

    function updateModeDisplay(mode) {
      if (modeSelector) modeSelector.value = mode;[cite: 1]

      if (mode === 'quiz') {[cite: 1]
        if (currentExamScreen === 'dashboard') {[cite: 1]
          if (chatbotUI) chatbotUI.style.setProperty('display', 'flex', 'important');[cite: 1]
          if (quizUI) quizUI.style.setProperty('display', 'none', 'important');[cite: 1]
          if (chatbotInput) chatbotInput.style.setProperty('display', 'block', 'important');[cite: 1]
        } else {
          if (chatbotUI) chatbotUI.style.setProperty('display', 'none', 'important');[cite: 1]
          if (quizUI) quizUI.style.setProperty('display', 'flex', 'important');[cite: 1]
          if (chatbotInput) chatbotInput.style.setProperty('display', 'none', 'important');[cite: 1]
        }

        if (ragModelSection) ragModelSection.style.setProperty('display', 'none', 'important');[cite: 1]
        if (ragDriveStatus) ragDriveStatus.style.setProperty('display', 'none', 'important');[cite: 1]
        
        if (document.getElementById('send-button')) document.getElementById('send-button').style.display = 'none';[cite: 1]
        if (document.getElementById('quiz-parameters-row')) document.getElementById('quiz-parameters-row').style.display = 'flex';[cite: 1]
        if (document.getElementById('quiz-generate-buttons')) document.getElementById('quiz-generate-buttons').style.display = 'flex';[cite: 1]
        if (folderInputs) folderInputs.style.display = 'none';[cite: 1]
      } else {
        if (chatbotUI) chatbotUI.style.setProperty('display', 'flex', 'important');[cite: 1]
        if (quizUI) quizUI.style.setProperty('display', 'none', 'important');[cite: 1]
        if (chatbotInput) chatbotInput.style.setProperty('display', 'block', 'important');[cite: 1]
        
        if (document.getElementById('send-button')) document.getElementById('send-button').style.display = 'inline-block';[cite: 1]
        if (document.getElementById('quiz-parameters-row')) document.getElementById('quiz-parameters-row').style.display = 'none';[cite: 1]
        if (document.getElementById('quiz-generate-buttons')) document.getElementById('quiz-generate-buttons').style.display = 'none';[cite: 1]
        if (folderInputs) folderInputs.style.display = mode === 'bulkrun' ? 'flex' : 'none';[cite: 1]

        if (mode === 'llm' || mode === 'bulkrun') {[cite: 1]
          if (ragModelSection) ragModelSection.style.setProperty('display', 'none', 'important');[cite: 1]
          if (ragDriveStatus) ragDriveStatus.style.setProperty('display', 'none', 'important');[cite: 1]
        } else {
          if (ragModelSection) ragModelSection.style.setProperty('display', 'flex', 'important');[cite: 1]
          if (ragDriveStatus) ragDriveStatus.style.setProperty('display', 'flex', 'important');[cite: 1]
        }
      }
    }

    if (settingsNavButton) {[cite: 1]
      settingsNavButton.addEventListener('click', function() {[cite: 1]
        window.open('/pages/settings-v15', '_blank', 'noopener,noreferrer');[cite: 1]
      });
    }

    if (modeSelector) {[cite: 1]
      updateModeDisplay(modeSelector.value);[cite: 1]
      modeSelector.addEventListener('change', function(e) {[cite: 1]
        updateModeDisplay(e.target.value);[cite: 1]
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
})();
