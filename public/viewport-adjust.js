const resize = () => {
  if (screen.width < 450) {
    var viewport = document.querySelector("meta[name=viewport]");
    viewport.parentNode.removeChild(viewport);

    var newViewport = document.createElement("meta");
    newViewport.setAttribute("name", "viewport");
    newViewport.setAttribute(
      "content",
      "width=450, maximum-scale=1.0, user-scalable=no"
    );
    document.head.appendChild(newViewport);
  }
};
resize();
window.addEventListener("orientationchange", resize);