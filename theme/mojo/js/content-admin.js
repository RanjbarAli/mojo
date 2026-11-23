(() => {
  const editor = document.querySelector(".mc-form");
  if (!editor) return;
  const rows = editor.querySelector("[data-rows]");
  let sequence = 0;
  function updateOrderButtons() {
    if (!rows) return;
    for (const row of rows.children) {
      row.querySelector("[data-up]").disabled = !row.previousElementSibling;
      row.querySelector("[data-down]").disabled = !row.nextElementSibling;
    }
  }
  updateOrderButtons();
  editor.addEventListener("input", event => {
    const row = event.target.closest("[data-row]");
    if (!row) return;
    const title = row.querySelector('[name$="[title]"], [name$="[name]"]') || row.querySelector('[name$="[tag]"]');
    if (title === event.target) row.querySelector("[data-row-title]").textContent = title.value || "New item";
  });
  editor.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-media")) {
      const box = button.closest(".mc-field");
      const frame = wp.media({ title: "Choose image", library: { type: "image" }, multiple: false });
      frame.on("select", () => {
        const image = frame.state().get("selection").first().toJSON();
        box.querySelector("input").value = image.id;
        const preview = box.querySelector("img");
        preview.src = image.sizes?.thumbnail?.url || image.url;
        preview.hidden = false;
      });
      frame.open();
      return;
    }
    if (!rows) return;
    if (button.hasAttribute("data-add")) {
      const clone = editor.querySelector("#mojo-row").content.cloneNode(true);
      const id = "new" + sequence++;
      clone.querySelectorAll("[name], label").forEach(el => {
        for (const attr of ["name", "id", "for"]) {
          if (el.hasAttribute(attr)) el.setAttribute(attr, el.getAttribute(attr).replace("NEW", id));
        }
      });
      const field = clone.querySelector("input, textarea, select");
      rows.append(clone);
      field.focus();
    }
    const row = button.closest("[data-row]");
    if (row) {
      if (button.hasAttribute("data-remove")) row.remove();
      if (button.hasAttribute("data-up") && row.previousElementSibling) rows.insertBefore(row, row.previousElementSibling);
      if (button.hasAttribute("data-down") && row.nextElementSibling) rows.insertBefore(row.nextElementSibling, row);
    }
    updateOrderButtons();
  });
})();
