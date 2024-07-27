// Scene 1: Global Trend in Renewable Energy Production
d3.csv('complete_renewable_energy_dataset.csv').then(data => {
    const width = 800, height = 400;
    const svg1 = d3.select("#scene1").append("svg").attr("width", width).attr("height", height);

    const nestedData = d3.rollups(data, v => d3.sum(v, d => d['Production (GWh)']), d => d.Year);
    nestedData.sort((a, b) => d3.ascending(a[0], b[0]));  // Sort by year
    const years = nestedData.map(d => d[0]);
    const production = nestedData.map(d => d[1]);

    const xScale = d3.scaleLinear().domain([d3.min(years), d3.max(years)]).range([50, width - 50]);
    const yScale = d3.scaleLinear().domain([0, d3.max(production)]).range([height - 50, 50]);

    const line = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));

    svg1.append("path")
        .datum(nestedData)
        .attr("d", line)
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("fill", "none");

    svg1.append("g")
        .attr("transform", `translate(0, ${height - 50})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg1.append("g")
        .attr("transform", `translate(50, 0)`)
        .call(d3.axisLeft(yScale));
}).catch(error => {
    console.error("Error loading data for Scene 1:", error);
});

// Scene 2: Investments in Renewable Energy
d3.csv('complete_renewable_energy_dataset.csv').then(data => {
    const width = 800, height = 400;
    const svg2 = d3.select("#scene2").append("svg").attr("width", width).attr("height", height);

    const nestedData = d3.rollups(data, v => d3.sum(v, d => d['Investments (USD)']), d => d.Year);
    nestedData.sort((a, b) => d3.ascending(a[0], b[0]));  // Sort by year
    const years = nestedData.map(d => d[0]);
    const investments = nestedData.map(d => d[1]);

    const xScale = d3.scaleBand().domain(years).range([50, width - 50]).padding(0.1);
    const yScale = d3.scaleLinear().domain([0, d3.max(investments)]).range([height - 50, 50]);

    svg2.selectAll(".bar")
        .data(nestedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d[0]))
        .attr("y", d => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - 50 - yScale(d[1]))
        .attr("fill", "orange");

    svg2.append("g")
        .attr("transform", `translate(0, ${height - 50})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg2.append("g")
        .attr("transform", `translate(50, 0)`)
        .call(d3.axisLeft(yScale));
}).catch(error => {
    console.error("Error loading data for Scene 2:", error);
});

// Scene 3: Jobs Created by Renewable Energy
d3.csv('complete_renewable_energy_dataset.csv').then(data => {
    const width = 800, height = 400;
    const svg3 = d3.select("#scene3").append("svg").attr("width", width).attr("height", height);

    const nestedData = d3.rollups(data, v => d3.sum(v, d => d['Jobs']), d => d.Country);
    nestedData.sort((a, b) => d3.ascending(a[0], b[0]));  // Sort by country
    const countries = nestedData.map(d => d[0]);
    const jobs = nestedData.map(d => d[1]);

    const xScale = d3.scaleBand().domain(countries).range([50, width - 50]).padding(0.1);
    const yScale = d3.scaleLinear().domain([0, d3.max(jobs)]).range([height - 50, 50]);

    svg3.selectAll(".bubble")
        .data(nestedData)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", d => xScale(d[0]) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d[1]))
        .attr("r", d => Math.sqrt(d[1] / 1000))
        .attr("fill", "green");

    svg3.append("g")
        .attr("transform", `translate(0, ${height - 50})`)
        .call(d3.axisBottom(xScale));

    svg3.append("g")
        .attr("transform", `translate(50, 0)`)
        .call(d3.axisLeft(yScale));
}).catch(error => {
    console.error("Error loading data for Scene 3:", error);
});
