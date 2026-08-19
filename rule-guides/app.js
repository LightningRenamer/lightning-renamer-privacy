(() => {
  "use strict";

  const content = globalThis.LIGHTNING_RENAMER_RULE_HELP;
  const tutorialContent = globalThis.LIGHTNING_RENAMER_TUTORIALS ?? { tutorials: [] };
  const nav = document.querySelector("#rule-nav");
  const article = document.querySelector("#article");
  const main = document.querySelector("#rule-guide");
  const sidebar = document.querySelector("#sidebar");
  const menuButton = document.querySelector("#menu-button");
  const scrim = document.querySelector("#sidebar-scrim");
  const mobilePageName = document.querySelector(".mobile-brand-section");
  const mobileViewport = window.matchMedia("(max-width: 820px)");

  if (!content?.rules?.length) {
    article.textContent = "Rule help content could not be loaded.";
    return;
  }

  const element = (tag, className = "", text = "") => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const appendList = (parent, items, ordered = false, className = "") => {
    const list = element(ordered ? "ol" : "ul", className);
    for (const item of items) {
      list.append(element("li", "", item));
    }
    parent.append(list);
    return list;
  };

  const sectionHeading = (title, description = "", index = "") => {
    const wrapper = element("div", "section-heading");
    if (index) wrapper.append(element("span", "section-index", index));
    const copy = element("div", "section-heading-copy");
    copy.append(element("h2", "", title));
    if (description) copy.append(element("p", "", description));
    wrapper.append(copy);
    return wrapper;
  };

  const updateActivePage = (id) => {
    document.querySelectorAll(".rule-link").forEach((link) => {
      const active = link.dataset.pageId === id;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  const appendTutorialExamples = (parent, examples) => {
    const list = element("div", "tutorial-examples");

    for (const item of examples) {
      const block = element("section", "tutorial-example");
      block.append(element("h3", "", item.title));

      const pattern = element("div", "tutorial-pattern");
      pattern.append(element("span", "tutorial-pattern-label", "Pattern"));
      pattern.append(element("code", "", item.pattern));
      block.append(pattern);

      const rows = element("dl", "tutorial-example-rows");
      for (const row of item.rows) {
        const rowElement = element("div", "tutorial-example-row");
        rowElement.append(element("dt", "", row.label));
        const valueClass = row.label === "Result" ? "tutorial-example-value result" : "tutorial-example-value";
        rowElement.append(element("dd", valueClass, row.value));
        rows.append(rowElement);
      }
      block.append(rows);

      if (item.note) block.append(element("p", "tutorial-example-note", item.note));
      list.append(block);
    }

    parent.append(list);
  };

  const renderTutorialSection = (section, index) => {
    const sectionElement = element("section", "guide-section tutorial-section");
    sectionElement.append(
      sectionHeading(section.title, section.intro, String(index + 1).padStart(2, "0"))
    );

    for (const paragraph of section.paragraphs ?? []) {
      sectionElement.append(element("p", "tutorial-paragraph", paragraph));
    }

    if (section.syntax?.length) {
      const list = element("dl", "syntax-list");
      for (const item of section.syntax) {
        const row = element("div", "syntax-row");
        const term = element("dt", "syntax-token");
        term.append(element("code", "", item.token));
        const description = element("dd", "syntax-description");
        description.append(element("strong", "", item.name));
        description.append(element("p", "", item.description));
        if (item.example) description.append(element("code", "syntax-example", item.example));
        row.append(term, description);
        list.append(row);
      }
      sectionElement.append(list);
    }

    if (section.lessons?.length) {
      const list = element("ol", "lesson-list");
      for (const item of section.lessons) {
        const listItem = element("li", "lesson-item");
        const body = element("div", "lesson-body");
        body.append(element("h3", "", item.title));
        body.append(element("p", "", item.description));
        if (item.pattern) {
          const pattern = element("div", "lesson-pattern");
          pattern.append(element("code", "", item.pattern));
          body.append(pattern);
        }
        if (item.result) body.append(element("p", "lesson-result", item.result));
        listItem.append(body);
        list.append(listItem);
      }
      sectionElement.append(list);
    }

    if (section.examples?.length) appendTutorialExamples(sectionElement, section.examples);
    if (section.bullets?.length) appendList(sectionElement, section.bullets, false, "tutorial-bullets");
    if (section.callout) {
      const callout = element("aside", "tutorial-callout");
      callout.append(element("p", "", section.callout));
      sectionElement.append(callout);
    }

    return sectionElement;
  };

  const revealContent = () => {
    article.querySelectorAll(":scope > *").forEach((node) => {
      node.classList.add("reveal");
      node.classList.remove("is-visible");
    });

    if (typeof initReveal === "function") {
      initReveal(article);
      return;
    }

    article.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
  };

  const renderTutorial = (tutorial, moveFocus = false) => {
    document.title = `${tutorial.name} - Lightning Renamer`;
    article.replaceChildren();

    const header = element("header", "rule-header tutorial-header");
    const title = element("h1", "rule-title", tutorial.name);
    title.id = "rule-title";
    title.tabIndex = -1;
    header.append(element("p", "page-kicker", "Reference guide"));
    header.append(title);
    header.append(element("p", "rule-summary", tutorial.summary));
    article.append(header);

    tutorial.sections.forEach((section, index) => {
      article.append(renderTutorialSection(section, index));
    });
    updateActivePage(tutorial.id);
    mobilePageName.textContent = tutorial.name;

    if (moveFocus) {
      window.scrollTo({ top: 0, behavior: "auto" });
      title.focus({ preventScroll: true });
    }

    revealContent();
  };

  const renderOptions = (rule) => {
    const section = element("section", "guide-section options-section");
    section.append(
      sectionHeading(
        "Options",
        "Understand what each setting changes before adding the rule.",
        "01"
      )
    );

    let optionIndex = 0;
    for (const group of rule.optionGroups) {
      const groupElement = element("section", "option-group");
      groupElement.append(element("h3", "", group.title));
      const list = element("dl", "option-list");

      for (const item of group.options) {
        const row = element("div", "option-row");
        const term = element("dt");
        term.append(
          element("span", "option-index", String(++optionIndex).padStart(2, "0")),
          element("span", "option-name", item.name)
        );
        row.append(term);
        row.append(element("dd", "", item.description));
        list.append(row);
      }

      groupElement.append(list);
      section.append(groupElement);
    }

    const notesGroup = element("section", "option-group notes-option");
    const notesTitle = element("h3");
    notesTitle.append(
      element("span", "option-index", String(++optionIndex).padStart(2, "0")),
      element("span", "option-name", rule.notes.name)
    );
    notesGroup.append(notesTitle);
    notesGroup.append(element("p", "notes-description", rule.notes.description));
    section.append(notesGroup);
    return section;
  };

  const renderExamples = (rule) => {
    const section = element("section", "guide-section examples-section");
    section.append(
      sectionHeading(
        "Examples",
        "Compare the settings with the filenames they produce.",
        "02"
      )
    );

    const examples = element("div", "examples-list");
    rule.examples.forEach((item, index) => {
      const block = element("section", "example-block");
      const header = element("div", "example-header");
      header.append(element("span", "example-number", String(index + 1).padStart(2, "0")));
      header.append(element("h3", "", item.title));
      block.append(header);

      const body = element("div", "example-body");
      const settings = element("dl", "settings-list");
      for (const setting of item.settings) {
        const separator = setting.indexOf(":");
        const name = separator === -1 ? "Setting" : setting.slice(0, separator).trim();
        const value = separator === -1 ? setting : setting.slice(separator + 1).trim();
        const row = element("div", "setting-row");
        row.append(element("dt", "", name));
        row.append(element("dd", "", value));
        settings.append(row);
      }
      body.append(settings);

      if (item.code) {
        const script = element("div", "script-panel");
        script.append(element("p", "example-label", "Script"));
        const pre = element("pre", "code-block");
        pre.append(element("code", "", item.code));
        script.append(pre);
        body.append(script);
      }

      if (item.transformations?.length) {
        const table = element("div", "transform-table");
        table.setAttribute("role", "table");
        table.setAttribute("aria-label", `${item.title} before and after`);

        const tableHeader = element("div", "transform-row transform-header");
        tableHeader.setAttribute("role", "row");
        for (const label of ["Before", "", "After"]) {
          const cell = element("span", "", label);
          if (label) cell.setAttribute("role", "columnheader");
          else cell.setAttribute("aria-hidden", "true");
          tableHeader.append(cell);
        }
        table.append(tableHeader);

        for (const transformation of item.transformations) {
          const row = element("div", "transform-row");
          row.setAttribute("role", "row");
          const before = element("code", "filename before", transformation.before);
          before.setAttribute("role", "cell");
          const arrow = element("span", "transform-arrow", "→");
          arrow.setAttribute("aria-hidden", "true");
          const afterCell = element("div", "after-cell");
          afterCell.setAttribute("role", "cell");
          afterCell.append(element("code", "filename result after", transformation.after));
          if (transformation.note) afterCell.append(element("span", "change-note", transformation.note));
          row.append(before, arrow, afterCell);
          table.append(row);
        }
        body.append(table);
      }

      block.append(body);
      if (item.note) block.append(element("p", "example-note", item.note));
      examples.append(block);
    });

    section.append(examples);
    return section;
  };

  const renderRule = (rule, moveFocus = false) => {
    document.title = `${rule.name} Rule Help - Lightning Renamer`;
    article.replaceChildren();

    const header = element("header", "rule-header");
    const title = element("h1", "rule-title", rule.name);
    title.id = "rule-title";
    title.tabIndex = -1;
    const ruleIndex = content.rules.findIndex((item) => item.id === rule.id) + 1;
    header.append(element("p", "page-kicker", `Rule ${String(ruleIndex).padStart(2, "0")}`));
    header.append(title);
    header.append(element("p", "rule-summary", rule.summary));
    article.append(header);

    article.append(renderOptions(rule));
    article.append(renderExamples(rule));

    const tips = element("section", "guide-section tips-section");
    tips.append(
      sectionHeading(
        "Tips and edge cases",
        "Details that matter with mixed, empty, or unusual filenames.",
        "03"
      )
    );
    appendList(tips, rule.tips, true, "tips-list");
    article.append(tips);

    const index = content.rules.findIndex((item) => item.id === rule.id);
    const footer = element("nav", "article-footer");
    footer.setAttribute("aria-label", "Adjacent rules");
    const previous = content.rules[index - 1];
    const next = content.rules[index + 1];
    footer.append(previous ? adjacentLink(previous, "Previous rule") : element("span", "article-footer-spacer"));
    footer.append(next ? adjacentLink(next, "Next rule") : element("span", "article-footer-spacer"));
    article.append(footer);

    updateActivePage(rule.id);
    mobilePageName.textContent = rule.name;

    if (moveFocus) {
      window.scrollTo({ top: 0, behavior: "auto" });
      title.focus({ preventScroll: true });
    }

    revealContent();
  };

  const adjacentLink = (rule, label) => {
    const link = element("a", "adjacent-link");
    link.href = `#${rule.id}`;
    link.append(element("span", "adjacent-label", label));
    link.append(element("span", "adjacent-name", rule.name));
    return link;
  };

  const selectedPage = () => {
    const requestedId = decodeURIComponent(window.location.hash.slice(1));
    const legacyIds = {
      "wildcard-tutorial": "wildcards",
      "regular-expression-tutorial": "regular-expressions",
    };
    const id = legacyIds[requestedId] ?? requestedId;
    const rule = content.rules.find((item) => item.id === id);
    if (rule) return { kind: "rule", item: rule };
    const tutorial = tutorialContent.tutorials.find((item) => item.id === id);
    if (tutorial) return { kind: "tutorial", item: tutorial };
    return { kind: "rule", item: content.rules[0] };
  };

  const renderSelectedPage = (moveFocus = false) => {
    const page = selectedPage();
    if (page.kind === "tutorial") renderTutorial(page.item, moveFocus);
    else renderRule(page.item, moveFocus);
  };

  const closeMenu = (returnFocus = false) => {
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open help navigation");
    scrim.tabIndex = -1;
    if (returnFocus) menuButton.focus();
  };

  const syncNavigationControl = () => {
    if (mobileViewport.matches) {
      const open = document.body.classList.contains("menu-open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close help navigation" : "Open help navigation");
      scrim.tabIndex = open ? 0 : -1;
      return;
    }

    const visible = !document.body.classList.contains("nav-collapsed");
    menuButton.setAttribute("aria-expanded", String(visible));
    menuButton.setAttribute("aria-label", visible ? "Close help navigation" : "Open help navigation");
    scrim.tabIndex = -1;
  };

  for (const page of [...content.rules, ...tutorialContent.tutorials]) {
    const link = element("a", "rule-link", page.name);
    link.href = `#${page.id}`;
    link.dataset.pageId = page.id;
    link.addEventListener("click", () => {
      if (mobileViewport.matches) closeMenu();
    });
    nav.append(link);
  }

  menuButton.addEventListener("click", () => {
    if (!mobileViewport.matches) {
      document.body.classList.toggle("nav-collapsed");
      syncNavigationControl();
      return;
    }

    const opening = !document.body.classList.contains("menu-open");
    document.body.classList.toggle("menu-open", opening);
    syncNavigationControl();
    if (opening) requestAnimationFrame(() => sidebar.querySelector(".rule-link.active")?.focus());
  });

  scrim.addEventListener("click", () => closeMenu(true));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key === "Tab" && document.body.classList.contains("menu-open") && mobileViewport.matches) {
      const focusable = [
        menuButton,
        ...sidebar.querySelectorAll("a[href]"),
        scrim,
      ];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  mobileViewport.addEventListener("change", (event) => {
    document.body.classList.remove("menu-open", "nav-collapsed");
    syncNavigationControl();
  });

  window.addEventListener("hashchange", () => renderSelectedPage(true));

  if (!window.location.hash) history.replaceState(null, "", `#${content.rules[0].id}`);
  renderSelectedPage();
  syncNavigationControl();
})();
