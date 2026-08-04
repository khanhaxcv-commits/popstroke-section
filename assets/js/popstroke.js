const POPSTROKE_CONTENT = [
  {
    tab: "team building.",
    video:
      "https://partee.vn/wp-content/themes/flatsome-child/Clip/Team%20Building%20ParTee.mp4",
    alt: "A ParTee team-building event filled with games, connection, and shared moments.",
    content: [
      "Bring your team closer with a ParTee experience designed for connection, laughter, and a little friendly competition. It's a refreshing way to celebrate wins, build stronger bonds, and create memories together beyond the office.",
    ],
  },
  {
    tab: "eat.",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1520&h=1770&q=90&fit=crop",
    alt: "A plate of tacos and a drink on a table outdoors.",
    content: [
      "Hungry for more than bragging rights? Fuel up at our full-service restaurant, where every bite is made from scratch and packed with flavor. From shareable appetizers that disappear fast to crispy chicken, fresh salads and smashburgers worth talking about. We’ve got something tasty for every craving.",
      "Don’t forget to save room for dessert. Our ice cream parlor and over-the-top milkshakes are irresistible. Don’t say we didn’t warn you.",
    ],
  },
  {
    tab: "putt.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1520&h=1770&q=90&fit=crop",
    alt: "A woman standing on a golf course, holding a golf club after taking a swing.",
    content: [
      "Step onto the greens and into the game. Our 18-hole putting courses aren’t your average backyard mini-golf setups, they’re designed to test your skills and stir up a little friendly competition. With smooth synthetic fairways, sneaky bunkers, and unpredictable breaks, every round keeps you on your toes.",
    ],
  },
  {
    tab: "drink.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1520&h=1770&q=90&fit=crop",
    alt: "A glass holding an iced tea cocktail with a lemon slice in front of a golf club.",
    content: [
      "Grab a cold one and settle in at our lively sports bar, the perfect spot to catch the latest game or celebrate that clutch hole-in-one. With craft beers, premium spirits, and cocktails mixed to perfection, every sip goes down as smooth as your best putt.",
      "Order straight from our app and get drinks delivered right to you on the course, because at PopStroke, the party doesn’t have to stop.",
    ],
  },
];

(() => {
  const slider = document.getElementById("popstrokeSlider");
  const media = slider?.querySelector("[data-slider-media]");
  const tabList = slider?.querySelector("[data-slider-tabs]");
  const panelsWrap = slider?.querySelector("[data-slider-panels]");
  const overlay = slider?.querySelector("[data-slider-overlay]");

  if (
    !slider ||
    !media ||
    !tabList ||
    !panelsWrap ||
    !POPSTROKE_CONTENT.length
  ) {
    return;
  }

  const classes = {
    auto: "_autoAdvance_qxh0t_1",
    manual: "_manualAdvance_qxh0t_5",
    heroActive: "_heroActive_qxh0t_1",
    panelActive: "_panelActive_qxh0t_28",
    tabActive: "_tabActive_qxh0t_56",
  };

  const heroClass = "popstroke-slider__slide";

  const tabClass = "popstroke-slider__tab";

  const progressClass = "popstroke-slider__progress _tabProgress_qxh0t_56";

  const progressLevelClass =
    "popstroke-slider__progress-level _tabProgressLevel_qxh0t_88";

  const panelClass = "popstroke-slider__panel";

  const defaultDuration =
    Number.parseInt(slider.style.getPropertyValue("--slideDuration"), 10) ||
    5000;

  const getSlideDuration = (item) =>
    Number.isFinite(item.duration) && item.duration > 0
      ? item.duration
      : defaultDuration;

  const createElement = (tag, options = {}) => {
    const element = document.createElement(tag);
    Object.assign(element, options);
    return element;
  };

  POPSTROKE_CONTENT.forEach((item, index) => {
    const slideDuration = getSlideDuration(item);
    const hero = createElement("div", {
      className: item.video ? `${heroClass} ${heroClass}--video` : heroClass,
    });

    hero.style.setProperty("--index", index);
    hero.style.setProperty("--itemDuration", `${slideDuration}ms`);

    if (item.video) {
      const video = createElement("video", {
        src: item.video,
        muted: true,
        controls: true,
        playsInline: true,
        preload: "metadata",
      });

      video.setAttribute("aria-label", item.alt || item.tab);
      hero.append(video);
    } else {
      const picture = createElement("picture");

      const image = createElement("img", {
        src: item.image,
        alt: item.alt || "",
        width: 1520,
        height: 1770,
        decoding: "async",
        loading: index === 0 ? "eager" : "lazy",
      });

      picture.append(image);
      hero.append(picture);
    }
    media.append(hero);

    const tab = createElement("button", {
      id: `popstroke-tab-${index}`,
      type: "button",
      role: "tab",
      className: item.video ? `${tabClass} ${tabClass}--video` : tabClass,
    });

    tab.setAttribute("aria-controls", `popstroke-panel-${index}`);
    tab.style.setProperty("--itemDuration", `${slideDuration}ms`);

    tab.append(document.createTextNode(item.tab));

    const progress = createElement("span", {
      className: progressClass,
    });

    progress.append(
      createElement("span", {
        className: progressLevelClass,
      }),
    );

    tab.append(progress);
    tabList.append(tab);

    const panel = createElement("div", {
      id: `popstroke-panel-${index}`,
      role: "tabpanel",
      className: item.video ? `${panelClass} ${panelClass}--video` : panelClass,
    });

    panel.style.setProperty("--index", index);
    panel.style.setProperty("--itemDuration", `${slideDuration}ms`);
    panel.setAttribute("aria-labelledby", tab.id);

    item.content.forEach((text, paragraphIndex) => {
      panel.append(
        createElement("p", {
          className:
            paragraphIndex < item.content.length - 1
              ? "popstroke-slider__paragraph--spaced"
              : "",
          textContent: text,
        }),
      );
    });

    panelsWrap.insertBefore(panel, overlay || null);
  });

  const heroes = [...media.children];
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];
  const panels = [...panelsWrap.querySelectorAll('[role="tabpanel"]')];

  let activeWindow = [0];
  let hasInteraction = false;
  let timer = null;

  const getActiveIndex = () => activeWindow.at(-1) ?? 0;

  const getNextIndex = (index) => (index + 1) % POPSTROKE_CONTENT.length;

  const syncVideoProgress = (index, video) => {
    const progressLevel = tabs[index]?.querySelector(
      "._tabProgressLevel_qxh0t_88",
    );

    if (!progressLevel) {
      return;
    }

    const duration = video.duration;
    const ratio =
      Number.isFinite(duration) && duration > 0
        ? Math.min(Math.max(video.currentTime / duration, 0), 1)
        : 0;

    progressLevel.style.width = `${(1 - ratio) * 100}%`;
  };

  const render = () => {
    const activeIndex = getActiveIndex();
    const visibleIndexes = new Set(activeWindow);

    slider.classList.toggle(classes.auto, !hasInteraction);

    slider.classList.toggle(classes.manual, hasInteraction);

    heroes.forEach((hero, index) => {
      const isCurrent = index === activeIndex;
      const video = hero.querySelector("video");

      hero.classList.toggle(classes.heroActive, visibleIndexes.has(index));

      if (video) {
        if (isCurrent) {
          video.play().catch(() => {});
        } else {
          video.pause();

          if (video.readyState > 0) {
            video.currentTime = 0;
          }

          syncVideoProgress(index, video);
        }
      }
    });

    panels.forEach((panel, index) => {
      const isActive = index === activeIndex;

      panel.classList.toggle(classes.panelActive, visibleIndexes.has(index));

      panel.setAttribute("aria-current", String(isActive));

      panel.setAttribute("aria-hidden", String(!isActive));
    });

    tabs.forEach((tab, index) => {
      const isActive = index === activeIndex;

      tab.classList.toggle(classes.tabActive, isActive);

      tab.setAttribute("aria-selected", String(isActive));

      tab.tabIndex = isActive ? 0 : -1;
    });
  };

  const stopAutoPlay = () => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  const advanceToNextSlide = () => {
    if (hasInteraction || POPSTROKE_CONTENT.length <= 1) {
      return;
    }

    stopAutoPlay();
    activeWindow = [getNextIndex(getActiveIndex())];

    render();
    scheduleNextSlide();
  };

  const scheduleNextSlide = () => {
    if (hasInteraction || POPSTROKE_CONTENT.length <= 1) {
      return;
    }

    stopAutoPlay();

    const activeIndex = getActiveIndex();
    const activeItem = POPSTROKE_CONTENT[activeIndex];

    if (activeItem.video) {
      return;
    }

    timer = window.setTimeout(
      advanceToNextSlide,
      getSlideDuration(activeItem),
    );
  };

  heroes.forEach((hero, index) => {
    const video = hero.querySelector("video");

    if (!video) {
      return;
    }

    let progressFrame = null;

    const stopProgressUpdates = () => {
      if (progressFrame !== null) {
        window.cancelAnimationFrame(progressFrame);
        progressFrame = null;
      }
    };

    const updateProgress = () => {
      syncVideoProgress(index, video);

      if (!video.paused && !video.ended) {
        progressFrame = window.requestAnimationFrame(updateProgress);
      } else {
        progressFrame = null;
      }
    };

    const startProgressUpdates = () => {
      stopProgressUpdates();
      updateProgress();
    };

    video.addEventListener("play", startProgressUpdates);

    video.addEventListener("pause", () => {
      stopProgressUpdates();
      syncVideoProgress(index, video);
    });

    ["loadedmetadata", "durationchange", "seeking", "seeked"].forEach(
      (eventName) => {
        video.addEventListener(eventName, () => {
          syncVideoProgress(index, video);
        });
      },
    );

    video.addEventListener("ended", () => {
      stopProgressUpdates();
      syncVideoProgress(index, video);

      if (!hasInteraction && index === getActiveIndex()) {
        advanceToNextSlide();
      }
    });

    video.addEventListener("error", () => {
      stopProgressUpdates();

      if (!hasInteraction && index === getActiveIndex()) {
        stopAutoPlay();
        timer = window.setTimeout(advanceToNextSlide, defaultDuration);
      }
    });

    syncVideoProgress(index, video);
  });

  const selectSlide = (index) => {
    if (index < 0 || index >= POPSTROKE_CONTENT.length) {
      return;
    }

    hasInteraction = true;
    activeWindow = [index];

    stopAutoPlay();
    render();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      selectSlide(index);
    });

    tab.addEventListener("keydown", (event) => {
      const current = getActiveIndex();

      const keyMap = {
        Home: 0,
        End: tabs.length - 1,
        ArrowLeft: (current - 1 + tabs.length) % tabs.length,
        ArrowUp: (current - 1 + tabs.length) % tabs.length,
        ArrowRight: getNextIndex(current),
        ArrowDown: getNextIndex(current),
      };

      if (!(event.key in keyMap)) {
        return;
      }

      event.preventDefault();

      const next = keyMap[event.key];

      tabs[next].focus();
      selectSlide(next);
    });
  });

  render();
  scheduleNextSlide();
})();
