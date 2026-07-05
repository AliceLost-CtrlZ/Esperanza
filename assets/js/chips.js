const chipNav = document.querySelector(".chips");
chipNav.addEventListener("click", (event) => {
    if (!event.target.classList.contains("chip")) {
        return;
    }
    const sectionId = event.target.dataset.target;  // fetch

    document.querySelectorAll(".menu-section").forEach(section => {  // find old - in this case, find all
        section.classList.remove("active");                          // deactivate 
    });
    const newSection = document.querySelector("#" + sectionId);      // find new
    newSection.classList.add("active");                              // activate

    document.querySelectorAll(".chip").forEach(chip => {            // find all, strip active
        chip.classList.remove("active");
    });

    event.target.classList.add("active");                          // no query selector, we already know the target from the click
});
