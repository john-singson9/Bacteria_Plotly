function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  var metadataurl = `metadata/${sample}`;
  d3.json(metadataurl).then(function(data) {
    console.log(data);
    // Use d3 to select the panel with id of `#sample-metadata`
    var paneldata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    paneldata.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    
    Object.entries(data).forEach(function([key, value]) {
        paneldata.append('tbody').text(`${key}: ${value}`);
      });
    });

   
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  var url = `/samples/${sample}`;
  d3.json(url).then(function(response) {
    console.log(response);

    // var sorted = response.sort((first, second) => second - first);
    
    var trace1 = {
      labels: response.otu_ids.slice(0,10),
      values: response.sample_values.slice(0,10),
      type: "pie",
      hoverinfo: response.otu_labels
    };

    var data1 = [trace1];

    var layout = {
      title: "Bacteria Samples",
      showlegend: false,
      height: 600
    }

    var trace2 = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: "markers",
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      }, 
      text: response.otu_labels
    };

    var data2 = [trace2];

    var layout2 = {
      title: "Bubble Chart for Bacteria",
      showlegend: false,
      height: 600
    }

    Plotly.newPlot("pie", data1, layout);
    Plotly.newPlot("bubble", data2, layout2);
  });
 
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
