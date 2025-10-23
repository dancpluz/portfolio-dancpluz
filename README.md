<p align="center">
  <picture>
    <img src="public/dodecahedron.webp" width="30%" >
  </picture>
</p>

## 📚 About

This is my personal portfolio project, a web application designed to showcase my work and skills in a professional manner. The goal is to create a central hub for my projects, share testimonials, and demonstrate my knowledge of modern front-end technologies.

The site was built with **Next.js** for a fast and optimized experience, **TypeScript** to ensure code robustness, and **Tailwind CSS** for agile and flexible interface development. To manage the portfolio data, I used **PocketBase**, an open-source database that I hosted on a local server. This gave me full control over the data without needing a third-party service.

This project is a starting point for my new portfolio, with plans to be expanded and improved in the future.

## 📌 Features

- **Content Sections:** A clear structure with dedicated sections for projects, testimonials, and an "about" page.
- **Hero Banner:** A prominent area for an impactful introduction.
- **Fluid Animations:** The use of `.webp` animations to add a touch of dynamism to the interface.
- **Optimized Loading:** Implementation of a `loading state` to improve the perceived performance.

## 🛠 Built With

<p align="left">
  <img src="https://skillicons.dev/icons?i=nextjs,ts,tailwind,vercel" />
</p>

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/Database:** PocketBase
- **Deploy:** Vercel

## 👨‍💻 How to Run

This project uses **PocketBase** for data storage, so you need to have a local instance of PocketBase running for the application to work correctly.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dancpluz/portfolio-dancpluz.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd portfolio-dancpluz
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the local Next.js server:**
    ```bash
    npm run dev
    ```
5.  **Start your local PocketBase instance:**
    ```bash
    ./pocketbase serve
    ```

The application will be accessible at `http://localhost:3000`.

## 👥 Group / Author(s)

This project was developed by:

- **Daniel Luz** — [GitHub](https://github.com/dancpluz)

## 🤝 Contributions / Acknowledgements

This project was a personal initiative focused on continuous improvement and consolidating my web development knowledge.

## 📄 License

<a href="https://opensource.org/licenses/MIT"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>

This project is licensed under the **MIT License**.

## 🚀 Future Plans / WIP

This portfolio is a work in progress and will be completely rebuilt in the future, with a focus on transitioning from the `.webp`-based animations to a richer, more interactive 3D experience using **Three.js**.

<details>
  <summary>Click to view the task list and backlog</summary>
  
<p align="center">
  <img src="public/cone.webp" width="15%" />
  <img src="public/dodecahedron.webp" width="15%" />
  <img src="public/prism.webp" width="15%" />
</p>

- [x] Header
- [x] Hero Banner Section
- [x] Projects Section
- [x] Testimonials Section
- [x] About Section
- [x] Loading State
- [x] Organize Code
- [ ] Section to explain my brand
- [ ] Photos Page
- [ ] Convert to Server Components/remove React Query
- [ ] Fix marquee
- [ ] Make more responsive
- [ ] Add Entry/Exit Animations
- [ ] Create Contact Form
</details>
