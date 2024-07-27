d3.csv('complete_renewable_energy_dataset.csv').then(data => {
    const energyTypes = Array.from(new Set(data.map(d => d['Energy Type'])));
    const years = Array.from(new Set(data.map(d => d['Year']))).sort((a, b) => a - b);
    const minYear = d3.min(years);
    const maxYear = d3.max(years);

    // Create buttons for each energy type
    const buttonsDiv = d3.select("#buttons");
    energyTypes.forEach(type => {
        buttonsDiv.append("button")
            .text(type)
            .on("click", () => {
                console.log("Selected Energy Type:", type);
                
            });
    });

    // Create a year slider
    const yearSlider = d3.select("#year-slider")
        .attr("min", minYear)
        .attr("max", maxYear)
        .attr("value", minYear)
        .on("input", function() {
            const selectedYear = this.value;
            d3.select("#year-value").text(selectedYear);
            console.log("Selected Year:", selectedYear);

        });

    // Set the initial year value display
    d3.select("#year-value").text(minYear);



}).catch(error => {
    console.error("Error loading data:", error);
});
