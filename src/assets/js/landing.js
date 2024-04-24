const videoContainer = document.querySelector(".video-container");
const video = document.querySelector("#hero-video");
const maxZoom = 3;
gsap.registerPlugin(ScrollTrigger);

// Setuped lenis for smooth scroll
function smoothScrolling() {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

function updateVideoPositioning() {
  if (!videoContainer) return;
  videoContainer.style.minHeight = "auto";
  // Calculate the height of the video container based on the video's height
  const videoHeight = video.clientHeight * maxZoom;
  const containerHeight = videoContainer.clientHeight;
  const totalHeight = videoHeight + containerHeight + videoHeight * 0.3;
  videoContainer.style.minHeight = totalHeight + "px";

  // Registered Scroll Trigger to animate while scrolling
  gsap.to(video, {
    scrollTrigger: {
      trigger: videoContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
    scale: maxZoom,
    y: totalHeight - video.clientHeight * maxZoom + videoHeight * 0.17,
    ease: "ease-out",
  });
}

// Horizontal movement with cursor
function moveAlongCursor(e) {
  if (!videoContainer) return;
  const x = e.clientX / window.innerWidth - 0.5;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  const containerOffsetTop = videoContainer.offsetTop;
  const containerHeight = videoContainer.offsetHeight;
  const maxScroll = containerHeight - window.innerHeight;
  const progress = Math.min((scrollY - containerOffsetTop) / maxScroll, 1);

  // Disable horizontal movement when video reaches bottom
  const videoBottomY =
    progress * (containerHeight - video.offsetHeight) + video.offsetHeight;
  const containerBottomY = containerOffsetTop + containerHeight;
  const reachedBottom = videoBottomY >= containerBottomY;

  // Gradually decrease horizontal movement as video approaches bottom
  const horizontalMovementFactor = reachedBottom ? 0 : 1 - progress;

  gsap.to(video, {
    duration: 1,
    x: ((x * window.innerWidth) / 2) * horizontalMovementFactor,
  });
}

function animateItems() {
  if (!videoContainer) return;
  let symbol = document.getElementById("symbol");
  let otherElements = document.querySelectorAll(".trust");
  let otherElements2 = document.querySelectorAll(".trust-2");
  symbol.style.transform = "translateY(150%)";
  symbol.style.opacity = "0";
  setTimeout(function () {
    // initially triggered the animation for the arrow
    symbol.style.transition = "transform 1s, opacity 1s";
    symbol.style.transform = "none";
    symbol.style.opacity = "1";

    // animate the remaining contents after the animation of the arrow is completed
    symbol.addEventListener("transitionend", function (event) {
      if (event.propertyName === "transform") {
        // animate each elements one by one for staggered effect
        otherElements.forEach(function (element) {
          element.style.transition = "opacity 2s ease";
          element.style.opacity = "1";
        });
        // animate each elements one by one for staggered effect
        otherElements2.forEach(function (element, index) {
          setTimeout(function () {
            element.style.transition = "opacity 2s ease";
            element.style.opacity = "1";
            // video element is made visible after the last element animation is completed
            index == otherElements2.length - 1
              ? video.classList.remove("invisible")
              : null;
          }, index * 300);
        });
      }
    });
  }, 500);
}

function animateElements(elementsSelector, triggerClass, contentSection) {
  const contents = document.querySelectorAll(contentSection);
  if (window.innerWidth < 640) {
    contents.forEach((content) => {
      gsap.to(content, {
        opacity: 1,
      });
    });
    return;
  }
  let isFirstElement = true;
  let activeElement = null;
  gsap.to(triggerClass, {
    scrollTrigger: {
      trigger: triggerClass,
      pin: true,
      pinSpacing: true,
      start: "center center",
      end: "+=450",
      scrub: true,
    },
  });
  gsap.utils.toArray(elementsSelector).forEach((element) => {
    let textImage = element.querySelector(".normal");
    let hTextImage = element.querySelector(".highlighted");
    const dataItem = element.getAttribute("data-item");
    const contents = document.querySelectorAll(contentSection);

    // Set opacity based on whether it's the first element or not
    gsap.set(hTextImage, { opacity: isFirstElement ? 1 : 0 });
    gsap.set(textImage, { opacity: isFirstElement ? 0 : 1 });

    // Update isFirstElement after processing the first element
    if (isFirstElement) {
      isFirstElement = false;
    }

    function contentAnimate() {
      contents.forEach((content) => {
        gsap.to(content, {
          opacity: content.getAttribute("data-item") === dataItem ? 1 : 0,
          zIndex: 1,
        });
      });
    }

    // Add mouseover event listener to each element
    element.addEventListener("mouseover", () => {
      contentAnimate();
      if (activeElement !== element) {
        gsap.to(textImage, { opacity: 0 });
        gsap.to(hTextImage, { opacity: 1 });

        // Hide the highlighted version of other elements
        gsap.utils.toArray(elementsSelector).forEach((otherElement) => {
          if (otherElement !== element) {
            let otherTextImage = otherElement.querySelector(".normal");
            let otherHTextImage = otherElement.querySelector(".highlighted");
            gsap.to(otherTextImage, { opacity: 1 });
            gsap.to(otherHTextImage, { opacity: 0 });
          }
        });

        activeElement = element;
      }
    });

    gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        start: "-=200",
        end: "-=200",
        scrub: true,
        onEnter: () => {
          contentAnimate();
          if (activeElement !== element) {
            gsap.to(textImage, { opacity: 0 });
            gsap.to(hTextImage, { opacity: 1 });

            if (activeElement) {
              let prevTextImage = activeElement.querySelector(".normal");
              let prevHTextImage = activeElement.querySelector(".highlighted");
              gsap.to(prevTextImage, { opacity: 1 });
              gsap.to(prevHTextImage, { opacity: 0 });
            }

            activeElement = element;
          }
        },
        onLeaveBack: () => {
          contentAnimate();
          if (activeElement !== element) {
            gsap.to(textImage, { opacity: 0 });
            gsap.to(hTextImage, { opacity: 1 });

            if (activeElement) {
              let prevTextImage = activeElement.querySelector(".normal");
              let prevHTextImage = activeElement.querySelector(".highlighted");
              gsap.to(prevTextImage, { opacity: 1 });
              gsap.to(prevHTextImage, { opacity: 0 });
            }

            activeElement = element;
          }
        },
      },
    });
  });
}
function animateCards() {
  let timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".scroll-cards",
      pin: true,
      pinSpacing: true,
      start: "50% 50%",
      end: "+=700",
      scrub: 1,
    },
  });

  // Function to hide marker div of the given card
  function hideData(cardClass) {
    document
      .querySelector("." + cardClass + " .marker")
      .classList.add("hidden");
    document
      .querySelector("." + cardClass + " .item")
      .classList.remove("hidden");
  }

  // Function to show marker div of the given card
  function showData(cardClass) {
    document
      .querySelector("." + cardClass + " .marker")
      .classList.toggle("hidden");
    document.querySelector("." + cardClass + " .item").classList.add("hidden");
  }
  const screenWidth = window.innerWidth;
  let animationProps = {};
  if (screenWidth < 640) {
    animationProps = {
      direction: "yPercent",
    };
  } else {
    animationProps = {
      direction: "xPercent",
    };
  }

  timeline.from(
    ".card-1",
    {
      [animationProps.direction]: 0,
    },
    "-=0.3"
  );
  timeline.to(
    ".card-1",
    {
      [animationProps.direction]: 0,

      // [animationProps.direction]: -70,
      // onStart: function () {
      //   hideData("card-1");
      // },
      // onReverseComplete: function () {
      //   showData("card-1");
      // },
    },
    "+=0.3"
  );
  timeline.from(
    ".card-2",
    {
      [animationProps.direction]: 0,
    },
    "-=0.3"
  );
  timeline.to(
    ".card-2",
    {
      [animationProps.direction]: -80,
      onStart: function () {
        hideData("card-2");
      },
      onReverseComplete: function () {
        showData("card-2");
      },
    },
    "+=0.3"
  );

  timeline.from(
    ".card-3",
    {
      [animationProps.direction]: 0,
    },
    "-=0.3"
  );
  timeline.to(
    ".card-3",
    {
      [animationProps.direction]: -90,
      onStart: function () {
        hideData("card-3");
      },
      onReverseComplete: function () {
        showData("card-3");
      },
    },
    "+=0.3"
  );
}
function navbarSection() {
  const tabs = document.getElementsByClassName("tabs");
  const headerBg = document.getElementById("header-bg");
  const headerArea = document.querySelector(".header-area");
  const logo2 = document.querySelector(".logo2");
  const logo1 = document.querySelector(".logo1");
  const secondATag = document.querySelector(".head-btn a:nth-child(2)");
  let currentActiveTab;

  [...tabs].forEach((tab, index) => {
    tab.addEventListener("click", (e) => {
      const clickedTab = e.currentTarget;
      const isVisible = headerBg.style.transform === "translate(0px, 0px)";
      if (isVisible && currentActiveTab === clickedTab) {
        gsap.to(headerBg, {
          duration: 0.4,
          y: "-100%",
          onEnter: hideHeadselectedDiv,
        });
        currentActiveTab = null;
      } else {
        gsap.to(headerBg, {
          duration: 0.5,
          y: 0,
          onEnter: showHeadselectedDiv,
        });
        currentActiveTab = clickedTab;
      }
      // Function to hide headselected-div
      function hideHeadselectedDiv() {
        document.querySelectorAll(".headselected-div").forEach((div, idx) => {
          div.classList.toggle("hidden", true);
        });
      }

      // Function to show headselected-div
      function showHeadselectedDiv() {
        document.querySelectorAll(".headselected-div").forEach((div, idx) => {
          div.classList.toggle("hidden", idx !== index);
        });
      }
      // Toggle "active" class on tabs
      [...tabs].forEach((tabItem) => {
        tabItem.classList.toggle("active", tabItem === clickedTab);
      });
      // Toggle "active" class on headerArea
      headerArea.classList.toggle("active", currentActiveTab !== null);
      if (
        !(logo1.getAttribute("data-attr") || logo1.getAttribute("data-attr"))
      ) {
        logo1.classList.toggle("hidden", currentActiveTab !== null);
        logo2.classList.toggle("hidden", currentActiveTab == null);
      }

      // Toggle "active" class on secondATag
      secondATag.classList.toggle("active", currentActiveTab !== null);
    });
  });
}
function initAnimations() {
  // Get references to DOM elements
  const closeIcon = document.querySelector(".close-icon");
  const secondaryForm = document.querySelector(".secondary-form");
  const primaryForm = document.querySelector(".primary-form");
  const formSec2 = document.querySelector(".secondary-form .form-sec2");
  const with_img = document.getElementById("with_img");
  const trust_img = document.getElementById("trust_img");
  const diff_img = document.getElementById("diff_img");
  const detail = document.getElementById("detail");
  const noScroll = document.querySelector(".no-scroll");
  // Event listener for close icon click
  closeIcon.addEventListener("click", function () {
    noScroll.classList.remove("hidden")
    secondaryForm.classList.remove("hidden");
    primaryForm.classList.add("hidden");
    animateFormSections();
  });

  // Function to animate form sections with GSAP
  function animateFormSections() {
    gsap.fromTo(
      with_img,
      { y: "-500%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.5 }
    );
    gsap.fromTo(
      diff_img,
      { y: "500%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.5 }
    );
    gsap.fromTo(
      trust_img,
      { x: "-100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 0.5 }
    );
    gsap.fromTo(
      formSec2,
      { x: "100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 0.5, delay: 1 }
    );
    gsap.fromTo(
      detail,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.5, delay: 1 }
    );
  }
}

/** Function call written */

smoothScrolling();
navbarSection();
updateVideoPositioning();
animateItems();
window.addEventListener("resize", updateVideoPositioning);
window.addEventListener("mousemove", (e) => moveAlongCursor(e));
animateElements(
  ".ins-item",
  ".instruments",
  ".content-section .flex-col-center"
);
animateElements(".accs", ".acc-opening", ".acc-opening .video-section");
animateCards();
