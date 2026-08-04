import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { usePortfolioData } from "../context/PortfolioDataContext";
import Navbar from "../components/Navbar";
import Reveal from "../components/Reveal";
import SkillIcon from "../components/SkillIcon";
import WorkBlogToggle from "../components/WorkBlogToggle";
import { formatPublishedAt, postTimestamp } from "../utils/formatDate";

const CATEGORY_LABELS = {
  technology: "Technologies",
  tool: "Tools",
  platform: "Platforms",
};

const gridStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function SkillGroup({ label, items }) {
  if (!items.length) return null;
  return (
    <div className="mb-14 last:mb-0">
      <p className="uppercase tracking-[0.25em] text-xs sm:text-sm text-neutral-500 mb-6 sm:mb-8">
        {label}
      </p>
      <motion.div
        variants={gridStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-y-10 sm:gap-y-14 gap-x-5 sm:gap-x-8"
      >
        {items.map((skill) => (
          <motion.div
            key={skill.id}
            variants={gridItem}
            whileHover={{ y: -6 }}
            className="group flex flex-col items-center justify-start gap-3 sm:gap-4 text-center"
          >
            <div className="transition duration-300 group-hover:scale-110">
              <SkillIcon skill={skill} className="text-4xl sm:text-5xl" />
            </div>
            <p className="text-neutral-200 text-xs sm:text-base tracking-wide font-medium leading-tight">
              {skill.name}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { data } = usePortfolioData();
  const heroRef = useRef(null);
  const [workTab, setWorkTab] = useState("work");

  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash === "#blog" || window.location.hash === "#about") setWorkTab("blog");
      else if (window.location.hash === "#work") setWorkTab("work");
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function selectTab(tab) {
    setWorkTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
  }

  const { scrollYProgress } = useScroll();
  const progressWidth = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0.4]);

  const byCategory = (cat) => data.skills.filter((s) => s.category === cat);

  const [visiblePosts, setVisiblePosts] = useState(3);
  const sortedPosts = [...data.blogPosts].sort((a, b) => postTimestamp(b) - postTimestamp(a));

  return (
    <motion.div
      id="top"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans"
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progressWidth }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left bg-white z-50"
      />

      <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden bg-black">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          {/* Cover image — crop position is set from /admin */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${data.images.hero}')`,
              backgroundSize: "cover",
              backgroundPosition: `${data.images.heroPosition?.x ?? 50}% ${data.images.heroPosition?.y ?? 50}%`,
            }}
          />
          {/* Readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/90" />
        </motion.div>

        <div className="relative z-10 px-5 sm:px-6 md:px-14 pt-20 sm:pt-28 md:pt-36 pb-16 sm:pb-20 md:pb-24 flex flex-col justify-start">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="mt-4 sm:mt-16 md:mt-20 text-[#d9d9d9] uppercase font-['Impact'] leading-[0.82] tracking-[-0.05em] text-[3.2rem] xs:text-[3.8rem] sm:text-[5.5rem] md:text-[6.4rem] lg:text-[7.5rem] xl:text-[9rem] opacity-90 break-words max-w-full"
          >
            ATHARVA
            <br />
            GOIM.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 sm:mt-8 flex flex-col gap-6 max-w-2xl"
          >
            <p className="text-neutral-300 text-sm md:text-base leading-7">
              AI Integrated MERN Stack & Full Stack Developer.
            </p>

            <div className="flex flex-wrap items-center gap-5 sm:gap-8 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-neutral-300">
              <a href="#work" className="hover:text-white transition duration-300">
                Work
              </a>
              <a href="#blog" className="hover:text-white transition duration-300">
                Blog
              </a>
              <a href="#about" className="hover:text-white transition duration-300">
                About
              </a>
              <a href="#contact" className="hover:text-white transition duration-300">
                Contact
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Work / Blog toggle */}
      <section className="py-16 sm:py-24 px-5 sm:px-6 md:px-20 border-t border-neutral-900 bg-black">
        <span id="work" className="block scroll-mt-24" />
        <span id="blog" className="block scroll-mt-24" />
        <span id="about" className="block scroll-mt-24" />

        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="uppercase tracking-[0.3em] text-sm text-neutral-500 mb-4">Explore</p>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white uppercase leading-tight">
                {workTab === "work" ? "Skills & Projects" : "About & Writing"}
              </h2>
            </div>

            {/* Toggle */}
            <WorkBlogToggle activeTab={workTab} onSelect={selectTab} className="self-start" />
          </Reveal>

          <AnimatePresence mode="wait">
            {workTab === "work" ? (
              <motion.div
                key="work-panel"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Skills */}
                <div className="mb-20 sm:mb-28 mt-6 sm:mt-10">
                  <Reveal className="mb-10 sm:mb-12">
                    <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-[-0.02em]">
                      Technologies, Tools & Platforms
                    </h3>
                  </Reveal>

                  <SkillGroup label={CATEGORY_LABELS.technology} items={byCategory("technology")} />
                  <SkillGroup label={CATEGORY_LABELS.tool} items={byCategory("tool")} />
                  <SkillGroup label={CATEGORY_LABELS.platform} items={byCategory("platform")} />
                </div>

                {/* Projects */}
                <div className="max-w-6xl">
                  <Reveal>
                    <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-[-0.02em] mb-8 sm:mb-10">
                      Featured Projects
                    </h3>
                  </Reveal>

                  <motion.div
                    variants={gridStagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    className="flex flex-col gap-5"
                  >
                    {data.projects.map((project) => (
                      <motion.div
                        key={project.id}
                        variants={gridItem}
                        whileHover={{ y: -4, borderColor: "rgba(163,163,163,0.6)" }}
                        className="border border-neutral-900 rounded-2xl p-5 sm:p-6 bg-neutral-950/40 transition duration-300 overflow-hidden"
                      >
                        {project.image && (
                          <div className="mb-5 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-40 sm:h-56 object-cover"
                            />
                          </div>
                        )}
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-3 leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-neutral-400 mb-5 max-w-2xl text-sm sm:text-base">
                          {project.desc}
                        </p>
                        <div className="flex gap-6 uppercase text-xs sm:text-sm tracking-[0.2em]">
                          <a
                            href={project.repository}
                            target="_blank"
                            rel="noreferrer"
                            className="text-neutral-500 hover:text-white transition duration-300"
                          >
                            Repository
                          </a>
                          {project.certificate && (
                            <a
                              href={project.certificate}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-500 hover:text-white transition duration-300"
                            >
                              Certificate
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="blog-panel"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 sm:mt-10"
              >
                {/* About */}
                <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-16 sm:mb-24">
                  <Reveal>
                    <p className="uppercase tracking-[0.3em] text-sm text-neutral-500 mb-4">About Me</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight uppercase tracking-[-0.03em]">
                      Who is Atharva?
                    </h3>
                    <p className="text-neutral-400 leading-8 text-base sm:text-lg max-w-2xl">
                      Outside technology, I am a strong believer in simplicity — in the way I think, live, and create. I value freedom, balance, meaningful experiences, and a lifestyle built around authenticity rather than excess. I enjoy exploring new perspectives, embracing challenges, and constantly pushing beyond comfort zones while staying grounded in clarity and purpose.
                      <br />
                      <br />
                      I believe growth comes from balancing ambition with peace, discipline with spontaneity, and work with life. That mindset shapes the way I approach both personal experiences and the path I continue building for myself.
                    </p>
                  </Reveal>

                  <Reveal delay={0.15} className="overflow-hidden group cursor-pointer rounded-xl">
                    <img
                      src={data.images.about}
                      alt="about"
                      className="aspect-square w-full object-cover sm:grayscale sm:group-hover:grayscale-0 sm:group-hover:scale-105 transition duration-700 ease-out"
                    />
                  </Reveal>
                </div>

                {/* Engineer */}
                <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-16 sm:mb-24">
                  <Reveal className="overflow-hidden group cursor-pointer order-1 md:order-none rounded-xl">
                    <img
                      src={data.images.mindset}
                      alt="mindset"
                      className="aspect-square w-full object-cover sm:grayscale sm:group-hover:grayscale-0 sm:group-hover:scale-105 transition duration-700 ease-out"
                    />
                  </Reveal>

                  <Reveal delay={0.15}>
                    <p className="uppercase tracking-[0.3em] text-sm text-neutral-500 mb-4">Professionally</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight uppercase tracking-[-0.03em]">
                      The Engineer.
                    </h3>
                    <p className="text-neutral-400 leading-8 text-base sm:text-lg max-w-2xl">
                      As an AI-integrated MERN stack & full stack developer, I focus on building scalable web applications, intelligent automation, and immersive digital experiences with clean architecture and modern technologies.
                      <br />
                      <br />
                      My strengths lie in problem-solving, adaptability, system design, and continuously learning evolving technologies. I enjoy creating solutions that combine functionality, performance, and minimal cinematic design while maintaining efficient development workflows.
                    </p>
                  </Reveal>
                </div>

                {/* Blog posts */}
                <Reveal className="mb-8 sm:mb-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-[-0.02em]">
                    Thoughts & Writing
                  </h3>
                </Reveal>

                {data.blogPosts.length === 0 ? (
                  <div className="border border-neutral-900 rounded-2xl p-8 sm:p-12 text-center max-w-6xl">
                    <p className="text-neutral-500 text-sm sm:text-base">
                      No posts yet — new writing will show up here soon.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl">
                      {sortedPosts.slice(0, visiblePosts).map((post) => (
                        <div
                          key={post.id}
                          className="border border-neutral-900 rounded-2xl overflow-hidden bg-neutral-950/40 hover:border-neutral-700 transition duration-300 flex flex-col"
                        >
                          {post.image && (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full aspect-square object-cover rounded-t-xl"
                            />
                          )}
                          <div className="p-5 sm:p-6 flex flex-col flex-1">
                            {(post.publishedAt || post.date) && (
                              <p className="text-neutral-600 text-xs uppercase tracking-[0.2em] mb-2">
                                {formatPublishedAt(post.publishedAt, post.date)}
                              </p>
                            )}
                            <h3 className="text-lg sm:text-xl font-bold uppercase mb-3 leading-tight">
                              {post.title}
                            </h3>
                            <p className="text-neutral-400 text-sm leading-6 mb-5 flex-1">{post.excerpt}</p>
                            {post.link && (
                              <a
                                href={post.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-neutral-500 hover:text-white transition duration-300 uppercase text-xs tracking-[0.2em] self-start"
                              >
                                Read More
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {visiblePosts < sortedPosts.length && (
                      <div className="flex justify-center mt-8 sm:mt-10">
                        <motion.button
                          type="button"
                          onClick={() => setVisiblePosts((n) => n + 3)}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          className="rounded-full border border-neutral-700 px-6 py-2.5 text-xs sm:text-sm uppercase tracking-[0.15em] text-neutral-200 hover:bg-neutral-800 transition"
                        >
                          View More
                        </motion.button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Contact */}
      <footer id="contact" className="py-16 sm:py-24 px-5 sm:px-6 md:px-20 border-t border-neutral-900 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between gap-12 sm:gap-16">
          <Reveal>
            <h2 className="text-[2.6rem] sm:text-[4rem] md:text-[6rem] font-['Impact'] leading-[0.9] uppercase mb-6">
              LET'S
              <br />
              CONNECT.
            </h2>
            <p className="text-neutral-400 max-w-xl text-base sm:text-lg leading-8">
              Open for freelance projects, Internships, collaborations and Full time occupancies.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="flex flex-col gap-6 lg:text-right text-sm uppercase tracking-[0.15em]">
            <a
              href={`tel:${data.footer.phone.replace(/[^\d+]/g, "")}`}
              className="hover:-translate-y-1 transition duration-300 inline-block"
            >
              {data.footer.phone}
            </a>
            <a
              href={`mailto:${data.footer.email}`}
              className="hover:-translate-y-1 transition duration-300 lowercase inline-block"
            >
              {data.footer.email}
            </a>

            <div className="flex flex-wrap lg:justify-end gap-3 sm:gap-4 pt-2">
              {[
                { href: data.footer.github, label: "GitHub" },
                { href: data.footer.linkedin, label: "LinkedIn" },
                { href: data.footer.instagram, label: "Instagram" },
                { href: data.footer.resume, label: "Resume" },
              ]
                .filter((btn) => btn.href)
                .map((btn) => (
                <motion.a
                  key={btn.label}
                  href={btn.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="border border-white bg-white text-black px-3.5 py-1.5 sm:px-5 sm:py-2.5 uppercase tracking-[0.1em] sm:tracking-[0.15em] text-[10px] sm:text-xs rounded-md hover:bg-transparent hover:text-white transition duration-300"
                >
                  {btn.label}
                </motion.a>
              ))}
            </div>
          </Reveal>
        </div>

        <p className="max-w-6xl mx-auto mt-16 pt-6 border-t border-neutral-900 text-[10px] uppercase tracking-[0.2em] text-neutral-700">
          © {new Date().getFullYear()} Atharva Goim
        </p>
      </footer>
    </motion.div>
  );
}
