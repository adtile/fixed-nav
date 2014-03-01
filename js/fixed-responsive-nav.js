/**
 * Responsive Nav Fixed Example
 * (c) 2013 @adtileHQ
 *
 * http://www.adtile.me
 */

(function () {

  "use strict";

  // Attach FastClick
  FastClick.attach(document.body);

  // Init Responsive Nav
  var navigation = responsiveNav(".nav-collapse", {
    closeOnNavClick: true,
    transition: 300
  });

  // Create a Mask
  var mask = document.createElement("div");
  mask.className = "mask";
  document.body.appendChild(mask);

  // Disable mask transitions on Android to boost performance
  if (navigator.userAgent.match(/Android/i) !== null) {
    document.documentElement.className += " android";
  }

  // Feature test to rule out some older browsers
  if ("querySelector" in document && "addEventListener" in window && Array.prototype.forEach) {

    // Set up navigation links
    var nav = document.querySelector(".nav-collapse ul"),
      links = nav.querySelectorAll("a");

    // Stores all the locations
    var content;

    // Set up an array of locations
    var setupLocations = function() {
      content = [];
      [].forEach.call(links, function (el, i) {
        var href = links[i].getAttribute("href").replace("#", "");
        content.push(document.getElementById(href).offsetTop + 200);
      });
    };

    // Init locations
    setupLocations();

    // Re-calculate locations on resize
    window.addEventListener("resize", function () {
      setupLocations();
    }, false);

    // Highlight active link on the nav
    var selectActiveMenuItem = function (i) {
      [].forEach.call(links, function (el, i) {
        links[i].parentNode.className = "";
      });
      links[i].parentNode.className = "active";
    };

    // Highlight active link when scrolling
    var wasNavigationTapped = false;
    window.addEventListener("scroll", function () {

      // Determine viewport and body size
      var top = window.pageYOffset,
        bodyheight = document.body.offsetHeight,
        viewport = window.innerHeight;

      // For each content link
      if (!wasNavigationTapped) {
        [].forEach.call(content, function (loc, i) {
          if ((loc > top && (loc < top + 300 || (top + viewport) >= bodyheight))) {
            selectActiveMenuItem(i);
          }
        });
      }
    }, false);

    // Close nav when tapping the mask
    mask.addEventListener("click", function () {
      navigation.close();
    }, false);

    // Clear wasNavigationTapped check after scrolling
    var clearTapCheck = function () {
      setTimeout(function () {
        wasNavigationTapped = false;
      }, 500);
    };

    // Select the right menu item when clicking the logo
    document.querySelector(".logo").addEventListener("click", function () {
      wasNavigationTapped = true;

      // Select first menu item
      selectActiveMenuItem(0);

      // Close nav
      navigation.close();

      // Remove hash from the URL
      if (history.pushState) {
        history.pushState("", document.title, window.location.pathname);
      }

      // Clear wasNavigationTapped check
      clearTapCheck();
    }, false);

    // Select the right link from the menu and begin scrolling
    [].forEach.call(links, function (el, i) {
      links[i].addEventListener("click", function (e) {
        wasNavigationTapped = true;

        // Select menu item
        selectActiveMenuItem(i);

        // Show the URL of the section on the address bar
        var thisID = this.getAttribute("href").replace("#", ""),
          pane = document.getElementById(thisID);

        // If not "#home", add hash
        if (thisID !== "home") {
          pane.removeAttribute("id");
          location.hash = "#" + thisID;
          pane.setAttribute("id", thisID);

        // If "#home", remove hash
        } else {
          if (history.pushState) {
            history.pushState("", document.title, window.location.pathname);
          }
        }

        // Clear wasNavigationTapped check
        clearTapCheck();
      }, false);
    });

  }

})();
