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