d3.csv('complete_renewable_energy_dataset.csv').then(data => {
    const energyTypes = Array.from(new Set(data.map(d => d['Energy Type'])));
    const years = Array.from(new Set(data.map(d => +d['Year']))).sort((a, b) => a - b); 
    const minYear = d3.min(years);
    const maxYear = d3.max(years);

    let selectedEnergyType = energyTypes[0];
    let selectedYear = minYear;
    let selectedMetric = 'Production (GWh)';

    const annotations = [
        { text: "There are many different forms of renewable energy! Popular examples include wind, solar, and hydro, but there are lesser known examples such as geothermal and biomass. Having a combination of these ensures that a country has a diverse energy portfolio in case one of the energy streams fails.",  position: { top: "-800px", left: "60px" } },
        { text: "You may notice that there are multiple boxes with the same country/year combo. This is because there are different green energy initiatives based around the same energy type that a country does in the same year.", position: { top: "-900px", left: "60px"} },
        { text: "Renewable energy sources are capable of producing massive amounts of energy. With rapid developments in the green energy sector, fossil fuels may be able to be heavily replaced across all industries.", position: { top: "-700px", left: "60px" } },
        { text: "Green energy is also great for the economy. Green energy jobs are among some of the highest paid and fastest growing. Similar to the industrial revolution of the past, some feel like the next revolution will be based around renewable energy.", position: { top: "-600px", left: "60px" } },
        { text: "Like any transformational project, investment is required. Though many of these values are in the billions, most of it is spent in R&D. This means that replication of developed technologies is comparatively inexpensive!", position: { top: "-500px", left: "60px"} },
        { text: "In order for wide spread adoption to occur, the countries with the largest economies must pave the way. Having influential countries (e.g USA, China, India etc) adopt renewable energies signals to other countries that this is the future and encourages adoption by them as well.", position: { top: "-900px", left: "60px" } },
        { text: "Now its your turn! Use the energy type buttons and slider to filter between countries, years, and their initiatives!", position: { top: "-1100px", left: "60px" } },
    ];
    let currentAnnotationIndex = 0;

    const buttonsDiv = d3.select("#buttons");
    buttonsDiv.selectAll("*").remove(); 
    energyTypes.forEach(type => {
        buttonsDiv.append("button")
            .text(type)
            .attr("id", `btn-${type}`)
            .on("click", function() {
                selectedEnergyType = type;
                d3.selectAll("#buttons button")
                    .classed("selected", false)
                    .style("font-weight", "normal")
                    .style("background-color", "");
                d3.select(this)
                    .classed("selected", true)
                    .style("font-weight", "bold")
                    .style("background-color", "lightgreen");
                updateBoxes();
                updateBarGraph();
            });
    });

    const yearSlider = d3.select("#year-slider")
        .attr("min", minYear)
        .attr("max", maxYear)
        .attr("value", minYear)
        .on("input", function() {
            selectedYear = +this.value;
            d3.select("#year-value").text(selectedYear);
            updateBoxes();
            updateBarGraph();
        });

    d3.select("#year-value").text(minYear);

    const barControlsDiv = d3.select("#bar-controls");
    barControlsDiv.selectAll("*").remove(); 
    const metrics = {
        'btn-production': 'Production (GWh)',
        'btn-installed-capacity': 'Installed Capacity (MW)',
        'btn-investment': 'Investments (USD)'
    };
    Object.entries(metrics).forEach(([id, metric]) => {
        barControlsDiv.append("button")
            .text(metric.split(' ')[0])
            .attr("id", id)
            .on("click", function() {
                selectedMetric = metric;
                d3.selectAll("#bar-controls button")
                    .classed("selected", false)
                    .style("font-weight", "normal")
                    .style("background-color", "");
                d3.select(this)
                    .classed("selected", true)
                    .style("font-weight", "bold")
                    .style("background-color", "lightgreen");
                updateBarGraph();
            });
    });

    function updateBoxes() {
        const filteredData = data.filter(d => d['Energy Type'] === selectedEnergyType && +d['Year'] === selectedYear);
        
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


    updateBoxes();
    d3.select(`#btn-${selectedEnergyType}`)
        .classed("selected", true)
        .style("font-weight", "bold")
        .style("background-color", "lightgreen");
    d3.select("#btn-production")
        .classed("selected", true)
        .style("font-weight", "bold")
        .style("background-color", "lightgreen");

    function updateAnnotation() {
        if (currentAnnotationIndex < annotations.length) {
            const annotation = annotations[currentAnnotationIndex];
            d3.select("#annotation-text").text(annotation.text);
            d3.select("#annotation")
                .style("top", annotation.position.top)
                .style("left", annotation.position.left)
                .style("display", "block");
        } else {
            d3.select("#annotation").style("display", "none");
        }
    }

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
        } else {
            currentAnnotationIndex++;
            updateAnnotation();
            d3.select("#annotation").style("display", "none");
        }
    });

    updateAnnotation();
    function updateBarGraph() {
        const filteredData = data.filter(d => d['Energy Type'] === selectedEnergyType && +d['Year'] === selectedYear);

        const barGraphDiv = d3.select("#bar-graph");
        barGraphDiv.selectAll("*").remove(); 

        const margin = { top: 20, right: 30, bottom: 120, left: 90 };
        const width = 1000 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = barGraphDiv.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1)
            .domain(filteredData.map((d, i) => `${d['Country']} (${d['Year']}) - ${i}`));

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(filteredData, d => +d[selectedMetric])]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(filteredData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d, i) => x(`${d['Country']} (${d['Year']}) - ${i}`))
            .attr("y", d => y(+d[selectedMetric]))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(+d[selectedMetric]))
            .attr("fill", "steelblue");

 
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 50)  
            .text("Country (Year)");


        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(selectedMetric);
    }


    updateBarGraph();
}).catch(error => {
    console.error("Error loading data:", error);
});

