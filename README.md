# Bhagavad Gita Ancient Book Simulator

A beautifully crafted, highly realistic web application that simulates reading the Bhagavad Gita as a physical, two-page spread ancient book. Built purely with Vanilla HTML, CSS, and JavaScript.

## Features
- **Authentic Two-Page Layout:** A perfectly symmetrical design with a realistic center spine and stylized paper edges.
- **3D Page Flips:** Fully integrated 3D CSS animations to physically simulate the lifting and turning of hardcover book leaves. 
- **Comprehensive Database:** Contains all 700 verses of the Bhagavad Gita natively parsed from local JSON.
- **Dynamic Navigation:** 
  - An interactive *Index* on the right leaf.
  - An interactive *Subchapter map* listing every verse directly on the left leaf.
- **Bilingual Translations:** Side-by-side Hindi and English translations coupled with the original Sanskrit Shlokas.
- **Mobile Responsive:** Intelligently collapses the two-page 3D spread into a seamless, scrollable reading interface for smaller devices.

## Project Structure
- `index.html`: The core framework utilizing symmetrical flex-grids.
- `css/style.css`: The styling engine containing the 3D page flip `@keyframes`, variables, and layout scaling.
- `js/script.js`: State management script responsible for dynamically swapping the Home Mode (Index) into the Reading Mode (Verses) efficiently.
- `images/`: Stores the custom leather `cover.png` and the immersive reading background `desk_bg.png`. 
- `data.json`: The standalone database of all 700 verses.

## Usage
Simply clone the repository and open `index.html` in any modern web browser. No complex build steps or dependencies required.
