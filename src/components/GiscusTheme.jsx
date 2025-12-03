import { useEffect, useState } from "react";

const GiscusThemeSwitcher = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe) return;

    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme } } },
      "https://giscus.app"
    );
  }, [theme]);

  return (
    <div className="giscus-theme-switcher">
      <label>Comments Theme:</label>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="dark_dimmed">Dark Dimmed</option>
        <option value="light_high_contrast">Light High Contrast</option>
        <option value="dark_high_contrast">Dark High Contrast</option>
        <option value="preferred_color_scheme">Auto</option>
      </select>
    </div>
  );
};

export default GiscusThemeSwitcher;
