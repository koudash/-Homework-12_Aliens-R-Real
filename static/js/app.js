// Variables on current layer of filter
var basicLiTagId = 'filter-li-tag-';
var basicLiTagValueId = 'filter-li-tag-value-';
var basicSelTagId = 'filter-sel-tag-';
var basicSelTagValueId = 'filter-sel-tag-value-';
var basicOptTagClass = 'filter-opt-tag-';
var basicOptTagValueClass = 'filter-opt-tag-value-';

var ulTag = d3.select('#filters-tag');
var ulTagValue = d3.select('#filters-tag-value');

var currLayer = 1;

var currLiTagId = basicLiTagId + currLayer.toString();
var currLiTagValueId = basicLiTagValueId + currLayer.toString();
var currSelTagId = basicSelTagId + currLayer.toString();
var currSelTagValueId = basicSelTagValueId + currLayer.toString();
var currOptTagClass = basicOptTagClass + currLayer.toString();
var currOptTagValueClass = basicOptTagValueClass + currLayer.toString();

var currAvailDataset = data;
// Array to store filter tags
var currAvailFilter = ['datetime', 'city', 'state', 'country', 'shape'];
// Array to store tag names for ufo dataset
const datasetTag = ['datetime', 'city', 'state', 'country', 'shape', 'durationMinutes', 'comments'];



// Locate current "select" element for filter tags
var currSelTag = d3.select(`#${currSelTagId}`);
// Locate current "select" element for available filter tag values
var currSelTagValue = d3.select(`#${currSelTagValueId}`);


// Event handler for "currSelTag"
currSelTag.on('change', function () {

    // Retrieve selected filter tag
    var currFilter = this.value;

    // Reset/Clear array for current available tag values
    var currAvailTagValue = [];

    // Clear the dropdown menu for pre-existing filter tag values if any
    d3.selectAll(`.${currOptTagValueClass}`).remove();

    // Generate array of unique filter values
    currAvailTagValue = uniqueFilterValue(currFilter, currAvailDataset);

    // Change text in "Filter value" box once filter tag has been selected on the left
    currSelTagValue.select('option').text('Select a value');

    // Display unique filtered tag value in dropdown menu
    currAvailTagValue.forEach((myValue) => {
        // Append "option" to "select"
        let opt = currSelTagValue.append('option');
        // Attribute "value" to "option"
        opt.attr('value', myValue).text(myValue);
        // Attribute "class" to "option" to facilitate removal
        opt.attr('class', `${currOptTagValueClass}`);
    });
});

// Event handler for "currSelTagValue"
currSelTagValue.on('change', function () {
    
    // Retrieve selected filter tag
    var currFilterValue = this.value;

    // Reset "currAvailDataset" everytime event on the left fires
    currAvailDataset = data;
    
    // Update "currAvailDataset" based on selected filter tag value
    currAvailDataset = currAvailDataset.filter((myData) => Object.values(myData).includes(currFilterValue));
});


// Select the "Submit" button
var submit = d3.select('#filter-submit');

// Event handler for "Submit" button
submit.on('click', function() {

    // Prevent the webpage from self-refreshing
    d3.event.preventDefault();

    // Locate "tbody"
    let tbody = d3.select('tbody');

    // Clear previous "tr" with the class of 'tr-data'
    d3.selectAll('.tr-data').remove();

    // Display filtered data
    currAvailDataset.forEach((myData) => {
        // Append "tr" to "tbody", assigning 'class' value to facilitate removal 
        let tr = tbody.append('tr').attr('class', 'tr-data');
        // Append "td" with filtered data to "tr"
        datasetTag.forEach((tag) => {
            tr.append('td').text(myData[tag]);
        });
    });   
});    





/**
 * Returns array of unique values of the key in array of objects
 * @param {*} myKey Key in objects from the array
 * @param {*} myArrayOfObjects Dataset with array of objects structure
 */
function uniqueFilterValue(myKey, myArrayOfObjects) {
    let newArray =[];
    for (let i=0; i<myArrayOfObjects.length; i++) {
        if (!newArray.includes(myArrayOfObjects[i][myKey])) {
            newArray.push(myArrayOfObjects[i][myKey]);
        }
    }
    return newArray;
}
