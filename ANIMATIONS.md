# How Animations Differ: Framer Motion vs Plain CSS

This doc shows how the same effects are implemented **with Framer Motion (React)** in this Next.js version vs **plain CSS** in the original static site.

---

## 1. **Page load / hero entrance**

### Plain CSS
- No built-in “entrance” animation. You’d add it with CSS keyframes and/or classes toggled by JS:

```css
.hero-title {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.5s ease forwards;
}
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
```

- Staggering children (title, then subtitle, then CTA) usually means separate `animation-delay` values or JS adding classes with delays.

### Framer Motion
- Declarative `initial` / `animate` with **staggered children** via `variants` and `staggerChildren`:

```tsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

<motion.div variants={container} initial="hidden" animate="visible">
  <motion.p variants={item}>Dynamic Web Magic with Next.js</motion.p>
  <motion.h1 variants={item}>Transforming Concepts...</motion.h1>
  ...
</motion.div>
```

- No keyframes or manual delays: Framer handles the sequence from the variant tree.

---

## 2. **Scroll-in: “grow” when card enters viewport**

### Plain CSS
- You need **JavaScript** (e.g. `IntersectionObserver`) to add/remove a class when the element is in view:

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { rootMargin: '-40px', threshold: 0.1 });
cards.forEach((card) => observer.observe(card));
```

```css
.experience-card.scroll-animate {
  transform: scale(0.96);
  opacity: 0.9;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
}
.experience-card.scroll-animate.in-view {
  transform: scale(1);
  opacity: 1;
}
```

- Scroll state is manual; timing uses a custom cubic-bezier to mimic “spring”.

### Framer Motion
- **No observer code.** Use `whileInView` and optional `viewport`:

```tsx
const cardVariants = {
  offscreen: { scale: 0.96, opacity: 0.9 },
  onscreen: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

<motion.article
  variants={cardVariants}
  initial="offscreen"
  whileInView="onscreen"
  viewport={{ once: true, margin: '-40px' }}
>
  ...
</motion.article>
```

- “In view” is built in; spring is a first-class transition type.

---

## 3. **Button hover: scale + arrow slide**

### Plain CSS
- Separate rules for button scale and arrow translate; group hover for the arrow:

```css
.btn-animate {
  transition: transform 0.25s ease, box-shadow 0.25s ease, ...;
}
.btn-animate:hover { transform: scale(1.02); }
.btn-animate:active { transform: scale(0.98); }

.btn-arrow { transition: transform 0.25s ease; }
.group:hover .btn-arrow { transform: translateX(4px); }
```

- You choose easing (e.g. `ease`); no real “spring” unless you define a custom curve.

### Framer Motion
- **Gesture-driven** with spring:

```tsx
<motion.span
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
>
  See my work
  <motion.span
    initial={false}
    whileHover={{ x: 4 }}
    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
  >
    →
  </motion.span>
</motion.span>
```

- Hover and tap are declarative; spring is one config object.

---

## 4. **Card hover scale**

### Plain CSS
- Single hover rule:

```css
.experience-card:hover { transform: scale(1.02); }
```

### Framer Motion
- Same idea, but with spring and optional layout/transition control:

```tsx
<motion.article
  whileHover={{ scale: 1.02 }}
  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
>
```

- Easy to add `whileTap`, different springs per element, or layout animations later.

---

## 5. **Summary table**

| Effect              | Plain CSS (+ JS)                    | Framer Motion (React)                    |
|---------------------|-------------------------------------|------------------------------------------|
| Entrance stagger    | Keyframes + delays or JS classes   | `variants` + `staggerChildren`           |
| Scroll-in “grow”    | IntersectionObserver + CSS class   | `whileInView` + `viewport`               |
| Button scale/tap    | `:hover` / `:active` + transition  | `whileHover` / `whileTap` + spring      |
| Arrow on hover      | `.group:hover .btn-arrow`          | Nested `motion.span` with `whileHover`   |
| Spring feel        | cubic-bezier or keyframes           | `type: 'spring', stiffness, damping`     |
| “In view” logic     | Your own observer                  | Built-in `whileInView`                  |

---

## When to use which

- **Plain CSS**: No JS framework, minimal bundle, simple hover/transition. You write the observer and class toggles for scroll.
- **Framer Motion**: React/Next apps where you want declarative scroll and gesture animations, springs, and less boilerplate. Slightly larger bundle, much more power for sequences and layout animation.

This Next.js version uses Framer Motion for all of the above so the site looks the same while showing the Framer-based approach.
