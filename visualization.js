d3.csv('complete_renewable_energy_dataset.csv').then(data => {
    const energyTypes = Array.from(new Set(data.map(d => d['Energy Type'])));
    const years = Array.from(new Set(data.map(d => +d['Year']))).sort((a, b) => a - b); // Ensure years are numbers
    const minYear = d3.min(years);
    const maxYear = d3.max(years);

    // Variables to keep track of selected energy type and year
    let selectedEnergyType = energyTypes[0];
    let selectedYear = minYear;

    // Annotations data
    const annotations = [
        { text: "Annotation 1: Description goes here.", position: { top: "10px", left: "10px" } },
        { text: "Annotation 2: Description goes here.", position: { top: "50px", left: "200px" } },
        { text: "Annotation 3: Description goes here.", position: { top: "100px", left: "400px" } },
        { text: "Annotation 4: Description goes here.", position: { top: "150px", left: "600px" } },
        { text: "Annotation 5: Description goes here.", position: { top: "200px", left: "800px" } },
    ];
    let currentAnnotationIndex = 0;

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
        
        const formatBillion = d3.format(".3f");

        filteredData.forEach(d => {
            const box = boxesDiv.append("div").attr("class", "box");
            box.append("h3").text(`${d['Country']} (${d['Year']})`);
            box.append("p").text(`Energy Type: ${d['Energy Type']}`);
            box.append("p").text(`Production: ${d['Production (GWh)']} GWh`);
            box.append("p").text(`Installed Capacity: ${d['Installed Capacity (MW)']} MW`);
            const investmentBillions = d['Investments (USD)'] / 1e9;
            box.append("p").text(`Investments: $${formatBillion(investmentBillions)} billion`);
            box.append("p").text(`Jobs: ${d[' Jobs']}`);
        });
    }

    // Initial call to display boxes
    updateBoxes();
    // Set the initial selected button
    d3.select(`#btn-${selectedEnergyType}`).classed("selected", true);

    // Function to update annotation text and position
    function updateAnnotation() {
        const annotation = annotations[currentAnnotationIndex];
        d3.select("#annotation-text").text(annotation.text);
        d3.select("#annotation")
            .style("top", annotation.position.top)
            .style("left", annotation.position.left);
    }

    // Set up annotation navigation
    d3.select("#prev-annotation").on("click", () => {
        if (currentAnnotationIndex > 0) {
            currentAnnotationIndex--;
            updateAnnotation();
        }
    });

    d3.select("#next-annotation").on("click", () => {
        if (currentAnnotationIndex < annotations.length - 1) {
            currentAnnotationIndex++;
            updateAnnotation();
        }
    });

    // Initial call to display the first annotation
    updateAnnotation();

}).catch(error => {
    console.error("Error loading data:", error);
});
