// >>>>>>>>>>>>>>> GLOBALLY DEFINED VARIABLES >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>            START           >>>>>>>>>>>>>>>

// Basic html element filter tag
var basicLiFilterTag = 'li-filter-tag-';
var basicLiFilterValueTag = 'li-filter-value-tag-';
var basicLiFilterDel = 'li-filter-delete-';
var basicSelFilterTag = 'sel-filter-tag-';
var basicSelFilterValueTag = 'sel-filter-value-tag-';
var basicOptFilterTag = 'opt-filter-tag-';
var basicOptFilterValueTag = 'opt-filter-value-tag-';
var basicBtnFilterDel = 'btn-filter-del-';

// Locate ul tags
var ulTag = d3.select('#ul-filter-tag');
var ulValueTag = d3.select('#ul-filter-value-tag');
var ulDel = d3.select('#ul-filter-del');

// Locate buttons
var addFilter = d3.select('#filter-add');
var delFilter = d3.select('#filter-del');
var submit = d3.select('#filter-submit');

// Number of filters applied on dataset, default value equals to 1
var maxLayer = 1;

// Object to store applied filter names and layers, empty by default
var appliedFilterInfo = {};

// Retrieve array containing filter layer info
var currAppliedLayer = Object.keys(appliedFilterInfo);

// UFO dataset
const ufoDataset = data;
// Available filters
const availFilters = ['datetime', 'city', 'state', 'country', 'shape'];
// Keys of UFO data
const tableCol = ['datetime', 'city', 'state', 'country', 'shape', 'durationMinutes', 'comments'];


// >>>>>>>>>>>>>>> EVENT LISTENER 1 >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>       START      >>>>>>>>>>>>>>>

// Event listener ("mousedown") for active 'select' element with the class name of 'sel-filter-tag'
d3.selectAll('.sel-filter-tag').on("mousedown", function() {

    // Retrieve active layer
    let activeLayer = parseInt(this.id.split('-')[3]);

    // Retrieve the name of active filter
    let activeFilter = this.value;

    // Validate "change"
    console.log(`'mousedown' event: ${activeFilter} is the currently applied filter on layer ${activeLayer}.`);

    // Generate 'id' name for current active 'select' element
    let currSelFilterId = basicSelFilterTag + activeLayer.toString();

    // Locate active 'select' element
    let currSelFilterEle = d3.select(`#${currSelFilterId}`);

    // Clear all pre-existing 'option' element
    currSelFilterEle.selectAll('option').remove();

    // Determine currently available filter tags
    let currAvailFilter = getCurrAvailFilter();

    // If there is pre-existing filter tag when "mousedown" event is fired, append that filter to "currAvailFilter" array
    if (activeFilter !== 'placeholder') {
        currAvailFilter.push(activeFilter);
    }

    // Display unique values of filtered tag in dropdown menu
    currAvailFilter.forEach((ele) => {
        currSelFilterEle.append('option').attr('value', ele).text(ele);
    });

    // Append 'option' element to 'select' and set as placeholder for dropdown menu
    currSelFilterEle.append('option').attr('value', 'placeholder').attr('selected', true).attr('disabled', true).attr('hidden', true).text("Select a filter");

});


// >>>>>>>>>>>>>>> EVENT LISTENER 2 >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>       START      >>>>>>>>>>>>>>>

// Event listener for active 'select' element with the class name of 'sel-filter-tag'
d3.selectAll('.sel-filter-tag').on("change", function() {

    // Retrieve the name of active filter
    let activeFilter = this.value;
    // Retrieve active layer
    let activeLayer = parseInt(this.id.split('-')[3]);

    // Validate "change"
    console.log(`'change' event (filter): ${activeFilter} is the currently applied filter on layer ${activeLayer}.`);
    console.log(d3.selectAll('.sel-filter-tag'));
       
    // Update name of applied filter on active layer in "appliedFilterInfo"
    appliedFilterInfo[activeLayer] = [activeFilter];
     
    // Determine currently available filtered UFO dataset
    let currAvailUfoDataset = availFilteredDataset();
        
    // Generate array of unique values for active filter
    let activeFilterUniqueValues = uniqueFilterValue(activeFilter, currAvailUfoDataset);
    
    // Get 'class' name of 'option' added by javascript under parallel 'select' element on the same filter layer
    let paralOptFilterValueClass = basicOptFilterValueTag + activeLayer.toString();
    
    // Clear pre-existing javascript-added 'option' element if any
    // Note that placeholder 'option' is not removed
    d3.selectAll(`.${paralOptFilterValueClass}`).remove();

    // Locate parallel "select" element on the same layer from "filter value" form on the right
    let paralSelFilterValueID = basicSelFilterValueTag + activeLayer.toString();
    let paralSelFilterValueEle = d3.select(`#${paralSelFilterValueID}`);    
    
    // Change text in parallel 'option' element for placeholder once filter tag has been selected on the left
    // Note that it has to be executed after removing and before appending javascript-added 'option'
    paralSelFilterValueEle.select('option').text('Select a value');
    
    // Display unique values for active filter in dropdown menu on the right
    activeFilterUniqueValues.forEach((v) => {
        // Append 'option' to 'select' and attribute 'value' to it
        let opt = paralSelFilterValueEle.append('option').attr('value', v).text(v);
        // Attribute 'class' to 'option' to facilitate target-directed removal
        opt.attr('class', `${paralOptFilterValueClass}`);
    });
    
});


// >>>>>>>>>>>>>>> EVENT LISTENER 3 >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>       START      >>>>>>>>>>>>>>>

// Event listener for active 'select' element with the class name of 'sel-filter-value-tag'
d3.selectAll('.sel-filter-value-tag').on("change", function() {

    // Retrieve the name of active filter
    let activeFilterValue = this.value;
    // Retrieve active layer
    let activeLayer = parseInt(this.id.split('-')[4]);

    // Validate "change"
    console.log(`'change event (filter value): ${activeFilterValue} is selected on current active layer ${activeLayer}.`);

    // Update value of applied filter on active layer in "appliedFilterInfo"
    if (appliedFilterInfo[activeLayer].length === 1) {
        appliedFilterInfo[activeLayer].push(activeFilterValue);
    } else {
        appliedFilterInfo[activeLayer][1] = activeFilterValue;
    }
        
    // Disable "Add Filter" button if there is no data in filtered UFO dataset
    if (maxLayer !== 5) {
        if (availFilteredDataset() === []) {
            // Disable "Add Filter" button if true
            addFilter.attr('disabled', true);
            // Enable "Add Filter" button if false
        } else {
            addFilter.attr('disabled', null);
        }
    } else {
        addFilter.attr('disabled', true); 
    }

});


// >>>>>>>>>>>>>>> EVENT LISTENER 4 >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>       START      >>>>>>>>>>>>>>>

// Event listener for 'Add Filter' button
addFilter.on("click", function() {

    // Prevent the webpage from self-refreshing
    d3.event.preventDefault();

    // Add 1 to number of applied filters
    maxLayer += 1;

    // Generate 'id' for new 'li' and 'select' in both forms
    let newLiFilterId = basicLiFilterTag + maxLayer.toString();
    let newLiFilterValueId = basicLiFilterValueTag + maxLayer.toString();
    let newLiFilterDelId = basicLiFilterDel + maxLayer.toString();
    let newSelFilterId = basicSelFilterTag + maxLayer.toString();
    let newSelFilterValueId = basicSelFilterValueTag + maxLayer.toString();
    let newBtnFilterDelId = basicBtnFilterDel + maxLayer.toString();

    // Append new 'li' element to 'ulTag', 'ulValueTag', and 'ulDel' with 'class' and 'id', respectively
    let newLiTag = ulTag.append('li').attr('class', 'list-group-item').attr('id', `${newLiFilterId}`);
    let newLiValueTag = ulValueTag.append('li').attr('class', 'list-group-item').attr('id', `${newLiFilterValueId}`);
    let newLiDel = ulDel.append('li').attr('class', 'list-group-item').attr('id', `${newLiFilterDelId}`);

    // Append new 'label' element to new 'li' in all forms, respectively
    newLiTag.append('label').attr('for', `${newSelFilterId}`).text("Filter");
    newLiValueTag.append('label').attr('for', `${newSelFilterValueId}`).text("Filter value");
    newLiDel.append('label').attr('for', `${newBtnFilterDelId}`);

    // Append new 'button' element to new 'li' with 'id', 'type', and 'class'
    newLiDel.append('button').attr('id', `${newBtnFilterDelId}`).attr('type', 'submit').attr('class', 'btn btn-filter-del btn-outline-danger font-weight-bold').text("Delete Filter");

    // Append new 'select' element to new 'li' with 'class' and 'id', respectively
    let newSelTag = newLiTag.append('select').attr('class', 'sel-filter-tag').attr('id', `${newSelFilterId}`);
    let newSelValueTag = newLiValueTag.append('select').attr('class', 'sel-filter-value-tag').attr('id', `${newSelFilterValueId}`);

    // Append new 'option' element to new 'select' in the first two forms and set as placeholder for dropdown menu in both forms, respectively
    newSelTag.append('option').attr('value', 'placeholder').attr('selected', true).attr('disabled', true).attr('hidden', true).text("Select a filter");
    newSelValueTag.append('option').attr('value', 'placeholder').attr('selected', true).attr('disabled', true).attr('hidden', true).text("Choose a filter from left");
    
    // Check if there are more than 5 filters
    if (maxLayer<5) {
        // Enable "Add Filter" button if true
        addFilter.attr('disabled', null);
        // Disable "Add Filter" button if false
    } else {
        addFilter.attr('disabled', true);
    }
    // CAN BE FOUND IF SELECT FROM THE SAME EVENT LISTENER
    console.log(`'Add Filter' event: there are ${maxLayer} layers of filters`)
    console.log(d3.selectAll('.sel-filter-tag'));
  
});


// >>>>>>>>>>>>>>> EVENT LISTENER 5 >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>       START      >>>>>>>>>>>>>>>

// Event listener for 'Delete Filter' button
delFilter.on("click", function() {

    if (maxLayer === 1) {

        alert('Not an option with only one filter layer!!!');
        
    } else {

        // Prevent the webpage from self-refreshing
        d3.event.preventDefault();

        // Retrieve active layer
        let activeLayer = parseInt(this.id.split('-')[3]);
        console.log(activeLayer)

        // Generate 'id' names for 'li' elements in the same layer
        let paralLiFilterId = basicLiFilterTag + activeLayer.toString();
        let paralLiFilterValueId = basicLiFilterValueTag + activeLayer.toString();
        let activeLiFilterDelId = basicLiFilterDel + activeLayer.toString();   

        // Remove 'li' elements
        d3.select(`#${paralLiFilterId}`).remove();    
        d3.select(`#${paralLiFilterValueId}`).remove();    
        d3.select(`#${activeLiFilterDelId}`).remove();

        // Update "appliedFilterInfo"
        appliedFilterInfo = appliedFilterInfo.filter((d) => !Object.keys.includes(d));

        // Enable "Add Filter" button if there is data in filtered UFO dataset
        if (availFilteredDataset() !== []) {
            addFilter.attr('disabled', null);
        }
    }

});


// >>>>>>>>>>>>>>> EVENT LISTENER 6 >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>       START      >>>>>>>>>>>>>>>

// Event listener for "Submit" button
submit.on('click', function() {

    // Prevent the webpage from self-refreshing
    d3.event.preventDefault();

    // Locate "tbody"
    let tbody = d3.select('tbody');

    // Clear contents in 'tbody'
    tbody.html('');

    // Determine currently available filtered UFO dataset
    let currAvailUfoDataset = availFilteredDataset();

    // Display filtered data in table
    currAvailUfoDataset.forEach((d) => {
        // Append "tr" to "tbody"
        let tr = tbody.append('tr');
        // Append "td" with filtered data to "tr"
        tableCol.forEach((tag) => {
            tr.append('td').text(d[tag]);
        });
    });
    
    // Attribute 'hidden' value to null for 'table' element to make it visible
    d3.select('table').attr('hidden', null);
});


// >>>>>>>>>>>>>>> GLOBALLY DEFINED FUNCTION >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>            START          >>>>>>>>>>>>>>>

// .......... FUNCTION 1 ..........
/**
 * Return array of unique values for the key in array of objects
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

// .......... FUNCTION 2 ..........
/**
 * Apply filters from "appliedFilterInfo" to "ufoDataset" and return currently available ufo dataset
 */
function availFilteredDataset() {

    // Retrieve array containing each unavailable (applied) filter tags w/o values
    let appliedFilterInfoArray = Object.values(appliedFilterInfo);
    // Narrow down array to contain each available filter tags and values
    let appliedFilterInfoArrayWithValue = appliedFilterInfoArray.filter((ele) => ele.length === 2);
    // Set initial current available ufo dataset array as "ufoDataset"
    let currAvailUfoDataset = ufoDataset;
    // Retrieve array containing currently availalbe ufo dataset
    if (appliedFilterInfoArrayWithValue.length > 0) {
        for (let i=0; i<appliedFilterInfoArrayWithValue.length; i++) {
            currAvailUfoDataset = currAvailUfoDataset.filter((d) => d[appliedFilterInfoArrayWithValue[i][0]] === appliedFilterInfoArrayWithValue[i][1]);
        }
    }
    // Return array containing currently availalbe ufo dataset as callback value
    return currAvailUfoDataset;
}

// .......... FUNCTION 3 ..........
/**
 * Return available filter for current "appliedFilterInfo"
 */
function getCurrAvailFilter() {
    // Retrieve array containing each unavailable (applied) filter tags w/o values
    let appliedFilterInfoArray = Object.values(appliedFilterInfo);    
    // Retrieve array containing currently applied filter tags
    let currUnavailFilter = appliedFilterInfoArray.map((ele) => ele[0]);
    // Determine currently available filter tags
    let currAvailFilter = availFilters.filter((ele) => !currUnavailFilter.includes(ele));
    // Return array containing currently available filters as callback value
    return currAvailFilter;
}