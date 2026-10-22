import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Minimal History-API router: real URLs (/work, /contact), no extra dependency.
// vercel.json rewrites every non-/api path to index.html so refreshes work.

const RouterContext = createContext({ path: "/", navigate: () => {} });

const clean = (pathname) => {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
};

export function Router({ children }) {
  const [path, setPath] = useState(() => clean(window.location.pathname));
  const [navCount, setNavCount] = useState(0);

  // Old hash link from the previous single-page version (#/projects).
  useEffect(() => {
    const redirectOldLink = () => {
      if (window.location.hash.startsWith("#/projects")) {
        window.history.replaceState({}, "", "/work");
        setPath("/work");
      }
    };
    redirectOldLink();
    window.addEventListener("hashchange", redirectOldLink);
    return () => window.removeEventListener("hashchange", redirectOldLink);
  }, []);

  useEffect(() => {
    const onPop = () => {
      setPath(clean(window.location.pathname));
      setNavCount((n) => n + 1);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to) => {
    const url = new URL(to, window.location.origin);
    window.history.pushState({}, "", url.pathname + url.search + url.hash);
    setPath(clean(url.pathname));
    setNavCount((n) => n + 1);
  }, []);

  // After every navigation: jump to #section if present, otherwise to the top.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [navCount]);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Link({ to, onClick, children, ...rest }) {
  const { navigate } = useContext(RouterContext);

  const handleClick = (event) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      rest.target === "_blank"
    ) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

export const usePath = () => useContext(RouterContext).path;
export const useNavigate = () => useContext(RouterContext).navigate;
