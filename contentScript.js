// [Keep magnifier vars and function before adding chrome message listener]
/*Size is  set in pixels... supports being written as: '250px' */
var magnifierSize = 50;

/*How many times magnification of image on page.*/
var magnification = 3;

function magnifier() {
  this.magnifyImg = function (ptr, magnification, magnifierSize) {
    $("body").prepend('<div class="magnify"></div>');

    var $pointer;
    if (typeof ptr == "string") {
      $pointer = $(ptr);
    } else if (typeof ptr == "object") {
      $pointer = ptr;
    }

    if (!$pointer.is("img")) {
      return false;
    }

    magnification = +magnification;

    $pointer.hover(
      function () {
        $(this).css("cursor", "none");
        $(".magnify").show();
        //Setting some variables for later use
        var width = $(this).width();
        var height = $(this).height();
        var src = $(this).attr("src");
        var imagePos = $(this).offset();
        var image = $(this);

        if (magnifierSize == undefined) {
          magnifierSize = "150px";
        }

        $(".magnify").css({
          "background-size":
            width * magnification + "px " + height * magnification + "px",
          "background-image": 'url("' + src + '")',
          width: magnifierSize,
          height: magnifierSize,
        });

        //Setting a few more...
        var magnifyOffset = +($(".magnify").width() / 2);
        var rightSide = +(imagePos.left + $(this).width());
        var bottomSide = +(imagePos.top + $(this).height());

        $(document).mousemove(function (e) {
          if (
            e.pageX < +(imagePos.left - magnifyOffset / 6) ||
            e.pageX > +(rightSide + magnifyOffset / 6) ||
            e.pageY < +(imagePos.top - magnifyOffset / 6) ||
            e.pageY > +(bottomSide + magnifyOffset / 6)
          ) {
            $(".magnify").hide();
            $(document).unbind("mousemove");
          }
          var backgroundPos =
            "" -
            ((e.pageX - imagePos.left) * magnification - magnifyOffset) +
            "px " +
            -((e.pageY - imagePos.top) * magnification - magnifyOffset) +
            "px";
          $(".magnify").css({
            left: e.pageX - magnifyOffset,
            top: e.pageY - magnifyOffset,
            "background-position": backgroundPos,
          });
        });
      },
      function () {}
    );
  };

  this.removeMagnifier = function (ptr) {
    var $pointer;
    if (typeof ptr == "string") {
      $pointer = $(ptr);
    } else if (typeof ptr == "object") {
      $pointer = ptr;
    }

    if (!$pointer.is("img")) {
      return false;
    }

    $pointer.hover(function () {
      $(this).css("cursor", "default");
    });
    $(".magnify").remove();
  };

  this.init = function () {};

  return this.init();
}

var magnify = new magnifier();

var images = [];
var imageSource = [];

// Communication with popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Changing color of font
  if (message.todo == "fontColor") {
    if (message.checkedButton == 0) {
      $("#i4all-font-color").remove();
    } else {
      if ($("#i4all-font-color") != null) {
        $("#i4all-font-color").remove();
      }
      $(
        "<style id='i4all-font-color'>:not(a), :not(img)  { color: " +
          message.fontColor +
          "! important; }</style>"
      ).appendTo("head");
    }
  }

  // Changing Font Family
  if (message.todo == "fontFamily") {
    if (message.checkedButton == 0) {
      $("#i4all-font-family").remove();
    } else {
      if ($("#i4all-font-family") != null) {
        $("#i4all-font-family").remove();
      }
      $(
        "<link rel='stylesheet' type='text/css' id='i4all-font-family' href='chrome-extension://" +
          chrome.runtime.id +
          "/scripts/css/" +
          message.fontFamily +
          ".css'>"
      ).appendTo("head");
    }
  }

  // Changing Font Size
  if (message.todo == "fontSize") {
    if (message.checkedButton == 0) {
      $("#i4all-font-size").remove();
    } else {
      if ($("#i4all-font-size") != null) {
        $("#i4all-font-size").remove();
      }
      $(
        "<style id='i4all-font-size'> p,a,h1,h2,h4,h3,h5,h6,input,ul,span,strong,th,td,ul,li,ol,button  { font-size: " +
          message.fontSize.toString() +
          "px" +
          "!important; }</style>"
      ).appendTo("head");
    }
  }

  // Magnify Image Feature
  if (message.todo == "magnify") {
    if (message.checkedButton == 0) {
      magnify.removeMagnifier("img");
    } else {
      magnify.magnifyImg("img", message.magnification, message.magnifierSize);
    }
  }

  //Change Cursor
  if (message.todo == "cursorType") {
    if (message.checkedButton == 0) {
      $("body").css({
        cursor: "",
      });
    } else {
      $("body").css({
        cursor:
          "url(chrome-extension://" +
          chrome.runtime.id +
          "/images/" +
          message.cursorType +
          ") 4 28,auto",
      });
    }
  }

  // Image Veil
  if (message.todo == "imageVeil") {
    if (images.length === 0 && imageSource.length === 0) {
      images = document.getElementsByTagName("img");
      for (var i = 0; i < images.length; i++) {
        imageSource.push(images[i].src || images[i].srcset);
      }
    }
    if (message.checkedButton == 0) {
      for (var i = 0; i < images.length; i++) {
        images[i].src = imageSource[i];
      }
      images = [];
      imageSource = [];
    } else {
      for (var i = 0, l = images.length; i < l; i++) {
        images[i].removeAttribute("srcset");
        images[i].src =
          "https://via.placeholder.com/" +
          images[i].width +
          "x" +
          images[i].height +
          "?text=" +
          images[i].alt.replace(/ /g, "+");
      }
    }
  }

  // Highlight Words
  if (message.todo == "highlight") {
    if (message.checkedButton == 0) {
      if ($("p,h1,h2,h4,h3,h5,h6,li").hasClass("word_split")) {
        $("p,h1,h2,h4,h3,h5,h6,li").removeClass("word_split");
      }
    } else {
      $(document).ready(function () {
        $("p,h1,h2,h4,h3,h5,h6,li").addClass("word_split");
        $(".word_split").lettering("words");
      });
    }
  }

  // Speak TTS
  if (message.todo == "speakTTS") {
    var msg = new SpeechSynthesisUtterance();
    msg.text = message.selectedText;
    window.speechSynthesis.speak(msg);
  }

  // Emphasize Links
  if (message.todo == "emphasizeLinks") {
    if (message.checkedButton == 0) {
      var anchors = document.getElementsByTagName("a");
      for (var i = 0; i < anchors.length; i++) {
        anchors[i].classList.remove("emphasize");
      }
    } else {
      $(document).ready(function () {
        var anchors = document.getElementsByTagName("a");
        for (var i = 0; i < anchors.length; i++) {
          anchors[i].classList.add("emphasize");
        }
      });
    }
  }

  // Text Stroke
  if (message.todo == "textStroke") {
    if (message.checkedButton == 0) {
      $("#text-stroke").remove();
    } else {
      $(document).ready(function () {
        if ($("#text-stroke") != null) {
          $("#text-stroke").remove();
        }
        $(
          "<style id='text-stroke'> p,h1,h2,h3,h4,h5,h6,b,a,li,lo,ul  { -webkit-text-fill-color: white; -webkit-text-stroke-width: 1px; -webkit-text-stroke-color: " +
            message.textStrokeColor +
            " !important; }</style>"
        ).appendTo("head");
      });
    }
  }
  if (message.todo == "printJob") {
    window.print();
  }
});
