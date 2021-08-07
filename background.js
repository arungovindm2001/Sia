// On Install
chrome.runtime.onInstalled.addListener(function (details) {
  chrome.storage.sync.set({ ["assistant_enable"]: 1 });
  if (details.reason == "install") {
    chrome.tabs.create(
      { url: `chrome-extension://${chrome.runtime.id}/options.html` },
      function (tab) {}
    );
    // Setting on new install
    // chrome.runtime.setUninstallURL(" ");
  } else if (details.reason == "update") {
    // Setting for everyone else having already installed
    // chrome.runtime.setUninstallURL(" ");
  }

  chrome.storage.sync.set({ ["clickedColor"]: "#3399FF80" });
  chrome.storage.sync.set({ ["fontFamily"]: "open-dyslexic-regular" });
  chrome.storage.sync.set({ ["fontTypeButton"]: false });
  chrome.storage.sync.set({ ["cursorType"]: "arrow.png" });
  chrome.storage.sync.set({ ["cursorTypeButton"]: false });
  chrome.storage.sync.set({ ["fontSizeButton"]: false });
  chrome.storage.sync.set({ ["fontColorButton"]: false });
  chrome.storage.sync.set({ ["fontColor"]: "#C0382B" });
  chrome.storage.sync.set({ ["fontColorId"]: "color-12" });
  chrome.storage.sync.set({ ["magnifyButton"]: false });
  chrome.storage.sync.set({ ["imageVeilButton"]: false });
  chrome.storage.sync.set({ ["highlightWordsButton"]: false });
  chrome.storage.sync.set({ ["emphasizeLinksButton"]: false });
  chrome.storage.sync.set({ ["textStrokeButton"]: false });
  chrome.storage.sync.set({ ["textStrokeColor"]: "#C0382B" });
  chrome.storage.sync.set({ ["textStrokeColorId"]: "color-12" });
  chrome.storage.sync.set({ ["scrollValue"]: 0 });
  chrome.storage.sync.set({ ["magnifierSizeSlider"]: 50 });
  chrome.storage.sync.set({ ["magnificationSlider"]: 3 });
});

// On Tab Change
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.storage.sync.get(
    [
      "fontFamily",
      "fontTypeButton",
      "cursorType",
      "cursorTypeButton",
      "fontSizeButton",
      "fontSizeSlider",
      "fontColorButton",
      "fontColor",
      "magnifyButton",
      "highlightWordsButton",
      "imageVeilButton",
      "emphasizeLinksButton",
      "textStrokeButton",
      "textStrokeColor",
      "magnifierSizeSlider",
      "magnificationSlider",
    ],
    function (stored) {
      if (stored.fontTypeButton) {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "fontFamily",
          fontFamily: stored.fontFamily,
          checkedButton: 1,
        });
      } else {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "fontFamily",
          checkedButton: 0,
        });
      }

      if (stored.cursorTypeButton) {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "cursorType",
          cursorType: stored.cursorType,
          checkedButton: 1,
        });
      } else {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "cursorType",
          checkedButton: 0,
        });
      }

      if (stored.fontSizeButton) {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "fontSize",
          fontSize: stored.fontSizeSlider,
          checkedButton: 1,
        });
      } else {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "fontSize",
          checkedButton: 0,
        });
      }

      if (stored.fontColorButton) {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "fontColor",
          fontColor: stored.fontColor,
          checkedButton: 1,
        });
      } else {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "fontColor",
          checkedButton: 0,
        });
      }

      if (stored.magnifyButton) {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "magnify",
          magnifierSize: stored.magnifierSizeSlider,
          magnification: stored.magnificationSlider,
          checkedButton: 1,
        });
      } else {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "magnify",
          checkedButton: 0,
        });
      }

      chrome.tabs.sendMessage(activeInfo.tabId, {
        todo: "imageVeil",
        checkedButton: stored.imageVeilButton ? 1 : 0,
      });

      chrome.tabs.sendMessage(activeInfo.tabId, {
        todo: "highlight",
        checkedButton: stored.highlightWordsButton ? 1 : 0,
      });

      chrome.tabs.sendMessage(activeInfo.tabId, {
        todo: "emphasizeLinks",
        checkedButton: stored.emphasizeLinksButton ? 1 : 0,
      });

      if (stored.textStrokeButton) {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "textStroke",
          textStrokeColor: stored.textStrokeColor,
          checkedButton: 1,
        });
      } else {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          todo: "textStroke",
          checkedButton: 0,
        });
      }
    }
  );
});

chrome.runtime.onConnect.addListener(function (port) {
  var temp;
  console.assert(port.name == "performAction");
  port.onMessage.addListener(function (msg) {
    if (msg.action == "open") {
      temp = msg.result;
      if (temp != null && temp !== "undefined") {
        chrome.tabs.create({
          url: temp,
        });
      }
      port.postMessage({ response: "ok" });
    } else if (msg.action == "play") {
      temp = msg.result;

      if (temp != null && temp !== "undefined") {
        chrome.tabs.create({
          url: temp,
        });
      }
      port.postMessage({ response: "ok" });
    } else if (msg.action == "translate") {
      temp = msg.result;
      if (temp != null && temp !== "undefined") {
        chrome.tabs.create({
          url: temp,
        });
      }
      port.postMessage({ response: "ok" });
    } else if (msg.action == "direction") {
      temp = msg.result;
      if (temp != null && temp !== "undefined") {
        chrome.tabs.create({
          url: temp,
        });
      }
      port.postMessage({ response: "ok" });
    }
  });
});

// Context Menu
var menuItem = {
  id: "Speak",
  title: "Speak",
  contexts: ["selection"],
};

chrome.contextMenus.create(menuItem);

chrome.contextMenus.onClicked.addListener(function (clickData, tabdata) {
  if (clickData.menuItemId == "Speak" && clickData.selectionText) {
    chrome.tabs.sendMessage(tabdata.id, {
      todo: "speakTTS",
      selectedText: clickData.selectionText,
    });
  }
});

// Chrome Screenshot
var id = 100;
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.todo == "screenshot") {
    chrome.tabs.captureVisibleTab({ format: "png" }, function (screenshotUrl) {
      chrome.storage.local.set({ ["setScreenshot"]: screenshotUrl });

      var viewTabUrl = chrome.runtime.getURL("screenshot.html?id=" + id);
      var targetId = null;
      chrome.tabs.create({ url: viewTabUrl }, function (tab) {
        targetId = tab.id;
      });
    });
  }
});

// Keyboard Shortcuts
chrome.commands.onCommand.addListener(function (command) {
  chrome.storage.sync.get(
    [
      "imageVeilButton",
      "highlightWordsButton",
      "magnifyButton",
      "magnifierSizeSlider",
      "magnificationSlider",
      "emphasizeLinksButton",
    ],
    function (stored) {
      if (command === "toggle-image-veil") {
        if (stored.imageVeilButton) {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                todo: "imageVeil",
                checkedButton: 0,
              });
            }
          );
          chrome.storage.sync.set({
            ["imageVeilButton"]: 0,
          });
        } else {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                todo: "imageVeil",
                checkedButton: 1,
              });
            }
          );
          chrome.storage.sync.set({
            ["imageVeilButton"]: 1,
          });
        }
      }

      if (command === "toggle-highlight-words") {
        if (stored.highlightWordsButton) {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                todo: "highlight",
                checkedButton: 0,
              });
            }
          );
          chrome.storage.sync.set({
            ["highlightWordsButton"]: 0,
          });
        } else {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                todo: "highlight",
                checkedButton: 1,
              });
            }
          );
          chrome.storage.sync.set({
            ["highlightWordsButton"]: 1,
          });
        }
      }

      if (command === "toggle-magnifier") {
        if (stored.magnifyButton) {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                todo: "magnify",
                checkedButton: 0,
              });
            }
          );
          chrome.storage.sync.set({
            ["magnifyButton"]: false,
          });
        } else {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                todo: "magnify",
                magnifierSize: stored.magnifierSizeSlider,
                magnification: stored.magnificationSlider,
                checkedButton: 1,
              });
            }
          );
          chrome.storage.sync.set({
            ["magnifyButton"]: true,
          });
        }
      }

      if (command === "toggle-emphasize-links") {
        if (stored.emphasizeLinksButton) {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                todo: "emphasizeLinks",
                checkedButton: 0,
              });
            }
          );
          chrome.storage.sync.set({
            ["emphasizeLinksButton"]: 0,
          });
        } else {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                todo: "emphasizeLinks",
                checkedButton: 1,
              });
            }
          );
          chrome.storage.sync.set({
            ["emphasizeLinksButton"]: 1,
          });
        }
      }
    }
  );
});
