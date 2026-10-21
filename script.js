"use strict";
const toggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("#navigation");
if (toggle && navigation) {
  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
  };
  toggle.hidden = false;
  navigation.classList.add("enhanced");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("open", open);
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    ) {
      close();
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("header")) close();
  });
  matchMedia("(min-width: 800px)").addEventListener("change", close);
}
