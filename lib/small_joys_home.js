/** SJ Home 062325
 * Trying to clean up with SplitText implementation
 * test
 */
import "../src/styles/style.css";
import { gsap } from 'gsap';
import imagesLoaded from 'imagesloaded';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import sj_menu from './sj_menu.js';
sj_menu();

import sj_navbar_blur from './sj_navbar_blur.js';


// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';

// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


// Register ALL plugins
gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

// ScrollTrigger.normalizeScroll(true);
// ScrollTrigger.config({
//   ignoreMobileResize: true,
// });

function small_joys_home() {
  console.log("small_joys_home.js is working");
  
  // Store ScrollTrigger instances
  let scrollTriggers = {
    logoToNav: null,
    bannerImageParallax: null,
    bladeImageParallax: null
  };

  // Store original states globally for SplitText
  let splitInstances = [];
  let originalContent = {};
  let isReinitializing = false;
  let ctx;

  // Function to wrap lines in container divs with overflow:hidden
  function wrapLines(lines) {
    lines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.className = 'split-line-container';
      wrapper.style.overflow = 'hidden';
      
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
  }

  // Advanced cleanup function for SplitText
  function cleanupSplitText() {
    console.log("Cleaning up SplitText instances");
    
    splitInstances.forEach(instance => {
      if (instance && typeof instance.revert === 'function') {
        try {
          instance.revert();
        } catch (e) {
          console.warn("Error reverting SplitText:", e);
        }
      }
    });
    
    splitInstances = [];
    
    const wrappers = document.querySelectorAll('.split-line-container');
    wrappers.forEach(wrapper => {
      try {
        while (wrapper.firstChild) {
          wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
        }
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
      } catch (e) {
        console.warn("Error removing wrapper:", e);
      }
    });
    
    const lines = document.querySelectorAll('.split-line');
    lines.forEach(line => {
      try {
        while (line.firstChild) {
          line.parentNode.insertBefore(line.firstChild, line);
        }
        if (line.parentNode) {
          line.parentNode.removeChild(line);
        }
      } catch (e) {
        console.warn("Error removing line:", e);
      }
    });
  }

  function init() {
    console.log("small_joys_home init function is working");

    // A beforeunload handler further down hides this page's body as a
    // transition effect when navigating away. On some back-navigations that
    // leftover display:none can end up applied to the page you land back on
    // (the old page gets fully unloaded/reloaded rather than restored from
    // bfcache, since a beforeunload handler makes it bfcache-ineligible).
    // Always clear it on init so a fresh/returning page is never stuck hidden.
    document.body.style.display = "";

    // Clear previous states
    splitInstances = [];
    originalContent = {};

    // Track every tween/timeline/ScrollTrigger created this pass so killAll()
    // can fully revert them before the next pass runs. Without this, timelines
    // from a previous init() keep ticking in the background and can race
    // newer ones on shared properties (e.g. nav opacity getting reset to 0
    // by a stale, never-killed timeline finishing after a resize-triggered reinit).
    ctx = gsap.context(() => {
      initDevTools();
      initSplitTextStyles();
      initCustomEffects();
      initGridAnimation();
      initLogoToNavAnimation();
      ImageParallax();
      sj_header_anim();
      swiper_anim();
    });
  }
  
  function initDevTools() {
    const devTools = document.querySelector(".gs-dev-tools");
    if (devTools) devTools.style.zIndex = "100";
  }

  function initSplitTextStyles() {
    // Add CSS for properly hiding split lines
    const styleId = 'split-line-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .split-line-container {
          overflow: hidden !important;
          display: block !important;
          position: relative !important;
        }
        .split-line {
          position: relative !important;
          display: block !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }

  function initCustomEffects() {
    // Register slideUp effect
    gsap.registerEffect({
      name: "slideUp", 
      extendTimeline: true,
      defaults: {
        y: "110%",
        x: 0,
        ease: "none",
        duration: 0.5,
      },
      effect: (targets, config) => {
        let tl = gsap.timeline();
        tl.from(targets, {
          duration: config.duration,
          x: config.x,
          y: config.y,
          opacity: 0,
          stagger: config.stagger
        });
        return tl;
      }
    });

    // Register slideDown effect
    gsap.registerEffect({
      name: "slideDown", 
      extendTimeline: true,
      defaults: {
        y: "110%",
        x: 0,
        ease: "none",
        duration: 0.5
      },
      effect: (targets, config) => {
        let tl = gsap.timeline();
        tl.to(targets, {
          duration: config.duration,
          x: config.x,
          y: config.y,
          opacity: 0,
          stagger: {
            each: 0.03,
            ease: "power1.out"
          }
        });
        return tl;
      }
    });
  }
  
  function initGridAnimation() {
    // Get elements for SplitText animation
    let sj_banner_1_image = document.querySelector(".sj_banner_1_image");
    let sj_banner_1_image_wrapper = document.querySelector(".sj_banner_1_image_wrapper");
    let sj_banner_1_header_text = document.querySelectorAll(".sj_banner_1_header_text");
    let sj_banner_1_subheader_text = document.querySelectorAll(".sj_banner_1_subheader_text");
    let sjs_layout_top_bar_dropdown_container = document.querySelector(".sjs_layout_top_bar_dropdown_container");
    let sj_1_button_1_wrapper = document.querySelector(".sj_1_button_1_wrapper");
    let sj_menu_menu_container = document.querySelector(".sj_menu_menu_container");
    let sj_banner_1_subheader_text_2 = document.querySelector(".sj_banner_1_subheader_text_2");
    let sj_button_banner_with_icon = document.querySelector(".sj_button_banner_with_icon");
    let sj_image_container_grain = document.querySelectorAll(".sj_image_container_grain.sj_grain");


    // Check if elements exist
    if (!sj_banner_1_header_text.length || !sj_banner_1_subheader_text.length) {
      console.log("Text elements not found for SplitText");
      // Fallback to original animation without SplitText
      let tl_ap_grid = gsap.from("html", { duration: 0, autoAlpha: 0});
      tl_ap_grid.play();
      
      window.addEventListener('beforeunload', () => {
        document.body.style.display = "none";
        window.scrollTo(0, 0);
      });
      return;
    }

    // Store original content
    originalContent['headerText'] = sj_banner_1_header_text[0].innerHTML;
    originalContent['subheaderText'] = sj_banner_1_subheader_text[0].innerHTML;

    // Create SplitText instances
    let split_sj_banner_1_header_text = new SplitText(sj_banner_1_header_text, {
      type: "chars,words,lines",
      linesClass: "split-line",
    });

    let split_sj_banner_1_subheader_text = new SplitText(sj_banner_1_subheader_text, {
      type: "chars,words,lines",
      linesClass: "split-line",
    });

    let split_sj_banner_1_subheader_text_2 = new SplitText(sj_banner_1_subheader_text_2, {
      type: "chars,words,lines",
      linesClass: "split-line",
    });

    // Store SplitText instances
    splitInstances.push(
      split_sj_banner_1_header_text,
      split_sj_banner_1_subheader_text,
      split_sj_banner_1_subheader_text_2
    );

    // Apply wrappers to all text elements lines
    wrapLines(split_sj_banner_1_header_text.lines);
    wrapLines(split_sj_banner_1_subheader_text.lines);
    wrapLines(split_sj_banner_1_subheader_text_2.lines);

    // Main timeline with SplitText animations
    let tl_ap_grid = gsap.timeline();

    // Set initial opacity for grain effect using CSS custom property
    // gsap
    // .set(sj_image_container_grain, {
    //   "--grain-opacity": 0
    // })
    // .set(sj_banner_1_image_wrapper,{
    //   opacity:'0%'
    // })


    tl_ap_grid
      .from("html", { duration: 0, autoAlpha: 0}, "banner_tl_start")
      .from(sj_image_container_grain, {
      "--grain-opacity": 0
      }, "banner_tl_start+=0")
      .from(sj_banner_1_image, {
        opacity:0,
        scale: 2,
        ease: "sine.out",
        duration: 1.2
      }, "banner_tl_start+=0.2")
      .to(sj_banner_1_image_wrapper, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "sine.out",
        duration: 1.2
      }, "<")
      .to(sj_banner_1_image_wrapper, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "sine.out",
        duration: 1.2
      }, "<")
      .to(sj_banner_1_image_wrapper, {
        scale: 0.95,
        duration: 2.1,
        ease: "sine.out"
      }, "banner_tl_start+=1.2")
      .to(sj_image_container_grain, {
        "--grain-opacity": 1,
        duration: 2.1,
        ease: "sine.out"
      }, "banner_tl_start+=1.2")
      .slideUp(split_sj_banner_1_header_text.chars, { 
        stagger: {
          each: 0.1,
          ease: "none"
        }
      }, "banner_tl_start+=0.2")
      .slideUp(split_sj_banner_1_subheader_text.chars, { 
        stagger: {
          each: 0.015,
          ease: "none"
        }
      }, "banner_tl_start+=0.6")
      .slideUp(split_sj_banner_1_subheader_text_2.lines, { 
        stagger: {
          each: 0.25,
          ease: "none"
        }
      }, "banner_tl_start+=1.15")
      .from(sj_button_banner_with_icon, {
        opacity: 0,
        duration: 0.8
      }, "banner_tl_start+=1.8")
      .from(sjs_layout_top_bar_dropdown_container, {
        opacity: 0,
        duration: 1
      }, "banner_tl_start+=1.2")
      .from(sj_menu_menu_container, {
        opacity: 0, 
        duration: 1
      }, "<")
      .from(sj_1_button_1_wrapper, {
        opacity: 0,
        duration: 1
      }, "<");

    tl_ap_grid.play();
    
    // Page scroll resets on refresh
    window.addEventListener('beforeunload', () => {
      document.body.style.display = "none";
      window.scrollTo(0, 0);
    });
  }
  
  function initLogoToNavAnimation() {
    // Get elements
    let ap_grid_container = document.querySelector(".ap_grid_container.sj_process_section_1");
    let headerText = document.querySelectorAll(".sj_banner_1_header_text");
    let headerTextWrapper = document.querySelector(".sj_banner_1_header_text_wrapper");
    let sj_home_banner = document.querySelector("#sj_home_banner");

    if (!ap_grid_container || !headerText.length || !headerTextWrapper) {
      console.log("Missing elements for logo animation:", {
        container: !!ap_grid_container,
        headerText: headerText.length,
        wrapper: !!headerTextWrapper
      });
      return;
    }
    
    // Create tweens for the header texts
    let tweenSmallerText = gsap.to(headerText, {
      fontSize: "16px",
      lineHeight: "20px",
      ease: "none",
    });

    let tweenGap = gsap.to(headerTextWrapper, {
      rowGap: "2px",
      ease: "none",
    });
    
    // Create timeline for logo to nav
    let tl_logoToNav = gsap.timeline();
    tl_logoToNav
      .add(tweenSmallerText)
      .add(tweenGap, "<");

    scrollTriggers.logoToNav = ScrollTrigger.create({
      id: "logoToNavAnimation",
      trigger: sj_home_banner,
      start: "top 0%",
      end: "bottom 5%",
      animation: tl_logoToNav,
      scrub: 0.5,
      invalidateOnRefresh: true,
    });
    
    console.log("Logo to Nav animation initialized");
  }

  function ImageParallax() {
    // Get elements
    let sj_home_banner = document.querySelector("#sj_home_banner");
    let sj_banner_1_image = document.querySelector(".sj_banner_1_image");
    let sj_banner_1_image_container = document.querySelector(".sj_banner_1_image_container");
    let sj_banner_1_image_wrapper = document.querySelector(".sj_banner_1_image_wrapper");

    gsap.set(sj_banner_1_image, {
      y: "-5%"
    });

    // Create timeline for banner image parallax
    let tl_bannerImageParallax = gsap.timeline()
      // .fromTo(sj_banner_1_image, 
      .fromTo(sj_banner_1_image_container, 
        { y: "-5%" }, 
        { y: "20%" }
      );

    scrollTriggers.bannerImageParallax = ScrollTrigger.create({
      id: "bannerImageParallax",
      trigger: sj_banner_1_image_wrapper,
      start: "top 120px",
      end: "bottom 120px",
      animation: tl_bannerImageParallax,
      scrub: 0.5,
      invalidateOnRefresh: true,
    });
    
    let sj_home_blade = document.querySelectorAll(".ap_grid_1.train_1");
    let sjs_train_1_blade_image_wrapper = document.querySelectorAll(".sjs_train_1_blade_image_wrapper");

    sjs_train_1_blade_image_wrapper.forEach((element) => {
      console.log(element);

      let sjs_train_1_blade_image = element.querySelectorAll(".sjs_train_1_blade_image");

      let tl_bladeImageParallax = gsap.timeline()
        .fromTo(sjs_train_1_blade_image, 
          { y: "-10%" }, 
          { y: "10%" }
        );

      scrollTriggers.bladeImageParallax = ScrollTrigger.create({
        id: "bladeImageParallax",
        trigger: element,
        start: "top 100%",
        end: "bottom 0%",
        animation: tl_bladeImageParallax,
        scrub: 0.5,
        invalidateOnRefresh: true,
      });
    });
  }

  function sj_header_anim() {
    /* sj home headers interaction */
    let triggers_sj_heading_3d_wrapper = gsap.utils.toArray(".sj_heading_3d_wrapper");
    /* 
    we're going to loop through the triggers and we're going 
    to find the target .heading-3d inside the trigger inside 
    the current iteration of the loop.
    */

    triggers_sj_heading_3d_wrapper.forEach((trigger, index) => {
      let target = trigger.querySelector(".sj_heading_3d");
      gsap.set(target, {
        transformPerspective: 800,
        // rotationX:-90 is going to show the top of the header.
        rotationX: -90
      });

      ScrollTrigger.create({
        trigger: trigger,
        start: "top 90%", 
        end: "top 15%",
        // markers: true,
        onEnter: () => gsap.to(target, {rotationX: 0}),
        onLeave: () => gsap.to(target, {rotationX: 90}),
        onEnterBack: () => gsap.to(target, {rotationX: 0}),
        onLeaveBack: () => gsap.to(target, {rotationX: -90}) 
      });
    });
  }

  function swiper_anim(){
    const swiper_1 = new Swiper(".swiper-marquee", {
        modules: [Autoplay], 
        // swiper will use the width we define in Webflow if we do auto. 
        slidesPerView: 'auto',
        spaceBetween: 60, 
        // loop to true makes it infinite marquee.
        loop: true, 
        speed: 4000,
        // can't interact w things in slider
        allowTouchMove: false,
        // prevent jumping during loop transitions
        // loopAdditionalSlides: 2,
        // smoother transitions
        freeMode: true,
        freeModeMomentum: false,
        // for infinite marquee
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          reverseDirection: false
        },
        // responsive breakpoints
        breakpoints: {
          768: {
            spaceBetween: 90
          },
          992: {
            spaceBetween: 120
          }
        }
    })

    const swiper_2 = new Swiper(".swiper-marquee_2", {
      modules: [Autoplay], 
      // swiper will use the width we define in Webflow if we do auto. 
      slidesPerView: 'auto',
      spaceBetween: 60, 
      // loop to true makes it infinite marquee.
      loop: true, 
      speed: 4000,
      // can't interact w things in slider
      allowTouchMove: false,
      // prevent jumping during loop transitions
      // loopAdditionalSlides: 2,
      // smoother transitions
      freeMode: true,
      freeModeMomentum: false,
      // for infinite marquee
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        reverseDirection: true
      },
      // responsive breakpoints
      breakpoints: {
        768: {
          spaceBetween: 90
        },
        992: {
          spaceBetween: 120
        }
      }
    })
  }

  // Kill and reset all animations and properties
  function killAll() {
    if (isReinitializing) {
      console.log('Reinit already in progress, skipping');
      return;
    }
    isReinitializing = true;

    console.log('=== KILL ALL DEBUG ===');

    // Revert everything GSAP created during the last init() pass (timelines,
    // tweens, ScrollTriggers) so nothing from a stale pass keeps running
    // alongside the next one.
    if (ctx) {
      ctx.revert();
    }

    // Kill all ScrollTriggers first (safety net for anything created outside ctx)
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Clean up SplitText instances
    cleanupSplitText();
    
    // Clear ALL GSAP properties to ensure clean slate
    gsap.set([
      '.sj_banner_1_header_text',
      '.sj_banner_1_subheader_text',
      '.split-line',
      '.split-line-container',
      'html'
    ], {
      clearProps: "all"
    });
    
    // Force a reflow to ensure DOM is properly updated
    document.body.offsetHeight;
    
    // Refresh ScrollTrigger to recalculate positions
    ScrollTrigger.refresh();
    
    console.log('=== END KILL ALL DEBUG ===\n');
    
    // Longer delay to ensure everything is properly reset
    gsap.delayedCall(0.5, () => {
      init();
      isReinitializing = false;
    });
  }

  // Debounce function for resize events
  function debounce(func) {
    var timer;
    return function(event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, 300, event);
    };
  }

  // Add resize listener with debounce (disabled on mobile to prevent constant retriggering)
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  }

  if (!isMobile()) {
    window.addEventListener("resize", debounce(function(e) {
      console.log("Resize detected - reinitializing");
      killAll();
    }));
  }

  // Listen for animation reset events
  window.addEventListener('sj_animation_reset', function() {
    console.log("Animation reset event received - reinitializing");
    killAll();
  });

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

    // Use imagesLoaded with callback instead of promise to avoid async listener error
    imagesLoaded(document.body, { background: true }, function() {
      console.log('✅ All images loaded');
      // Small delay to ensure layout is stable
      setTimeout(() => {
        console.log('🎬 Calling init()...');
        init();
      }, 50);
    });
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

// Only initialize if we're on the correct page
console.log('Script loaded, checking for small_joys_home class...');
console.log('Body classes:', document.body.className);
console.log('Has small_joys_home class:', document.body.classList.contains("small_joys_home"));
console.log('Document ready state:', document.readyState);

if (document.body.classList.contains("small_joys_home")) {
  console.log('✅ small_joys_home class found, initializing...');
  small_joys_home();
} else {
  console.warn('❌ small_joys_home class NOT found on body element');
}

export default small_joys_home;