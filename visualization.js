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
        { text: "There are many different forms of renewable energy! Popular examples include wind, solar, and hydro, but there are lesser known examples such as geothermal and biomass. Having a combination of these ensures that a country has a diverse energy portfolio in case one of the energy streams fails.", position: { top: "0px", left: "0px" } },
        { text: "You may notice that there are multiple boxes with the same country/year combo. This is because there are different green energy initiatives based around the same energy type that a country does in the same year.", position: { top: "10px", left: "10px" } },
        { text: "Renewable energy sources are capable of producing massive amounts of energy. With rapid developments in the green energy sector, fossil fuels may be able to be heavily replaced across all industries.", position: { top: "100px", left: "400px" } },
        { text: "Green energy is also great for the economy. Green energy jobs are among some of the highest paid and fastest growing. Similar to the industrial revolution of the past, some feel like the next revolution will be based around renewable energy.", position: { top: "150px", left: "600px" } },
        { text: "Like any transformational project, investment is required. Though many of these values are in the billions, most of it is spent in R&D. This means that replication of developed technologies is comparatively inexpensive!", position: { top: "250px", left: "600px" } },
        { text: "In order for wide spread adoption to occur, the countries with the largest economies must pave the way. Having influential countries (e.g USA, China, India etc) adopt renewable energies signals to other countries that this is the future and encourages adoption by them as well.", position: { top: "200px", left: "800px" } },
        { text: "Now its your turn! Use the energy type buttons and slider to filter between countries and their initiatives!", position: { top: "500px", left: "800px" } },
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