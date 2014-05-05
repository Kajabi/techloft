/*////////////////////////////////////////////////
//
// Background Resize Plugin
//
////////////////////////////////////////////////*/
(function($) {
  $.fn.mpResizeBackground = function() {

    var jqDoc = $(document);
    var docWidth = jqDoc.width();
    var docHeight = jqDoc.height();

    //this.removeAttr("style");
    var bgWidth = this.width();
    var bgHeight = this.height();
    this.css({
      width: 0,
      height: 0,
      left: 0,
      top: 0
    });

    var ratio = bgWidth / bgHeight;
    var rW = docWidth;
    var rH = docHeight;
    if (ratio <= 1) {
      rH = docWidth / ratio;
      if (rH < docHeight) {
        rH = docHeight;
        rW = rH * ratio;
      }
    }
    else {
      rW = docHeight * ratio;
      if (rW < docWidth) {
        rW = docWidth;
        rH = rW / ratio;
      }
    }

    var destLeft = (docWidth - rW) / 2;
    var destTop = (docHeight - rH) / 2;

    this.css({
      width: Math.ceil(rW),
      height: Math.ceil(rH),
      left: Math.ceil(destLeft),
      top: Math.ceil(destTop)
    });

    return this;
  };
})(jQuery);


//////////////////////////////////////////////////
//
//  Background Animation Plugin
//
//////////////////////////////////////////////////
(function($) {
  $.fn.mpAnimateBackground = function() {
    var imgArray, tick, next;
    imgArray = this;
    next = imgArray.length - 2;
    tick = imgArray.length - 1;
    function animateSlideOut() {
      imgArray.css("z-index", -1);
      TweenLite.to(imgArray[next], 0, { css:{ scale: 1.0, opacity: 1 }, ease:Expo.easeInOut });
      $(imgArray[tick]).css("z-index", 0);
      TweenLite.to(imgArray[tick], 1, { css:{ scale: 1.2, opacity: 0 }, ease:Expo.easeInOut });
      next --;
      tick --;
      if (next < 0) next = imgArray.length - 1;
      if (tick < 0) tick = imgArray.length - 1;
    }
    setInterval(animateSlideOut, 5000);
  };
})(jQuery);


//////////////////////////////////////////////////
//
//  Navigation Bar Plugin
//
//////////////////////////////////////////////////
(function($) {
  var jqWindow,
      jqNavToggle,
      jqNavList,
      animationTime,
      currentWidth,
      currentHeight,
      currentDevice;

  function init() {
    console.log("resizeInit");
    jqWindow = $(window);
    jqNavToggle = $("#hamburger-icon");
    jqNavList = $("#navigation-items");

    jqWindow.resize(windowResizeHandler);
    jqNavToggle.on("click", navClickHandler);

    animationTime = 0.5;

    jqNavList.isOpen = false;
    jqNavList.isAnimating = false;

    windowResize();
  }

  function navClickHandler() { animateNav(); }
  function windowResizeHandler() { windowResize(); }
  function windowResize() {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    if (currentHeight === undefined || currentHeight !== windowHeight || currentWidth === undefined || currentWidth !== windowWidth) {
      currentDevice = getCurrentDevice();
      checkNavigationVisibility();
      currentHeight = windowHeight;
      currentWidth = windowWidth;
    }
  }

  function animateNav() {
    if (currentDevice === "mobile") {
      if (jqNavList.isAnimating) return false;
      jqNavList.isAnimating = true;
      jqNavList.openedHeight = jqNavList.height();
      if (jqNavList.isOpen) {
        jqNavList.isOpen = false;
        TweenLite.to(jqNavList, animationTime, { css:{ height: 0, clearProps: "height" }, ease:Strong.easeOut, onComplete: function() { jqNavList.addClass("hidden"); }});
      }
      else {
        jqNavList.isOpen = true;
        jqNavList.removeClass("hidden");
        TweenLite.to(jqNavList, 0, { css:{ height: 0 }});
        TweenLite.to(jqNavList, animationTime, { css:{ height: jqNavList.openedHeight }, ease:Strong.easeOut });
      }
      TweenLite.delayedCall(animationTime, function(){ jqNavList.isAnimating = false; });
    }
  }

  function checkNavigationVisibility() {
    if (currentDevice === "mobile") {
      jqNavList.isOpen = false;
      jqNavList.addClass("hidden");
    }
    else {
      TweenLite.to(jqNavList, 0, { css:{ clearProps: "height" }});
      jqNavList.isOpen = true;
      jqNavList.removeClass("hidden");
    }
  }

  function getCurrentDevice() {
    var w, mq, deviceSize;
    mq = { "mobile" : 768, "tablet" : 980 };
    w = jqWindow.width();
    if (w < mq.mobile) deviceSize = "mobile";
    else if (w >= mq.mobile && w < mq.tablet) deviceSize = "tablet";
    else deviceSize = "desktop";
    return deviceSize;
  }

  $(function() { init(); });

})(jQuery);


//////////////////////////////////////////////////
//
//  Center Element Plugin
//
//////////////////////////////////////////////////
(function($) {
  $.fn.mpCenterVertically = function(options) {
    var settings = $.extend({
      time: 0.35,
      ease: Back.easeOut
    }, options);
    var halfWindow = $(window).height() / 2;
    var navigationHeight = $("#navigation").innerHeight();
    return this.each(function() {
      var halfElement = $(this).innerHeight() / 2;
      var topValue = "";
      if (halfElement <= halfWindow - navigationHeight) topValue = halfWindow - halfElement - navigationHeight;
      TweenLite.to(this, settings.time, { marginTop: topValue, ease: settings.ease });
    });
  };
})(jQuery);


//////////////////////////////////////////////////
//
//  Main
//
//////////////////////////////////////////////////
(function($) {

  var jqWindow, jqContent;
  var carouselImages;

  function windowResizeHandler(event) {
    event.preventDefault();
    carouselImages.mpResizeBackground();
    jqContent.mpCenterVertically();
  }

  function init() {
    carouselImages = $(".carousel-img");
    jqContent = $("#content");
    jqWindow = $(window);
    jqWindow.resize(windowResizeHandler).trigger("resize");
    carouselImages.mpAnimateBackground();
    carouselImages.on("load", windowResizeHandler);
  }

  $(function() { init(); });

})(jQuery);