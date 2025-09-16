const container = document.createElement("div");
container.classList.add("fixed", "top-5", "right-5", "space-y-2", "z-50");
document.body.appendChild(container);

function notification({
  title = "",
  body = "",
  type = "default",
  icon = null,
  duration = 4000,
}) {
  const typeStyles = {
    success: "bg-green-50 border-green-300 text-green-800",
    info: "bg-blue-50 border-blue-300 text-blue-800",
    error: "bg-red-50 border-red-300 text-red-800",
    default: "bg-white border-gray-200 text-gray-800",
  };

  const el = document.createElement("div");
  el.setAttribute("role", "alert");
  el.className = `
        flex items-start gap-3 shadow-lg rounded-xl p-4 w-80 border 
        ${typeStyles[type] || typeStyles.default} animate-slide-in
    `;

  el.innerHTML = `
        ${icon ? `<div class="flex-shrink-0"><img src="${icon}" class="h-6 w-6 object-contain" alt="icon"></div>` : ""}
        <div class="flex-1 text-sm">
            ${title ? `<div class="font-semibold mb-1">${title}</div>` : ""}
            <div>${body}</div>
        </div>
        <button class="text-2xl text-gray-400 hover:text-gray-600" aria-label="Close notification">&times;</button>
    `;

  const remove = () => {
    el.classList.remove("animate-slide-in");
    el.classList.add("animate-slide-out");
    el.addEventListener("animationend", () => el.remove());
  };

  el.querySelector("button").addEventListener("click", remove);

  let start = Date.now();
  let remaining = duration;
  let timer = setTimeout(remove, remaining);

  el.addEventListener("mouseenter", () => {
    clearTimeout(timer);
    remaining -= Date.now() - start;
  });

  el.addEventListener("mouseleave", () => {
    start = Date.now();
    timer = setTimeout(remove, remaining);
  });

  container.appendChild(el);
}
