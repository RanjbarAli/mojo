(() => {
  let sequence = 0;
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-media")) {
      const field = button.parentElement.querySelector("input, textarea");
      const frame = wp.media({ title: "Choose image", library: { type: "image" }, multiple: false });
      frame.on("select", () => { field.value = frame.state().get("selection").first().id; });
      frame.open();
    }
    const rows = document.querySelector("[data-rows]");
    if (!rows) return;
    if (button.hasAttribute("data-add")) {
      const clone = document.querySelector("#mojo-row").content.cloneNode(true);
      const id = "new" + sequence++;
      clone.querySelectorAll("[name]").forEach(field => { field.name = field.name.replace("[NEW]", "[" + id + "]"); });
      clone.querySelector("details").open = true;
      rows.append(clone);
    }
    const row = button.closest("[data-row]");
    if (!row) return;
    if (button.hasAttribute("data-remove")) row.remove();
    if (button.hasAttribute("data-up") && row.previousElementSibling) rows.insertBefore(row, row.previousElementSibling);
    if (button.hasAttribute("data-down") && row.nextElementSibling) rows.insertBefore(row.nextElementSibling, row);
  });
})();
