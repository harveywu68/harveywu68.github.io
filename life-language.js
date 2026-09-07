(function () {
  const button = document.getElementById("lang-toggle");
  if (!button) return;

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };
  const concertHeadings = Array.from(document.querySelectorAll("#concert .life-group-head h3"));
  const wikiLinks = {
    gd: "https://en.wikipedia.org/wiki/G-Dragon",
    taeyang: "https://en.wikipedia.org/wiki/Taeyang",
    silence: "https://en.wikipedia.org/wiki/Silence_Wang",
    gem: "https://en.wikipedia.org/wiki/G.E.M.",
    cp: "https://en.wikipedia.org/wiki/Charlie_Puth",
    chainsmokers: "https://en.wikipedia.org/wiki/The_Chainsmokers",
    jj: "https://en.wikipedia.org/wiki/JJ_Lin",
  };
  const baikeLinks = {
    gd: "https://baike.baidu.com/item/%E6%9D%83%E5%BF%97%E9%BE%99",
    taeyang: "https://baike.baidu.com/item/%E4%B8%9C%E6%B0%B8%E8%A3%B4",
    silence: "https://baike.baidu.com/item/%E6%B1%AA%E8%8B%8F%E6%B3%B7",
    gem: "https://baike.baidu.com/item/%E9%82%93%E7%B4%AB%E6%A3%8B",
    cp: "https://baike.baidu.com/item/%E6%9F%A5%E7%90%86%C2%B7%E6%99%AE%E6%96%AF",
    chainsmokers: "https://baike.baidu.com/item/%E7%83%9F%E9%AC%BC%E7%BB%84%E5%90%88",
    jj: "https://baike.baidu.com/item/%E6%9E%97%E4%BF%8A%E6%9D%B0",
  };
  const makePerformerLink = (name, url) =>
    `<a class="performer-link" href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`;
  const setHeadingHtml = (index, html) => {
    const el = concertHeadings[index];
    if (el) el.innerHTML = html;
  };
  const venueLinks = Array.from(document.querySelectorAll("#concert a.meta-venue-link"));
  const locationLinks = Array.from(document.querySelectorAll("#concert a.meta-location-link"));
  const englishVenueMapLinks = [
    "https://maps.google.com/?q=Gocheok+Sky+Dome",
    "https://maps.google.com/?q=Galaxy+Arena+Macau",
    "https://maps.google.com/?q=Galaxy+Arena+Macau",
    "https://maps.google.com/?q=Kai+Tak+Sports+Park",
    "https://maps.google.com/?q=Kai+Tak+Sports+Park",
    "https://maps.google.com/?q=Shenzhen+Universiade+Sports+Centre",
    "https://maps.google.com/?q=The+Venetian+Arena+Macau",
    "https://maps.google.com/?q=Central+Harbourfront+Event+Space+Hong+Kong",
  ];
  const chineseVenueMapLinks = [
    "https://map.baidu.com/search/%E9%AB%98%E5%B0%BA%E5%A4%A9%E7%A9%BA%E5%B7%A8%E8%9B%8B%20%E9%A6%96%E5%B0%94/?querytype=s&da_src=shareurl&wd=%E9%AB%98%E5%B0%BA%E5%A4%A9%E7%A9%BA%E5%B7%A8%E8%9B%8B%20%E9%A6%96%E5%B0%94&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E9%93%B6%E6%B2%B3%E7%BB%BC%E8%89%BA%E9%A6%86%20%E6%BE%B3%E9%97%A8/?querytype=s&da_src=shareurl&wd=%E9%93%B6%E6%B2%B3%E7%BB%BC%E8%89%BA%E9%A6%86%20%E6%BE%B3%E9%97%A8&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E9%93%B6%E6%B2%B3%E7%BB%BC%E8%89%BA%E9%A6%86%20%E6%BE%B3%E9%97%A8/?querytype=s&da_src=shareurl&wd=%E9%93%B6%E6%B2%B3%E7%BB%BC%E8%89%BA%E9%A6%86%20%E6%BE%B3%E9%97%A8&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E5%90%AF%E5%BE%B7%E4%BD%93%E8%82%B2%E5%9B%AD%20%E9%A6%99%E6%B8%AF/?querytype=s&da_src=shareurl&wd=%E5%90%AF%E5%BE%B7%E4%BD%93%E8%82%B2%E5%9B%AD%20%E9%A6%99%E6%B8%AF&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E5%90%AF%E5%BE%B7%E4%BD%93%E8%82%B2%E5%9B%AD%20%E9%A6%99%E6%B8%AF/?querytype=s&da_src=shareurl&wd=%E5%90%AF%E5%BE%B7%E4%BD%93%E8%82%B2%E5%9B%AD%20%E9%A6%99%E6%B8%AF&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E6%B7%B1%E5%9C%B3%E5%A4%A7%E8%BF%90%E4%B8%AD%E5%BF%83%E4%BD%93%E8%82%B2%E9%A6%86%20%E6%B7%B1%E5%9C%B3/?querytype=s&da_src=shareurl&wd=%E6%B7%B1%E5%9C%B3%E5%A4%A7%E8%BF%90%E4%B8%AD%E5%BF%83%E4%BD%93%E8%82%B2%E9%A6%86%20%E6%B7%B1%E5%9C%B3&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E5%A8%81%E5%B0%BC%E6%96%AF%E4%BA%BA%E7%BB%BC%E8%89%BA%E9%A6%86%20%E6%BE%B3%E9%97%A8/?querytype=s&da_src=shareurl&wd=%E5%A8%81%E5%B0%BC%E6%96%AF%E4%BA%BA%E7%BB%BC%E8%89%BA%E9%A6%86%20%E6%BE%B3%E9%97%A8&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E4%B8%AD%E7%8E%AF%E6%B5%B7%E6%BB%A8%E6%B4%BB%E5%8A%A8%E7%A9%BA%E9%97%B4%20%E9%A6%99%E6%B8%AF/?querytype=s&da_src=shareurl&wd=%E4%B8%AD%E7%8E%AF%E6%B5%B7%E6%BB%A8%E6%B4%BB%E5%8A%A8%E7%A9%BA%E9%97%B4%20%E9%A6%99%E6%B8%AF&src=0&pn=0&sug=0&from=webmap",
  ];
  const englishLocationMapLinks = [
    "https://maps.google.com/?q=Seoul",
    "https://maps.google.com/?q=Macau",
    "https://maps.google.com/?q=Macau",
    "https://maps.google.com/?q=Hong+Kong",
    "https://maps.google.com/?q=Hong+Kong",
    "https://maps.google.com/?q=Shenzhen",
    "https://maps.google.com/?q=Macau",
    "https://maps.google.com/?q=Hong+Kong",
  ];
  const chineseLocationMapLinks = [
    "https://map.baidu.com/search/%E9%A6%96%E5%B0%94/?querytype=s&da_src=shareurl&wd=%E9%A6%96%E5%B0%94&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E6%BE%B3%E9%97%A8/?querytype=s&da_src=shareurl&wd=%E6%BE%B3%E9%97%A8&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E6%BE%B3%E9%97%A8/?querytype=s&da_src=shareurl&wd=%E6%BE%B3%E9%97%A8&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E9%A6%99%E6%B8%AF/?querytype=s&da_src=shareurl&wd=%E9%A6%99%E6%B8%AF&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E9%A6%99%E6%B8%AF/?querytype=s&da_src=shareurl&wd=%E9%A6%99%E6%B8%AF&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E6%B7%B1%E5%9C%B3/?querytype=s&da_src=shareurl&wd=%E6%B7%B1%E5%9C%B3&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E6%BE%B3%E9%97%A8/?querytype=s&da_src=shareurl&wd=%E6%BE%B3%E9%97%A8&src=0&pn=0&sug=0&from=webmap",
    "https://map.baidu.com/search/%E9%A6%99%E6%B8%AF/?querytype=s&da_src=shareurl&wd=%E9%A6%99%E6%B8%AF&src=0&pn=0&sug=0&from=webmap",
  ];
  const englishLocationLabels = [
    "Seoul 🇰🇷",
    "Macau 🇲🇴",
    "Macau 🇲🇴",
    "Hong Kong 🇭🇰",
    "Hong Kong 🇭🇰",
    "Shenzhen 🇨🇳",
    "Macau 🇲🇴",
    "Hong Kong 🇭🇰",
  ];
  const chineseLocationLabels = [
    "首尔 🇰🇷",
    "澳门 🇲🇴",
    "澳门 🇲🇴",
    "香港 🇭🇰",
    "香港 🇭🇰",
    "深圳 🇨🇳",
    "澳门 🇲🇴",
    "香港 🇭🇰",
  ];
  const englishVenueLabels = [
    "Gocheok Sky Dome",
    "Galaxy Arena",
    "Galaxy Arena",
    "Kai Tak Sports Park",
    "Kai Tak Sports Park",
    "Shenzhen Universiade Sports Centre",
    "The Venetian Arena",
    "Central Harbourfront Event Space",
  ];
  const chineseVenueLabels = [
    "高尺天空巨蛋",
    "银河综艺馆",
    "银河综艺馆",
    "启德体育园",
    "启德体育园",
    "深圳大运中心体育馆",
    "威尼斯人综艺馆",
    "中环海滨活动空间",
  ];
  const setMapLinksByLang = (lang) => {
    const venueTargets = lang === "zh" ? chineseVenueMapLinks : englishVenueMapLinks;
    const locationTargets = lang === "zh" ? chineseLocationMapLinks : englishLocationMapLinks;
    venueLinks.forEach((link, i) => {
      if (venueTargets[i]) link.href = venueTargets[i];
    });
    locationLinks.forEach((link, i) => {
      if (locationTargets[i]) link.href = locationTargets[i];
    });
  };
  const setLocationLabelsByLang = (lang) => {
    const labels = lang === "zh" ? chineseLocationLabels : englishLocationLabels;
    locationLinks.forEach((link, i) => {
      if (labels[i]) link.textContent = labels[i];
    });
  };
  const setVenueLabelsByLang = (lang) => {
    const labels = lang === "zh" ? chineseVenueLabels : englishVenueLabels;
    venueLinks.forEach((link, i) => {
      if (!labels[i]) return;
      const icon = link.querySelector(".meta-map-icon");
      if (!icon) {
        link.textContent = labels[i];
        return;
      }
      link.innerHTML = "";
      link.appendChild(icon);
      link.appendChild(document.createTextNode(" " + labels[i]));
    });
  };

  const applyLang = (lang) => {
    if (lang === "zh") {
      document.documentElement.lang = "zh-CN";
    setText("main > section.section.reveal h2", "🌿 科研之外的生活");
    setText('a.side-link[href="./index.html"]', "⬅️ 返回首页");
    setText('a.side-link[href="#contact"]', "✉️ 联系方式");
    setText("#contact > p", "感谢你来了解我博士旅程中生活的一面。");
    setText('#contact a[aria-label="Home"] > span:last-child', "首页");
    setText('#contact a[aria-label="Email"] > span:last-child', "邮箱");
    button.setAttribute("aria-label", "Switch to English");
      document.title = "科研之外的生活 | Hongfei WU";
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", "数据科学与人工智能博士生的个人生活页面。");

      setText(".brand", "Hongfei WU");
      setText('a.side-link[href="#hiking"]', "🥾 徒步");
      setText('a.side-link[href="#photo"]', "📷 摄影");
      setText('a.side-link[href="#concert"]', "🎵 演唱会");

      setText("main > section.section.reveal p", "我把这个页面当作记录生活与创意习惯的个人笔记。");
      setText("#hiking h2", "🥾 徒步");
      setText("#hiking .life-section-intro", "徒步让我在忙碌生活之外找到稳定节奏，也让我更贴近自然。");
      setText("#hiking .life-group-head h3", "周末徒步");

      setText("#photo h2", "📷 摄影");
      setText("#photo .life-section-intro", "摄影让我慢下来，关注构图、质感和细微的视觉线索。");
      setText("#photo .life-group-head h3", "摄影集");

      setText("#concert h2", "🎵 演唱会");
      setText(
        "#concert .life-section-intro",
        "现场音乐是我最喜欢的放松方式之一，我很享受观众之间共享的氛围和能量。"
      );

      setHeadingHtml(
        0,
        `${makePerformerLink("G-Dragon", baikeLinks.gd)} <span class="concert-series-tag" aria-label="第2场">II</span>（权志龙🐲 第二场）`
      );
      setHeadingHtml(
        1,
        `${makePerformerLink("G-Dragon", baikeLinks.gd)} <span class="concert-series-tag" aria-label="第1场">I</span>（权志龙🐲 第一场）`
      );
      setHeadingHtml(2, `${makePerformerLink("TAEYANG", baikeLinks.taeyang)}（太阳🌞：东永裴）`);
      setHeadingHtml(3, makePerformerLink("汪苏泷", baikeLinks.silence));
      setHeadingHtml(4, `${makePerformerLink("G.E.M.", baikeLinks.gem)}（邓紫棋）`);
      setHeadingHtml(5, `${makePerformerLink("Charlie Puth", baikeLinks.cp)}（查理·普斯）`);
      setHeadingHtml(6, `${makePerformerLink("The Chainsmokers", baikeLinks.chainsmokers)}（烟鬼组合）`);
      setHeadingHtml(7, `${makePerformerLink("JJ Lin", baikeLinks.jj)}（林俊杰）`);

      setVenueLabelsByLang("zh");
      setMapLinksByLang("zh");
      setLocationLabelsByLang("zh");

    } else {
      document.documentElement.lang = "en";
    setText("main > section.section.reveal h2", "🌿 Life Beyond Research");
    setText('a.side-link[href="./index.html"]', "⬅️ Back to Home");
    setText('a.side-link[href="#contact"]', "✉️ Contact");
    setText("#contact > p", "Thanks for visiting this personal side of my PhD journey.");
    setText('#contact a[aria-label="Home"] > span:last-child', "Home");
    setText('#contact a[aria-label="Email"] > span:last-child', "Email");
    button.setAttribute("aria-label", "切换为中文");
      document.title = "Life Beyond Research | Hongfei WU";
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", "Personal life page of a Data Science & AI PhD student.");

      setText(".brand", "Hongfei WU");
      setText('a.side-link[href="#hiking"]', "🥾 Hiking");
      setText('a.side-link[href="#photo"]', "📷 Photography");
      setText('a.side-link[href="#concert"]', "🎵 Concerts");

      setText("main > section.section.reveal p", "I keep this page as a personal notebook for routines that support my life and creativity.");
      setText("#hiking h2", "🥾 Hiking");
      setText("#hiking .life-section-intro", "Hiking gives me a steady rhythm outside research and a chance to be in nature.");
      setText("#hiking .life-group-head h3", "Weekend Hike");

      setText("#photo h2", "📷 Photography");
      setText("#photo .life-section-intro", "Photography lets me slow down and pay attention to framing, texture, and small visual patterns.");
      setText("#photo .life-group-head h3", "Photo Gallery");

      setText("#concert h2", "🎵 Concerts");
      setText(
        "#concert .life-section-intro",
        "Live music is one of my favorite ways to reset. I enjoy the atmosphere and share energy of the audience."
      );

      setHeadingHtml(
        0,
        `${makePerformerLink("G-Dragon", wikiLinks.gd)} <span class="concert-series-tag" aria-label="Show 2">II</span>`
      );
      setHeadingHtml(
        1,
        `${makePerformerLink("G-Dragon", wikiLinks.gd)} <span class="concert-series-tag" aria-label="Show 1">I</span>`
      );
      setHeadingHtml(2, makePerformerLink("TAEYANG", wikiLinks.taeyang));
      setHeadingHtml(3, makePerformerLink("Silence Wang", wikiLinks.silence));
      setHeadingHtml(4, makePerformerLink("G.E.M.", wikiLinks.gem));
      setHeadingHtml(5, makePerformerLink("Charlie Puth", wikiLinks.cp));
      setHeadingHtml(6, makePerformerLink("The Chainsmokers", wikiLinks.chainsmokers));
      setHeadingHtml(7, makePerformerLink("JJ Lin", wikiLinks.jj));

      setVenueLabelsByLang("en");
      setMapLinksByLang("en");
      setLocationLabelsByLang("en");

    }
  };

  let saved = null;
  try { saved = localStorage.getItem("lifeLang"); } catch {}

  let currentLang = saved === "zh" ? "zh" : "en";
  applyLang(currentLang);

  button.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "zh" : "en";
    try { localStorage.setItem("lifeLang", currentLang); } catch {}
    applyLang(currentLang);
  });
})();
