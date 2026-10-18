import { useEffect, useMemo, useRef, useState } from "react";
import { posts, snapshotDate, type Post } from "./data/posts";
import { FrogMark, Icon } from "./icons";

type Category = "All posts" | "Building" | "Community" | "Ideas";
type Sort = "top" | "newest" | "discussion";
const categories: Category[] = ["All posts", "Building", "Community", "Ideas"];
const xSearch = "https://x.com/search?q=IdentityMD&f=top";
const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const date = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const fullDate = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeZone: "UTC",
});
const storageKey = "the-pond:saved:v1";
const snapshotLabel = fullDate.format(new Date(snapshotDate));

function readSaved(): string[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(storageKey) || "[]",
    );
    return Array.isArray(stored)
      ? stored.filter(
          (id): id is string =>
            typeof id === "string" && posts.some((post) => post.id === id),
        )
      : [];
  } catch {
    return [];
  }
}

function TweetCard({
  post,
  saved,
  onSave,
  onShare,
  onTag,
}: {
  post: Post;
  saved: boolean;
  onSave: (id: string) => void;
  onShare: (post: Post) => void;
  onTag: (tag: string) => void;
}) {
  return (
    <article
      className="tweet-card"
      aria-label={`Post by ${post.author}`}
      data-post-id={post.id}
    >
      <div className="card-meta">
        <span className={`category category-${post.category.toLowerCase()}`}>
          <Icon
            name={
              post.category === "Building"
                ? "code"
                : post.category === "Ideas"
                  ? "spark"
                  : "message"
            }
            size={14}
          />
          {post.category}
        </span>
        {post.rank === 1 && (
          <span className="top-pick">
            <Icon name="bolt" size={13} /> Most liked
          </span>
        )}
      </div>
      <div className="author-row">
        <a
          className="author-link"
          href={`https://x.com/${post.handle}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`${post.author} on X (opens in a new tab)`}
        >
          <img
            className="avatar"
            src={post.avatar}
            alt=""
            width="40"
            height="40"
            loading="lazy"
          />
          <span className="author-text">
            <strong>{post.author}</strong>
            <span>@{post.handle}</span>
          </span>
        </a>
        <button
          className={`icon-button save-button ${saved ? "is-saved" : ""}`}
          onClick={() => onSave(post.id)}
          aria-label={`${saved ? "Unsave" : "Save"} post by ${post.author}`}
          aria-pressed={saved}
        >
          <Icon name="bookmark" size={19} />
        </button>
      </div>
      <p className="post-summary">{post.summary}</p>
      <div className="post-tags">
        {post.tags.map((tag) => (
          <button key={tag} className="text-tag" onClick={() => onTag(tag)}>
            #{tag.replace(/\s/g, "")}
          </button>
        ))}
      </div>
      <div className="post-details">
        <time dateTime={post.date} title={fullDate.format(new Date(post.date))}>
          {date.format(new Date(post.date))},{" "}
          {new Date(post.date).getUTCFullYear()}
        </time>
        <span>Post summary</span>
      </div>
      <div className="card-bottom">
        <div className="engagement" aria-label="Captured engagement">
          <span title={`${post.likes.toLocaleString()} likes`}>
            <Icon name="heart" size={16} />
            <span>
              {compact.format(post.likes)}
              <span className="sr-only"> likes</span>
            </span>
          </span>
          <span title={`${post.reposts.toLocaleString()} reposts`}>
            <Icon name="repeat" size={16} />
            <span>
              {compact.format(post.reposts)}
              <span className="sr-only"> reposts</span>
            </span>
          </span>
          <span title={`${post.replies.toLocaleString()} replies`}>
            <Icon name="message" size={16} />
            <span>
              {compact.format(post.replies)}
              <span className="sr-only"> replies</span>
            </span>
          </span>
        </div>
        <a
          className="post-link"
          href={post.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Read post by ${post.author} on X (opens in a new tab)`}
        >
          View post <Icon name="diagonal" size={14} />
        </a>
        <button
          className="icon-button share-button"
          onClick={() => onShare(post)}
          aria-label={`Copy link to post by ${post.author}`}
          title="Copy post link"
        >
          <Icon name="share" size={16} />
        </button>
      </div>
    </article>
  );
}

export default function App() {
  const [saved, setSaved] = useState<string[]>(readSaved);
  const [savedView, setSavedView] = useState(window.location.hash === "#saved");
  const [category, setCategory] = useState<Category>("All posts");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("top");
  const [limit, setLimit] = useState(4);
  const [notice, setNotice] = useState("");
  const [persistent, setPersistent] = useState(true);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copyFallback, setCopyFallback] = useState("");

  useEffect(() => {
    if (copyFallback) document.getElementById("copy-link")?.focus();
  }, [copyFallback]);

  useEffect(() => {
    const onHash = () => {
      setSavedView(window.location.hash === "#saved");
      setLimit(4);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const filtered = useMemo(
    () =>
      posts
        .filter(
          (post) =>
            (!savedView || saved.includes(post.id)) &&
            (category === "All posts" || post.category === category) &&
            `${post.author} ${post.handle} ${post.summary} ${post.tags.join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase().trim()),
        )
        .sort((a, b) =>
          sort === "newest"
            ? Date.parse(b.date) - Date.parse(a.date)
            : sort === "discussion"
              ? b.replies - a.replies
              : b.likes - a.likes,
        ),
    [savedView, saved, category, query, sort],
  );

  function toggleSave(id: string) {
    const isSaved = saved.includes(id);
    const next = isSaved ? saved.filter((item) => item !== id) : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setPersistent(false);
    }
    setNotice(
      isSaved
        ? "Post removed from saved posts."
        : "Post saved. Find it in Saved.",
    );
  }

  async function share(post: Post) {
    try {
      await navigator.clipboard.writeText(post.url);
      setNotice(`Link to ${post.author}’s post copied.`);
    } catch {
      setCopyFallback(post.url);
      document.getElementById("copy-link")?.focus();
      setNotice("Copy the link from the Post link field.");
    }
  }

  function resetFilters() {
    setCategory("All posts");
    setQuery("");
    setLimit(4);
  }
  function chooseTag(tag: string) {
    setQuery(tag);
    setCategory("All posts");
    setLimit(4);
    document.getElementById("feed")?.scrollIntoView({ block: "start" });
  }
  function goExplore() {
    setSavedView(false);
    resetFilters();
  }
  const topicCounts = ["IdentityMD", "AI agents", "Community"].map((tag) => ({
    tag,
    count: posts.filter((post) =>
      `${post.author} ${post.handle} ${post.summary} ${post.tags.join(" ")}`
        .toLowerCase()
        .includes(tag.toLowerCase()),
    ).length,
  }));
  const authors = [...new Set(posts.map((post) => post.handle))];

  return (
    <>
      <a className="skip-link" href="#feed">
        Skip to tweets
      </a>
      <header className="site-header page-width">
        <a
          className="brand"
          href="#"
          onClick={goExplore}
          aria-label="The Pond home"
        >
          <FrogMark />
          <span>
            the pond<span className="brand-dot">.</span>
          </span>
          <span className="brand-divider" />
          <span className="brand-context">IdentityMD, in focus</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a
            href="#feed"
            className={!savedView ? "nav-link active" : "nav-link"}
            onClick={goExplore}
            aria-current={!savedView ? "page" : undefined}
          >
            <Icon name="grid" size={17} />
            <span>Explore</span>
          </a>
          <a
            href="#saved"
            className={savedView ? "nav-link active" : "nav-link"}
            onClick={() => {
              setSavedView(true);
              resetFilters();
            }}
            aria-current={savedView ? "page" : undefined}
          >
            <Icon name="bookmark" size={17} />
            <span>Saved</span>
            {saved.length > 0 && (
              <span className="saved-count">{saved.length}</span>
            )}
          </a>
          <button
            className="nav-link about-nav"
            onClick={() => dialogRef.current?.showModal()}
          >
            About
          </button>
        </nav>
        <a
          className="x-header-link"
          aria-label="Join the conversation about IdentityMD on X (opens in a new tab)"
          href={xSearch}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="x" size={16} />
          <span>Join the conversation</span>
          <Icon name="diagonal" size={15} />
        </a>
      </header>

      <main className="page-width">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <h1 id="hero-title">
              Find the signal.
              <br />
              <span>Enter the pond.</span>
            </h1>
            <p>
              The best of IdentityMD on X.
              <br className="desktop-break" /> Big ideas, bold builders, and
              AI-armed frogs.
            </p>
            <a className="primary-button" href="#feed" onClick={goExplore}>
              Explore top tweets <Icon name="arrow" size={18} />
            </a>
            <div className="hero-footnote">
              <span className="tiny-dot" /> Handpicked for curious minds.
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="radar-ring ring-one" />
            <div className="radar-ring ring-two" />
            <span className="art-cross cross-one">+</span>
            <span className="art-cross cross-two">+</span>
            <img
              src="./art/ai-pepe.webp"
              alt=""
              width="1050"
              height="1124"
              fetchPriority="high"
            />
            <span className="equipment-tag">
              <Icon name="spark" size={14} /> AI equipped
            </span>
          </div>
          <span className="hero-corner" aria-hidden="true">
            <Icon name="spark" size={22} />
          </span>
        </section>

        <div className="collection-bar">
          <div>
            <span className="collection-icon">
              <Icon name="spark" size={15} />
            </span>
            <span>The IdentityMD conversation, curated.</span>
          </div>
          <button
            aria-label="About this curated collection"
            onClick={() => dialogRef.current?.showModal()}
          >
            <span>Curated collection</span> <Icon name="info" size={14} />
          </button>
        </div>

        <div className="content-layout">
          <section
            className="feed-section"
            id="feed"
            tabIndex={-1}
            aria-labelledby="feed-title"
          >
            <span id="saved" className="anchor-target" />
            <div className="feed-heading">
              <div>
                <h2 id="feed-title">
                  {savedView ? "Saved tweets" : "Top tweets"}
                  <span className="heading-dot">.</span>
                </h2>
                <p>
                  {savedView
                    ? "The signals you kept for later."
                    : "The posts worth a closer look."}
                </p>
              </div>
              <span className="post-count">
                {filtered.length} {filtered.length === 1 ? "post" : "posts"}
              </span>
            </div>
            <div className="feed-toolbar">
              <label className="search-field" htmlFor="search">
                <Icon name="search" size={18} />
                <span className="search-label">Search</span>
                <input
                  id="search"
                  type="search"
                  name="search"
                  value={query}
                  placeholder="Posts, people, topics…"
                  autoComplete="off"
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setLimit(4);
                  }}
                />
                {query && (
                  <button
                    className="clear-search"
                    type="button"
                    onClick={() => {
                      setQuery("");
                      document.getElementById("search")?.focus();
                    }}
                    aria-label="Clear search"
                  >
                    <Icon name="close" size={16} />
                  </button>
                )}
              </label>
              <label className="sort-field" htmlFor="sort">
                <span className="sr-only">Sort posts</span>
                <select
                  id="sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as Sort)}
                >
                  <option value="top">Most liked</option>
                  <option value="newest">Newest first</option>
                  <option value="discussion">Most discussed</option>
                </select>
                <Icon name="down" size={15} />
              </label>
            </div>
            <div
              className="filter-row"
              role="group"
              aria-label="Filter by category"
            >
              {categories.map((item) => (
                <button
                  key={item}
                  className={`filter-button ${category === item ? "selected" : ""}`}
                  aria-pressed={category === item}
                  onClick={() => {
                    setCategory(item);
                    setLimit(4);
                  }}
                >
                  {item === "All posts" && <Icon name="grid" size={14} />}{" "}
                  {item}
                </button>
              ))}
            </div>
            <p className="sr-only" role="status">
              {filtered.length}{" "}
              {filtered.length === 1 ? "post matches" : "posts match"}
              {query.trim() ? ` “${query.trim()}”` : ""}
              {category !== "All posts" ? ` in ${category}` : ""}.
            </p>
            {!persistent && (
              <p className="storage-note">
                <Icon name="info" size={16} /> Browser storage is unavailable.
                Saved posts last until you close this page.
              </p>
            )}
            {copyFallback && (
              <div className="copy-fallback">
                <label htmlFor="copy-link">Post link</label>
                <input
                  id="copy-link"
                  readOnly
                  value={copyFallback}
                  onFocus={(event) => event.target.select()}
                />
                <button
                  className="icon-button"
                  aria-label="Dismiss post link"
                  onClick={() => setCopyFallback("")}
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            )}
            {filtered.length > 0 ? (
              <div className="tweet-grid">
                {filtered.slice(0, limit).map((post) => (
                  <TweetCard
                    key={post.id}
                    post={post}
                    saved={saved.includes(post.id)}
                    onSave={toggleSave}
                    onShare={share}
                    onTag={chooseTag}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <Icon
                    name={savedView && !saved.length ? "bookmark" : "search"}
                    size={28}
                  />
                </div>
                <h3>
                  {savedView && !saved.length
                    ? "Keep a little signal."
                    : "No posts in this corner."}
                </h3>
                <p>
                  {savedView && !saved.length
                    ? "Save a post with the bookmark button. It will be waiting here when you return."
                    : `No posts match${query ? ` “${query.trim()}”` : " these filters"}. Try another search or clear the filters.`}
                </p>
                {savedView && !saved.length ? (
                  <a
                    className="secondary-button"
                    href="#feed"
                    onClick={goExplore}
                  >
                    Explore top tweets <Icon name="arrow" size={16} />
                  </a>
                ) : (
                  <button className="secondary-button" onClick={resetFilters}>
                    Clear filters <Icon name="close" size={16} />
                  </button>
                )}
              </div>
            )}
            {filtered.length > limit ? (
              <button
                className="load-more secondary-button"
                onClick={() => setLimit((previous) => previous + 4)}
              >
                Show {Math.min(4, filtered.length - limit)} more posts{" "}
                <Icon name="down" size={16} />
              </button>
            ) : (
              filtered.length > 0 && (
                <div className="end-of-feed">
                  <FrogMark />
                  <span>You’ve caught up with the pond.</span>
                  <a href={xSearch} target="_blank" rel="noreferrer">
                    Explore more on X <Icon name="diagonal" size={13} />
                  </a>
                </div>
              )
            )}
            <p className="snapshot-note">
              Post summaries, with engagement captured {snapshotLabel}.
              <br />A curated snapshot, not a live or exhaustive ranking.
            </p>
          </section>

          <aside className="sidebar" aria-label="Around the pond">
            <section className="pond-note">
              <div className="note-icon">
                <FrogMark />
                <Icon name="spark" size={16} />
              </div>
              <h2>
                Small pond.
                <br />
                Big intelligence.
              </h2>
              <p>
                A front-row seat to the people and agents building IdentityMD in
                the open.
              </p>
              <div className="pond-stats">
                <div>
                  <strong>{posts.length.toString().padStart(2, "0")}</strong>
                  <span>curated posts</span>
                </div>
                <div>
                  <strong>{authors.length.toString().padStart(2, "0")}</strong>
                  <span>voices in the pond</span>
                </div>
              </div>
              <button
                className="note-link"
                onClick={() => dialogRef.current?.showModal()}
              >
                How this feed works <Icon name="arrow" size={15} />
              </button>
            </section>
            <section className="topic-section">
              <h2>
                In the conversation <Icon name="message" size={17} />
              </h2>
              <div className="topic-list">
                {topicCounts.map(({ tag, count }, index) => (
                  <button
                    key={tag}
                    onClick={() => chooseTag(tag)}
                    className="topic-button"
                  >
                    <span className="topic-index">0{index + 1}</span>
                    <span>
                      <strong>{tag}</strong>
                      <small>
                        {count} {count === 1 ? "post" : "posts"} in this
                        collection
                      </small>
                    </span>
                    <Icon name="diagonal" size={16} />
                  </button>
                ))}
              </div>
            </section>
            <section className="join-note">
              <div className="join-spark">
                <Icon name="spark" size={23} />
              </div>
              <h2>Add your signal.</h2>
              <p>
                Building something with IdentityMD?
                <br />
                The pond wants to hear about it.
              </p>
              <a
                href="https://x.com/intent/post?text=Here%E2%80%99s%20what%20I%E2%80%99m%20building%20with%20IdentityMD%3A%20"
                target="_blank"
                rel="noreferrer"
              >
                Post on X <Icon name="diagonal" size={15} />
              </a>
            </section>
            <div className="sidebar-signoff">
              <span className="tiny-dot" /> Stay curious, anon.
            </div>
          </aside>
        </div>
      </main>

      <footer className="site-footer page-width">
        <a className="footer-brand" href="#" onClick={goExplore}>
          <FrogMark />
          <span>the pond.</span>
        </a>
        <p>An independent window into IdentityMD.</p>
        <button onClick={() => dialogRef.current?.showModal()}>
          About & sources <Icon name="diagonal" size={13} />
        </button>
      </footer>
      <div className="sr-only" role="status">
        {notice}
      </div>
      <div className={`notice ${notice ? "visible" : ""}`}>
        <Icon name="check" size={17} />
        <span>{notice}</span>
        {notice && (
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
      <dialog
        className="about-dialog"
        ref={dialogRef}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            "button, a[href], input, select, textarea",
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        aria-labelledby="about-title"
      >
        <div className="dialog-top">
          <FrogMark />
          <button
            className="icon-button"
            autoFocus
            onClick={() => dialogRef.current?.close()}
            aria-label="Close about the pond"
          >
            <Icon name="close" />
          </button>
        </div>
        <h2 id="about-title">A little context.</h2>
        <p>
          The Pond is an independent collection of public posts about
          IdentityMD, a network for people and AI agents building software.
        </p>
        <h3>What makes a top tweet?</h3>
        <p>
          We selected {posts.length} relevant posts from {authors.length}{" "}
          voices, then ranked this collection by captured likes. “Newest first”
          uses post dates; “Most discussed” uses captured replies.
        </p>
        <h3>A snapshot, with sources.</h3>
        <p>
          Post text is summarized, not quoted. Engagement was captured on{" "}
          {snapshotLabel} through the public FxTwitter mirror. Counts may have
          changed. Each card links to its original post on X, which may require
          sign-in.
        </p>
        <h3>Your saved posts stay here.</h3>
        <p>
          Bookmarks are stored in this browser. They don’t sync between devices.
          The site doesn’t connect to your X account or post on your behalf.
        </p>
        <div className="dialog-links">
          <a
            href="https://github.com/Identity-md/worker"
            target="_blank"
            rel="noreferrer"
          >
            IdentityMD on GitHub <Icon name="diagonal" size={14} />
          </a>
          <a href="./sources.json" target="_blank" rel="noreferrer">
            View collection sources <Icon name="diagonal" size={14} />
          </a>
        </div>
      </dialog>
    </>
  );
}
