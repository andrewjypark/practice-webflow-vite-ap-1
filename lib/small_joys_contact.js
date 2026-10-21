/** SJ Contact */
import "../src/styles/style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { GSDevTools } from "gsap/GSDevTools";
import sj_menu from './sj_menu.js'
sj_menu()

import colorModeToggle from './color_mode_toggle.js'
import sj_navbar_blur from './sj_navbar_blur.js';

// Register ALL plugins
// gsap.registerPlugin(ScrollTrigger, GSDevTools); 
gsap.registerPlugin(ScrollTrigger);
// gsap.registerPlugin(GSDevTools)
// gsap.registerPlugin(Flip)

function small_joys_contact() {
  console.log('small_joys_contact.js is working')

  // Chrome can get stuck holding a blank compositor frame after a same-origin
  // back-navigation, even once the DOM underneath is fully and correctly
  // rendered. A scroll nudge alone wasn't reliable - toggling display off/on
  // forces a real layout+paint of everything, not just scroll-linked
  // compositor layers, and reproduced far more consistently as a fix. The
  // stuck state was also observed recurring, so nudge repeatedly over the
  // first couple of seconds rather than relying on a single early attempt
  // (see small_joys_home.js for the full writeup of how this was diagnosed).
  function nudgeRepaint() {
    document.body.style.display = 'none';
    void document.body.offsetHeight;
    document.body.style.display = '';
  }
  window.addEventListener('pageshow', function () {
    [0, 100, 300, 600, 1000, 2000].forEach(function (delay) {
      setTimeout(nudgeRepaint, delay);
    });
  });

  function init() {
    console.log('small_joys_contact init function is working')

    // The beforeunload handler below hides this page's body as a transition
    // effect when navigating away. On some back-navigations that leftover
    // display:none can end up applied to the page you land back on. Always
    // clear it on init so a fresh/returning page is never stuck hidden.
    $('body').show();

    // this gets the page to scroll to the top after refresh.
    $(window).on('beforeunload', function() {
      $('body').hide();
      $(window).scrollTop(0);
    });

    let sj_contact_tl = gsap.from("html", { duration: 0, autoAlpha: 0});
    sj_contact_tl.play();

    // Properly select the container and icons
    let contact_page_icon_group_trigger = document.querySelector("#contact_page_icon_group_trigger");
    let sj_banner_1_icon_group_icons_contact_page = document.querySelectorAll(".sj_banner_1_icon_group_icon.contact_page");
    console.log(sj_banner_1_icon_group_icons_contact_page);

    // Animation for icon group on contact page
    let tl_icon_group_contact_page = gsap.timeline();

    // Add staggered animation for icons moving from top to bottom
    tl_icon_group_contact_page.from(sj_banner_1_icon_group_icons_contact_page, {
      top: "0%",
      ease: "none", // Changed to power2.out for smoother acceleration/deceleration
      stagger: {
        amount: 0.3, // Increased stagger time for slower effect
        from: "start"
      }
    }).to(sj_banner_1_icon_group_icons_contact_page, {
      top: "100%",
      ease: "none", // Matching ease for consistency
      stagger: {
        amount: 0.3, // Matching stagger time
        from: "start"
      }
    });

    ScrollTrigger.create({
      trigger: contact_page_icon_group_trigger,
      // Adjusted these values to create a longer scroll range
      start: "top top", 
      end: "75% 60%", 
      // markers: true,
      animation: tl_icon_group_contact_page,
      scrub: 2.5, // Increased scrub value for smoother animation (adds lag to follow scroll)
    });


  }

  // Initialize with proper timing
  let hasInitialized = false;

  const initializeOnce = () => {
    if (hasInitialized) {
      console.log('Already initialized, skipping...');
      return;
    }
    hasInitialized = true;

    console.log('🚀 initializeOnce called');
    console.log('Document ready state:', document.readyState);

    // Small delay to ensure layout is stable
    setTimeout(() => {
      console.log('🎬 Calling init()...');
      init();
    }, 50);
  };

  // Use DOMContentLoaded for faster initialization
  console.log('Adding DOMContentLoaded listener, current state:', document.readyState);
  if (document.readyState === 'loading') {
    window.addEventListener("DOMContentLoaded", initializeOnce);
  } else {
    console.log('DOM already loaded, calling initializeOnce immediately');
    initializeOnce();
  }

  // Fallback for compatibility
  window.addEventListener("load", initializeOnce);
}

// Only run the code if we're on the correct page
console.log('Script loaded, checking for small_joys_contact class...');
console.log('Body classes:', document.body.className);
console.log('Has small_joys_contact class:', document.body.classList.contains("small_joys_contact"));
console.log('Document ready state:', document.readyState);

if (document.body.classList.contains("small_joys_contact")) {
  console.log('✅ small_joys_contact class found, initializing...');
  small_joys_contact();
} else {
  console.warn('❌ small_joys_contact class NOT found on body element');
}

export default small_joys_contact;