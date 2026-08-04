import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaGithub, FaBars, FaTimes } from "react-icons/fa";
import { usePortfolioData } from "../context/PortfolioDataContext";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#blog", label: "Blog" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { data } = usePortfolioData();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 bg-transparent ${
        scrolled ? "sm:bg-black/80 sm:backdrop-blur-md sm:border-b sm:border-neutral-900" : ""
      }`}
    >
      <div className="flex items-center justify-end px-5 sm:px-6 md:px-14 py-3 sm:py-4">
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-neutral-300">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="relative group py-1">
              {l.label}
              <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
          {data.footer.github && (
            <a
              href={data.footer.github}
              target="_blank"
              rel="noreferrer"
              className="hover:-translate-y-1 transition duration-300 text-base"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex items-center justify-center h-11 w-11 -mr-2 text-neutral-100"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-black/95 border-b border-neutral-900"
          >
            <div className="flex flex-col px-5 py-4 gap-1">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="py-3 text-sm uppercase tracking-[0.2em] text-neutral-200 border-b border-neutral-900 last:border-none"
                >
                  {l.label}
                </motion.a>
              ))}
              {data.footer.github && (
                <a
                  href={data.footer.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm uppercase tracking-[0.2em] text-neutral-200 flex items-center gap-2"
                >
                  <FaGithub /> GitHub
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
