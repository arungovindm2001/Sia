chrome.storage.sync.get("assistant_enable", function (stored) {
  if (stored.assistant_enable) {
    $("#assistant_enable").prop("checked", true);
  } else {
    $("#assistant_enable").prop("checked", false);
  }
});

var checkbox = document.querySelector("input[name=checkbox]");
checkbox.addEventListener("change", function () {
  if (this.checked) {
    chrome.storage.sync.set({
      ["assistant_enable"]: 1,
    });
  } else {
    chrome.storage.sync.set({
      ["assistant_enable"]: 0,
    });
  }
});

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(function (stream) {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  })
  .catch(function (error) {
    alert("Error : Microphone Access Required");
  });
