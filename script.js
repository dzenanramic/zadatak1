class ImageTextSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Get elements from light DOM (inside this element)
    this.toggleButton = this.querySelector(".image-text__toggle");
    this.textContentElement = this.querySelector(".image-text__paragraph"); // Renamed to avoid confusion with the textContent property
    this.toggleText = this.querySelector(".image-text__toggle-text");

    this.isExpanded = false;

    if (this.toggleButton) {
      this.toggleButton.addEventListener("click", () => this.toggleContent());
    }

    this.setupObserver();
  }

  toggleContent() {
    this.isExpanded = !this.isExpanded;

    // Toggle classes
    this.textContentElement?.classList.toggle(
      "image-text__paragraph--expanded",
      this.isExpanded
    );
    this.toggleButton?.classList.toggle(
      "image-text__toggle--expanded",
      this.isExpanded
    );

    // Update text
    if (this.toggleText) {
      this.toggleText.textContent = this.isExpanded ? "Show less" : "Read more";
    }

    // Handle paragraph duplication
    if (this.isExpanded) {
      // Clone the paragraph and insert it after the original
      const clonedParagraph = this.textContentElement.cloneNode(true);
      this.textContentElement.parentNode.insertBefore(
        clonedParagraph,
        this.textContentElement.nextSibling
      );
    } else {
      // Remove the duplicated paragraph (assuming it's the immediate next sibling)
      const nextSibling = this.textContentElement.nextSibling;
      if (
        nextSibling &&
        nextSibling.classList &&
        nextSibling.classList.contains("image-text__paragraph")
      ) {
        this.textContentElement.parentNode.removeChild(nextSibling);
      }
    }
  }

  setupObserver() {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.classList.add("revealed");
        } else {
          this.classList.remove("revealed");
        }
      });
    }, options);

    observer.observe(this);
  }
}

// Register the custom element
customElements.define("image-text-section", ImageTextSection);
