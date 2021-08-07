var assistant_start = 0;

// Building Font palette within popup.html [Keep this above popup load function]
var colors = [
  "#1FBC9C",
  "#1CA085",
  "#2ECC70",
  "#27AF60",
  "#3398DB",
  "#2980B9",
  "#A463BF",
  "#3D556E",
  "#222F3D",
  "#F2C511",
  "#F39C19",
  "#E84A3C",
  "#C0382B",
  "#DDE6E8",
  "#BDC3C8",
];

for (var i = 0; i < colors.length; i++) {
  var input = document.createElement("input");
  input.type = "radio";
  input.name = "color";
  input.id = "color-" + i;
  input.value = colors[i];
  if (i == 12) {
    input.checked = true;
  }
  var label = document.createElement("label");
  label.htmlFor = "color-" + i;
  var span = document.createElement("span");
  span.setAttribute("class", "color-" + i);
  span.setAttribute("style", "background-color:" + colors[i]);
  label.appendChild(span);
  document.getElementsByClassName("color-picker")[0].appendChild(input);
  document.getElementsByClassName("color-picker")[0].appendChild(label);
}

for (var i = 0; i < colors.length; i++) {
  var input = document.createElement("input");
  input.type = "radio";
  input.name = "ts-color";
  input.id = "ts-color-" + i;
  input.value = colors[i];
  if (i == 12) {
    input.checked = true;
  }
  var label = document.createElement("label");
  label.htmlFor = "ts-color-" + i;
  var span = document.createElement("span");
  span.setAttribute("class", "color-" + i);
  span.setAttribute("style", "background-color:" + colors[i]);
  label.appendChild(span);
  document.getElementsByClassName("ts-color-picker")[0].appendChild(input);
  document.getElementsByClassName("ts-color-picker")[0].appendChild(label);
}

// On popup load function
$(function () {
  chrome.storage.sync.get("assistant_enable", function (stored) {
    if (stored.assistant_enable) {
      $(".activation-button").attr("src", "images/microphone-on.png");
      isStopButtonClicked = false;
      assistant_start = 1;
      startTracking();
    } else {
      $(".activation-button").attr("src", "images/microphone-disable.png");
    }
  });

  // Font Slider Setting
  chrome.storage.sync.get("fontSizeSlider", function (stored) {
    $("#fontSizeSlider_value").html(stored.fontSizeSlider);
    $("#fontSizeSlider").val(stored.fontSizeSlider);
  });

  chrome.storage.sync.get("fontFamily", function (stored) {
    $("#fontTypeDropDown").val(stored.fontFamily);
  });

  chrome.storage.sync.get("fontTypeButton", function (stored) {
    $("#fontTypeButton").prop("checked", stored.fontTypeButton);
    if (stored.fontTypeButton) {
      document.getElementById("font-type-switch-header").textContent = "On";
    } else {
      document.getElementById("font-type-switch-header").textContent = "Off";
    }
  });

  chrome.storage.sync.get("cursorType", function (stored) {
    $("#cursorTypeDropDown").val(stored.cursorType);
  });

  chrome.storage.sync.get("cursorTypeButton", function (stored) {
    $("#cursorTypeButton").prop("checked", stored.cursorTypeButton);
    if (stored.cursorTypeButton) {
      document.getElementById("cursor-type-switch-header").textContent = "On";
    } else {
      document.getElementById("cursor-type-switch-header").textContent = "Off";
    }
  });

  chrome.storage.sync.get("fontSizeButton", function (stored) {
    $("#fontSizeButton").prop("checked", stored.fontSizeButton);

    if (stored.fontSizeButton) {
      document.getElementById("font-size-switch-header").textContent = "On";
    } else {
      document.getElementById("font-size-switch-header").textContent = "Off";
    }
  });

  // Font Color Button Setting
  chrome.storage.sync.get("fontColorButton", function (stored) {
    $("#fontColorButton").prop("checked", stored.fontColorButton);

    if (stored.fontColorButton) {
      document.getElementById("font-color-switch-header").textContent = "On";
    } else {
      document.getElementById("font-color-switch-header").textContent = "Off";
    }
  });

  // Font Color Palette Setting
  chrome.storage.sync.get("fontColorId", function (stored) {
    $("#" + stored.fontColorId).attr("checked", true);
  });

  // Magnify Button Setting
  chrome.storage.sync.get("magnifyButton", function (stored) {
    $("#magnifierButton").prop("checked", stored.magnifyButton);
  });

  // Magnifier Size Setting
  chrome.storage.sync.get("magnifierSizeSlider", function (stored) {
    $("#magnifierSizeSlider_value").html(stored.magnifierSizeSlider);
    $("#magnifierSizeSlider").val(stored.magnifierSizeSlider);
  });

  // Magnification Setting
  chrome.storage.sync.get("magnificationSlider", function (stored) {
    $("#magnificationSlider_value").html(stored.magnificationSlider);
    $("#magnificationSlider").val(stored.magnificationSlider);
  });

  // Image Veil Setting
  chrome.storage.sync.get("imageVeilButton", function (stored) {
    $("#imageVeilButton").prop("checked", stored.imageVeilButton);
  });

  // Highlight Words Setting
  chrome.storage.sync.get("highlightWordsButton", function (stored) {
    $("#highlightWordsButton").prop("checked", stored.highlightWordsButton);
  });

  // Emphasize Links Setting
  chrome.storage.sync.get("emphasizeLinksButton", function (stored) {
    $("#emphasizeLinksButton").prop("checked", stored.emphasizeLinksButton);
  });

  // Text Stroke Setting
  chrome.storage.sync.get("textStrokeButton", function (stored) {
    $("#textStrokeButton").prop("checked", stored.textStrokeButton);
  });
  chrome.storage.sync.get("scrollValue", function (stored) {
    $("html, body").animate({ scrollTop: stored.scrollValue });
  });
});

// Font Type || Font Family button bind
$("#fontTypeButton").bind("change", function () {
  if ($(this).is(":checked")) {
    document.getElementById("font-type-switch-header").textContent = "On";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "fontFamily",
        fontFamily: $("#fontTypeDropDown").val(),
        checkedButton: 1,
      });
    });
  } else {
    document.getElementById("font-type-switch-header").textContent = "Off";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "fontFamily",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({ ["fontFamily"]: $("#fontTypeDropDown").val() });
  chrome.storage.sync.set({ ["fontTypeButton"]: $(this).is(":checked") });
});

// Font Type || Font Family drop down bind
$("#fontTypeDropDown").change(function (data) {
  if ($("#fontTypeButton").is(":checked")) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "fontFamily",
        fontFamily: $(data.target).val(),
        checkedButton: 1,
      });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "fontFamily",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({ ["fontFamily"]: $(data.target).val() });
  // chrome.storage.sync.set({
  // 	["fontTypeButton"]: $("#fontTypeButton").is(":checked"),
  // });
});

// Cursor Type Button
$("#cursorTypeButton").bind("change", function () {
  if ($(this).is(":checked")) {
    document.getElementById("cursor-type-switch-header").textContent = "On";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "cursorType",
        cursorType: $("#cursorTypeDropDown").val(),
        checkedButton: 1,
      });
    });
  } else {
    document.getElementById("cursor-type-switch-header").textContent = "Off";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "cursorType",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({ ["cursorType"]: $("#cursorTypeDropDown").val() });
  chrome.storage.sync.set({ ["cursorTypeButton"]: $(this).is(":checked") });
});

// Cursor Type DropDown Bind
$("#cursorTypeDropDown").change(function (data) {
  if ($("#cursorTypeButton").is(":checked")) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "cursorType",
        cursorType: $(data.target).val(),
        checkedButton: 1,
      });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "cursorType",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({ ["cursorType"]: $(data.target).val() });
});

//Font Size Slider
$(document).on("input", "#fontSizeSlider", function (data) {
  $("#fontSizeSlider_value").html($(data.target).val());
  if ($("#fontSizeButton").is(":checked")) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "fontSize",
        fontSize: $(data.target).val(),
        checkedButton: 1,
      });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "fontSize",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({ ["fontSizeSlider"]: $(data.target).val() });
});

//Font Size Slider Button
$("#fontSizeButton").bind("change", function (data) {
  if ($(data.target).is(":checked")) {
    document.getElementById("font-size-switch-header").textContent = "On";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "fontSize",
        fontSize: $("#fontSizeSlider").val(),
        checkedButton: 1,
      });
    });
  } else {
    document.getElementById("font-size-switch-header").textContent = "Off";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "fontSize",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({ ["fontSizeSlider"]: $("#fontSizeSlider").val() });
  chrome.storage.sync.set({
    ["fontSizeButton"]: $(data.target).is(":checked"),
  });
});

//Font Color Button
$("#fontColorButton").bind("change", function (data) {
  var pickedColor = $("input[name=color]:checked");
  if ($(data.target).is(":checked")) {
    document.getElementById("font-color-switch-header").textContent = "On";
    if (pickedColor.length > 0) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          todo: "fontColor",
          fontColor: pickedColor[0].value,
          checkedButton: 1,
        });
      });
    }
  } else {
    document.getElementById("font-color-switch-header").textContent = "Off";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "fontColor",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({
    ["fontColor"]: pickedColor.length > 0 ? pickedColor[0].value : "#C0382B",
  });
  chrome.storage.sync.set({
    ["fontColorId"]: pickedColor.length > 0 ? pickedColor[0].id : "color-12",
  });
  chrome.storage.sync.set({
    ["fontColorButton"]: $(data.target).is(":checked"),
  });
});

// Font Color Palette
$("input[name=color]").bind("change", function (data) {
  if ($("#fontColorButton").is(":checked")) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "fontColor",
        fontColor: $(data.target).val(),
        checkedButton: 1,
      });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "fontColor",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({ ["fontColor"]: $(data.target).val() });
  chrome.storage.sync.set({ ["fontColorId"]: $(data.target).attr("id") });
});

// Magnifier Button
$("#magnifierButton").bind("change", function (data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: "magnify",
      magnifierSize: $("#magnifierSizeSlider").val(),
      magnification: $("#magnificationSlider").val(),
      checkedButton: $(data.target).is(":checked") ? 1 : 0,
    });
  });
  chrome.storage.sync.set({
    ["magnifyButton"]: $(data.target).is(":checked"),
  });
});

//Magnifier Size Slider
$(document).on("input", "#magnifierSizeSlider", function (data) {
  $("#magnifierSizeSlider_value").html($(data.target).val());
  if ($("#magnifierButton").is(":checked")) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "magnify",
        magnifierSize: $(data.target).val(),
        magnification: $("#magnificationSlider").val(),
        checkedButton: 1,
      });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "magnify",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({ ["magnifierSizeSlider"]: $(data.target).val() });
});

//Magnification Slider
$(document).on("input", "#magnificationSlider", function (data) {
  $("#magnificationSlider_value").html($(data.target).val());
  if ($("#magnifierButton").is(":checked")) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "magnify",
        magnifierSize: $("#magnifierSizeSlider").val(),
        magnification: $(data.target).val(),
        checkedButton: 1,
      });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "magnify",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({ ["magnificationSlider"]: $(data.target).val() });
});

// Image Veil Button
$("#imageVeilButton").bind("change", function (data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: "imageVeil",
      checkedButton: $(data.target).is(":checked") ? 1 : 0,
    });
  });
  chrome.storage.sync.set({
    ["imageVeilButton"]: $(data.target).is(":checked"),
  });
});

// Highlight Words Button
$("#highlightWordsButton").bind("change", function (data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: "highlight",
      checkedButton: $(data.target).is(":checked") ? 1 : 0,
    });
  });
  chrome.storage.sync.set({
    ["highlightWordsButton"]: $(data.target).is(":checked"),
  });
});

// Emphasize Links Button
$("#emphasizeLinksButton").bind("change", function (data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: "emphasizeLinks",
      checkedButton: $(data.target).is(":checked") ? 1 : 0,
    });
  });
  chrome.storage.sync.set({
    ["emphasizeLinksButton"]: $(data.target).is(":checked"),
  });
});

//Text Stroke Button
$("#textStrokeButton").bind("change", function (data) {
  var pickedColor = $("input[name=ts-color]:checked");
  if ($(data.target).is(":checked")) {
    if (pickedColor.length > 0) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          todo: "textStroke",
          textStrokeColor: pickedColor[0].value,
          checkedButton: 1,
        });
      });
    }
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "textStroke",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({
    ["textStrokeColor"]:
      pickedColor.length > 0 ? pickedColor[0].value : "#C0382B",
  });
  chrome.storage.sync.set({
    ["textStrokeColorId"]:
      pickedColor.length > 0 ? pickedColor[0].id : "color-12",
  });
  chrome.storage.sync.set({
    ["textStrokeButton"]: $(data.target).is(":checked"),
  });
});

// Text Stroke Color Palette
$("input[name=ts-color]").bind("change", function (data) {
  if ($("#textStrokeButton").is(":checked")) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "textStroke",
        textStrokeColor: $(data.target).val(),
        checkedButton: 1,
      });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "textStroke",
        checkedButton: 0,
      });
    });
  }
  chrome.storage.sync.set({ ["textStrokeColor"]: $(data.target).val() });
  chrome.storage.sync.set({ ["textStrokeColorId"]: $(data.target).attr("id") });
});

// Speech Recognition
const startButton = document.getElementsByClassName("activation-button")[0];
startButton.addEventListener("click", function () {
  chrome.storage.sync.get("assistant_enable", function (stored) {
    if (stored.assistant_enable) {
      if (assistant_start) {
        $(".activation-button").attr("src", "images/microphone-off.png");
        assistant_start = 0;
        isStopButtonClicked = true;
        stopTracking();
      } else {
        $(".activation-button").attr("src", "images/microphone-on.png");
        isStopButtonClicked = false;
        assistant_start = 1;
        startTracking();
      }
    } else {
      $(".activation-button").attr("src", "images/microphone-disable.png");
      var x = document.getElementById("snackbar");

      // Add the "show" class to DIV
      x.className = "show";

      // After 3 seconds, remove the show class from DIV
      setTimeout(function () {
        x.className = x.className.replace("show", "");
      }, 3000);
    }
  });
});

var recognition,
  isStopButtonClicked = false;

const startRecog = () => {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let last = event.results.length - 1;
    let lastTranscript = event.results[last][0].transcript;
    let interim_transcript = "";
    let final_transcript = "";

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      // Verify if the recognized text is the last with the isFinal property
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    if (final_transcript != "" && final_transcript !== "undefined") {
      sendResult(final_transcript.toLowerCase());
    }
  };

  recognition.onerror = (event) => {
    if (event.error === "not-allowed") {
      const errorMessage =
        "AudioCapture permission has been blocked because of a Feature Policy applied to the current document. See https://goo.gl/EuHzyv for more details.";
      chrome.runtime.sendMessage({ error: errorMessage });
      isStopButtonClicked = true;
      recognition.stop();
    }
  };

  recognition.onspeechstart = (event) => console.log("speech started");
  recognition.onspeechend = (event) => stopTracking();
  recognition.onend = function (event) {
    if (isStopButtonClicked) {
      stopTracking();
    } else {
      startTracking();
    }
  };
};

const startTracking = () => recognition.start();

const stopTracking = () => {
  recognition.stop();
};

startRecog();

function sendResult(data) {
  var result;
  var port = chrome.runtime.connect({ name: "performAction" });
  if (data.includes("open")) {
    var temp = data.slice(5);
    if (temp != null && temp !== "undefined") {
      result = "https://duckduckgo.com/?q=!" + temp;
      port.postMessage({ action: "open", result: result });
      port.onMessage.addListener(function (msg) {
        if (msg.response == "ok") {
        }
      });
    }
  } else if (data.includes("play")) {
    var temp = data.slice(5);
    if (temp != null && temp !== "undefined") {
      result = "https://www.youtube.com/results?search_query=" + temp;
      port.postMessage({ action: "play", result: result });
      port.onMessage.addListener(function (msg) {
        if (msg.response == "ok") {
        }
      });
    }
  } else if (data.includes("translate")) {
    var temp = data.slice(9);
    if (temp != null && temp !== "undefined") {
      result =
        "https://translate.google.com/?sl=auto&tl=en&text=" +
        temp +
        "&op=translate";
      port.postMessage({ action: "translate", result: result });
      port.onMessage.addListener(function (msg) {
        if (msg.response == "ok") {
        }
      });
    }
  } else if (data.includes("direction")) {
    var temp = data.split("to");
    if (temp != null && temp !== "undefined") {
      result =
        "https://www.google.com/maps/dir/" +
        temp[0].split("direction")[1].trim() +
        "/" +
        temp[1].trim();
      port.postMessage({ action: "direction", result: result });
      port.onMessage.addListener(function (msg) {
        if (msg.response == "ok") {
        }
      });
    }
  }
}

//Print
$("#printjob").bind("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: "printJob",
    });
  });
});
// Screenshot
$("#screenshotClick").bind("click", function () {
  chrome.runtime.sendMessage({
    todo: "screenshot",
  });
});

// Change Cursor
$("#changeCursor").bind("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: "cursor",
    });
  });
});

// window.scroll

var last_scroll_val = 0;
setInterval(function () {
  var st = $(window).scrollTop();
  if (last_scroll_val != st) {
    last_scroll_val = st;
    chrome.storage.sync.set({
      ["scrollValue"]: st,
    });
  }
}, 1000);
