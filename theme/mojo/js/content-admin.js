(() => {
  const editor = document.querySelector(".mc-form");
  if (!editor) return;
  const rows = editor.querySelector("[data-rows]");
  let sequence = 0;
  function updateOrderButtons() {
    if (!rows) return;
    for (const row of rows.children) {
      row.querySelector("[data-up]").disabled = !row.previousElementSibling && rows.dataset.previous !== "1";
      row.querySelector("[data-down]").disabled = !row.nextElementSibling && rows.dataset.next !== "1";
    }
  }
  updateOrderButtons();
  let dirty = false;
  editor.addEventListener("input", () => { dirty = true; });
  editor.addEventListener("submit", () => { dirty = false; });
  window.addEventListener("beforeunload", event => {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });
  editor.addEventListener("input", event => {
    const row = event.target.closest("[data-row]");
    if (!row) return;
    const title = row.querySelector('[name$="[title]"], [name$="[name]"]') || row.querySelector('[name$="[tag]"]');
    if (title === event.target) row.querySelector("[data-row-title]").textContent = title.value || "New item";
  });
  function moveAcrossPages(direction) {
    if (!editor.reportValidity()) return;
    if (!window.confirm("Save this page and move the item to the " + direction + " page?")) return;
    editor.elements.move_page.value = direction;
    editor.requestSubmit();
  }
  editor.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-media")) {
      const box = button.closest(".mc-field");
      const frame = wp.media({ title: "Choose image", library: { type: "image" }, multiple: false });
      frame.on("select", () => {
        const image = frame.state().get("selection").first().toJSON();
        box.querySelector("[data-image-value]").value = image.id;
        box.querySelector("[data-image-empty]").hidden = true;
        box.querySelector("[data-clear-image]").hidden = false;
        dirty = true;
        const preview = box.querySelector("img");
        preview.src = image.sizes?.thumbnail?.url || image.url;
        preview.hidden = false;
      });
      frame.open();
      return;
    }
    if (button.hasAttribute("data-clear-image")) {
      const box = button.closest(".mc-field");
      box.querySelector("[data-image-value]").value = "";
      box.querySelector("img").hidden = true;
      box.querySelector("[data-image-empty]").hidden = false;
      button.hidden = true;
      box.querySelector("[data-media]").focus();
      dirty = true;
      return;
    }
    if (button.hasAttribute("data-remove-slot")) {
      button.parentElement.remove();
      dirty = true;
      return;
    }
    if (button.hasAttribute("data-add-slot")) {
      const slot = document.createElement("div");
      slot.innerHTML = '<input type="time" aria-label="Lesson time" required><button type="button" class="button" data-remove-slot>Remove time</button>';
      const input = slot.querySelector("input");
      input.name = button.dataset.name;
      button.previousElementSibling.append(slot);
      input.focus();
      dirty = true;
      return;
    }
    if (!rows || button.type === "submit") return;
    if (button.hasAttribute("data-add")) {
      const clone = editor.querySelector("#mojo-row").content.cloneNode(true);
      const id = "new" + sequence++;
      clone.querySelectorAll("[name], label").forEach(el => {
        for (const attr of ["name", "id", "for"]) {
          if (el.hasAttribute(attr)) el.setAttribute(attr, el.getAttribute(attr).replace("NEW", id));
        }
      });
      const field = clone.querySelector('input:not([type="hidden"]), textarea, select');
      rows.prepend(clone);
      dirty = true;
      field.focus();
    }
    const row = button.closest("[data-row]");
    if (row) {
      if (button.hasAttribute("data-remove")) row.remove();
      if (button.hasAttribute("data-up")) {
        if (row.previousElementSibling) rows.insertBefore(row, row.previousElementSibling);
        else return moveAcrossPages("previous");
      }
      if (button.hasAttribute("data-down")) {
        if (row.nextElementSibling) rows.insertBefore(row.nextElementSibling, row);
        else return moveAcrossPages("next");
      }
      dirty = true;
    }
    updateOrderButtons();
  });
})();
