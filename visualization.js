d3.csv('complete_renewable_energy_dataset.csv').then(data => {
    const energyTypes = Array.from(new Set(data.map(d => d['Energy Type'])));
    const years = Array.from(new Set(data.map(d => +d['Year']))).sort((a, b) => a - b); // Ensure years are numbers
    const minYear = d3.min(years);
    const maxYear = d3.max(years);

    // Variables to keep track of selected energy type and year
    let selectedEnergyType = energyTypes[0];
    let selectedYear = minYear;

    // Create buttons for each energy type
    const buttonsDiv = d3.select("#buttons");
    energyTypes.forEach(type => {
        buttonsDiv.append("button")
            .text(type)
            .attr("id", `btn-${type}`)
            .on("click", function() {
                selectedEnergyType = type;
                d3.selectAll("#buttons button").classed("selected", false);
                d3.select(this).classed("selected", true);
                updateBoxes();
            });
    });

    // Create a year slider
    const yearSlider = d3.select("#year-slider")
        .attr("min", minYear)
        .attr("max", maxYear)
        .attr("value", minYear)
        .on("input", function() {
            selectedYear = +this.value;
            d3.select("#year-value").text(selectedYear);
            updateBoxes();
        });

    // Set the initial year value display
    d3.select("#year-value").text(minYear);

    // Function to update the information boxes based on selected energy type and year
    function updateBoxes() {
        const filteredData = data.filter(d => d['Energy Type'] === selectedEnergyType && +d['Year'] === selectedYear);
        
        // Debugging: log the filtered data to the console
        console.log("Filtered Data:", filteredData);

        const boxesDiv = d3.select("#boxes");
        boxesDiv.selectAll(".box").remove();
        
        const formatMillion = d3.format(".3f");

        filteredData.forEach(d => {
            const box = boxesDiv.append("div").attr("class", "box");
            box.append("h3").text(`${d['Country']} (${d['Year']})`);
            box.append("p").text(`Energy Type: ${d['Energy Type']}`);
            box.append("p").text(`Production: ${d['Production (GWh)']} GWh`);
            box.append("p").text(`Installed Capacity: ${d['Installed Capacity (MW)']} MW`);
            const investmentMillions = d['Investments (USD)'] / 1e6;
            box.append("p").text(`Investments: $${formatMillion(investmentMillions)} million`);
            box.append("p").text(`Jobs: ${d[' Jobs']}`);
        });
    }

    // Initial call to display boxes
    updateBoxes();
    // Set the initial selected button
    d3.select(`#btn-${selectedEnergyType}`).classed("selected", true);
}).catch(error => {
    console.error("Error loading data:", error);
});
