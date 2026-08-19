function initReveal(root = document) {
    const nodes = Array.from(root.querySelectorAll(".reveal")).filter((node) => !node.classList.contains("is-visible"));
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        nodes.forEach((node) => node.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    nodes.forEach((node) => observer.observe(node));
}

document.addEventListener("DOMContentLoaded", () => initReveal());
