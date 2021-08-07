window.onload = function () {
  chrome.storage.local.get("setScreenshot", function (stored) {
    var link = document.createElement("a");
    link.href = stored.setScreenshot;
    link.download = "screenshot.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.close();
  });
};
  