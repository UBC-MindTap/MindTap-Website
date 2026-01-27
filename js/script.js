document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("active");
    });
  }

// const form = document.getElementById("contact-form");

// form.addEventListener("submit", function(e) {
//   e.preventDefault(); // stop the default form submission

//   const name = document.getElementById("name").value;
//   const email = document.getElementById("email").value;
//   const message = document.getElementById("message").value;

//   const subject = encodeURIComponent("MindTap Website Inquiry");
//   const body = encodeURIComponent(
//     `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
//   );

//   window.location.href = `mailto:krupajrav@gmail.com?subject=${subject}&body=${body}`;
// });


  document.documentElement.classList.remove("no-js");
});
