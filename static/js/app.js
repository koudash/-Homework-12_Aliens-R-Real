// >>>>>>>>>>>>>>> GLOBALLY DEFINED VARIABLES >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>            START           >>>>>>>>>>>>>>>

// Basic html element filter tag
var basicLiTag = 'li-filter-tag-';
var basicLiValue = 'li-filter-value-';
var basicLiDel = 'li-filter-del-';
var basicSelTag = 'sel-filter-tag-';
var basicSelValue = 'sel-filter-value-';
var basicOptTag = 'opt-filter-tag-';
var basicOptValue = 'opt-filter-value-';
var basicBtnDel = 'btn-filter-del-';

// Locate ul tags
var ulTag = d3.select('#ul-filter-tag');
var ulValueTag = d3.select('#ul-filter-value');
var ulDel = d3.select('#ul-filter-del');

// Locate buttons
var addFilter = d3.select('#filter-add');
var delFilter = d3.select('#filter-del');
var submit = d3.select('#filter-submit');

// Number of filters applied on dataset, default value equals to 1
var maxLayer = 1;

// Object to store applied filter names and layers, empty by default
var usedFilterInfo = {};

// Retrieve array containing filter layer info
var currAppliedLayer = Object.keys(usedFilterInfo);

// UFO dataset
const ufoDataset = data;
// Filters used for filtering the UFO dataset
const ufoFilterArr = ['datetime', 'city', 'state', 'country', 'shape'];
// Keys of UFO data
const tableCol = ['datetime', 'city', 'state', 'country', 'shape', 'durationMinutes', 'comments'];

// Event listeners for the forms
formDisplayAvailFilters();
formSelectFilterName();
formSelectFilterValue();

// >>>>>>>>>>>>>>> EVENT LISTENER 4 >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>       START      >>>>>>>>>>>>>>>

// Event listener for 'Add Filter' button
addFilter.on("click", function() {

    // Prevent the webpage from self-refreshing
    d3.event.preventDefault();

    // Add 1 to number of applied filters
    maxLayer += 1;

    // Generate 'id' for new 'li' and 'select' in both forms
    let newLiFilterId = basicLiTag + maxLayer.toString();
    let newLiFilterValueId = basicLiValue + maxLayer.toString();
    let newLiFilterDelId = basicLiDel + maxLayer.toString();
    let newSelFilterId = basicSelTag + maxLayer.toString();
    let newSelFilterValueId = basicSelValue + maxLayer.toString();
    let newBtnFilterDelId = basicBtnDel + maxLayer.toString();

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
    let newSelValueTag = newLiValueTag.append('select').attr('class', 'sel-filter-value').attr('id', `${newSelFilterValueId}`);

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
    console.log(`'Add Filter' event: d3.selection has identified ${d3.selectAll('.sel-filter-tag').size()} targeted 'select' element.`);
    formDisplayAvailFilters();
    formSelectFilterName();
    formSelectFilterValue();
});


// >>>>>>>>>>>>>>> EVENT LISTENER 5 >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>       START      >>>>>>>>>>>>>>>

// Event listener for 'Delete Filter' button
d3.select('.btn-filter-del').on("click", function() {
   
    if (maxLayer === 1) {

        alert('Not an option with only one filter layer in the form!!!');
        
    } else {

        // Prevent the webpage from self-refreshing
        d3.event.preventDefault();

        // Retrieve active layer
        let activeLayer = parseInt(this.id.split('-')[3]);
        console.log(activeLayer)

        // Generate 'id' names for 'li' elements in the same layer
        let paralLiFilterId = basicLiTag + activeLayer.toString();
        let paralLiFilterValueId = basicLiValue + activeLayer.toString();
        let activeLiFilterDelId = basicLiDel + activeLayer.toString();   

        // Remove 'li' elements
        d3.select(`#${paralLiFilterId}`).remove();    
        d3.select(`#${paralLiFilterValueId}`).remove();    
        d3.select(`#${activeLiFilterDelId}`).remove();

        // Update "usedFilterInfo"
        usedFilterInfo = usedFilterInfo.filter((d) => !Object.keys.includes(d));

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
 * Apply filters from "usedFilterInfo" to "ufoDataset" and return currently available ufo dataset
 */
function availFilteredDataset() {

    // Retrieve array containing each unavailable (applied) filter tags w/o values
    let usedFilterInfoArray = Object.values(usedFilterInfo);
    // Narrow down array to contain each available filter tags and values
    let usedFilterInfoArrayWithValue = usedFilterInfoArray.filter((ele) => ele.length === 2);
    // Set initial current available ufo dataset array as "ufoDataset"
    let currAvailUfoDataset = ufoDataset;
    // Retrieve array containing currently availalbe ufo dataset
    if (usedFilterInfoArrayWithValue.length > 0) {
        for (let i=0; i<usedFilterInfoArrayWithValue.length; i++) {
            currAvailUfoDataset = currAvailUfoDataset.filter((d) => d[usedFilterInfoArrayWithValue[i][0]] === usedFilterInfoArrayWithValue[i][1]);
        }
    }
    // Return array containing currently availalbe ufo dataset as callback value
    return currAvailUfoDataset;
}

// .......... FUNCTION 3 ..........
/**
 * Return available filter for current "usedFilterInfo"
 */
function getCurrAvailFilter() {
    // Retrieve array containing each unavailable (applied) filter tags w/o values
    let usedFilterInfoArray = Object.values(usedFilterInfo);    
    // Retrieve array containing currently applied filter tags
    let currUnavailFilter = usedFilterInfoArray.map((ele) => ele[0]);
    // Determine currently available filter tags
    let currAvailFilter = ufoFilterArr.filter((ele) => !currUnavailFilter.includes(ele));
    // Return array containing currently available filters as callback value
    return currAvailFilter;
}

// ** ********************************************************************************************//
//      FUNCTION OF EVENT LISTENER -- 'select' element -- filter name form -- "mousedown"         //
// ********************************************************************************************* *//

/**
 * Display array of available filters as dropdown list in "filter name" form
 */
function formDisplayAvailFilters() {
    
    // Event listener ("mousedown") on active 'select' element for filter name
    d3.selectAll('.sel-filter-tag').on("mousedown", function() {     

        // . ............... Event validation and info retrival ............... .//
        // Retrieve form layer of fired event
        let eventLayer = parseInt(this.id.split('-')[3]);
        // Retrieve form text of fired event
        let eventText = this.value;
        // Validate firing of "mousedown" event
        console.log(`Event "mousedown" fired: text of "${eventText}" and layer #${eventLayer} in the form are retrieved.`);

        // . ............... Application of retrival info ............... .//
        // Update object of used filter to remove data for current form layer if exists
        // if (Object.keys(usedFilterInfo).includes(eventLayer)) {
        //     usedFilterInfo[eventLayer] = undefined;
        // } <==== This does not work as removed info for thie layer will immediately be added back by "formSelectFilterName()"
        
        // Determine array of available filters
        let availFilterArr = getCurrAvailFilter();
        // Add pre-existing filter name to array of available filters because we want it also to be selectable
        if (eventText !== 'placeholder') {
            availFilterArr.push(eventText);
        }

        // Grab 'select' element for current form layer
        let eventSelTagId = basicSelTag + eventLayer.toString();
        let eventSelTagEle = d3.select(`#${eventSelTagId}`);

        // Remove all pre-existing 'option' element
        eventSelTagEle.selectAll('option').remove();
        // Append available filters to 'option' element for display in dropdown menu
        // Note that there is no need to put back placeholder 'option' element
        availFilterArr.forEach((filter) => {
            eventSelTagEle.append('option').attr('value', filter).text(filter);

        });      
    });
}

// ** ********************************************************************************************//
//        FUNCTION OF EVENT LISTENER -- 'select' element -- filter name form -- "change"          //
// ********************************************************************************************* *//

/**
 * Select filter in "filter name" form and generate array of filter values as dropdown list in "filter value" form
 */
function formSelectFilterName() {

    // Event listener ("change") on active 'select' element for filter name
    d3.selectAll('.sel-filter-tag').on("change", function() {     

        // . ............... Event validation and info retrival ............... .//
        // Retrieve form layer of fired event
        let eventLayer = parseInt(this.id.split('-')[3]);
        // Retrieve form text of fired event
        let eventText = this.value;
        // Validate firing of "change" event
        console.log(`Event (tag) "change" fired: filter name of "${eventText}" and layer #${eventLayer} in the form are retrieved.
                    d3.selection has identified ${d3.selectAll('.sel-filter-tag').size()} qualified 'select' elements.`);
        
        // . ............... Application of retrival info ............... .//
        // Update object of used filter with current form layer as well as name of applied filter
        // Note that data of current layer has just been removed by "formDisplayAvailFilters()"
        usedFilterInfo[eventLayer] = [eventText];

        // Determine array of unique values for selected filter
        let availUniqueFilterValueArr = uniqueFilterValue(eventText, availFilteredDataset());

        // Grab 'select' element on the same layer but from "filter value" form
        let eventSelValueId = basicSelValue + eventLayer.toString();
        let eventSelValueEle = d3.select(`#${eventSelValueId}`);
        // Determine 'class' name for 'option' element added by javascript within the above 'select' element        
        let eventOptValueClass = basicOptValue + eventLayer.toString();
        // Remove all pre-existing javascript-added 'option' element if any
        // Note that placeholder 'option' element is not removed
        eventSelValueEle.selectAll(`.${eventOptValueClass}`).remove();

        // Change text of placeholder 'option' element once filter tag has been determined in "filter name" form on the left
        // Note that it has to be executed after removing and before appending 'option' elements by javascript
        eventSelValueEle.select('option').text("Select a value");        
        // Append available filter values to 'option' element for display in dropdown menu
        availUniqueFilterValueArr.forEach((filterValue) => {
            eventSelValueEle.append('option').attr('value', filterValue).attr('class', `${eventOptValueClass}`).text(filterValue);

        });     
    });
}

// ** ********************************************************************************************//
//        FUNCTION OF EVENT LISTENER -- 'select' element -- filter value form -- "change"         //
// ********************************************************************************************* *//

/**
 * Select filter value in "filter value" form
 */
function formSelectFilterValue() {
    
    // Event listener ("change") on active 'select' element for filter name
    d3.selectAll('.sel-filter-value').on("change", function() {     

        // . ............... Event validation and info retrival ............... .//
        // Retrieve form layer of fired event
        let eventLayer = parseInt(this.id.split('-')[3]);
        // Retrieve form text of fired event
        let eventText = this.value;
        // Validate firing of "change" event
        console.log(`Event (value) "change" fired: filter value of "${eventText}" and layer #${eventLayer} in the form are retrieved.
                    d3.selection has identified ${d3.selectAll('.sel-filter-tag').size()} qualified 'select' elements.`);

        // . ............... Application of retrival info ............... .//
        // Update object of used filter with filter value for current form layer
        // Check if there is pre-existing filter value in the form
        if (usedFilterInfo[eventLayer].length === 2) {
            // If true, change filter value in object of used filter
            usedFilterInfo[eventLayer][1] = eventText;
        } else {
            // If false, add filter value in object of used filter
            usedFilterInfo[eventLayer].push(eventText);
        }
        
        // Disable "Add Filter" button if selecting current filter value results in only one filtered UFO dataset
        if (maxLayer !== 5) {
            // Only execute the following codes when not all filters are applied in filtering UFO dataset
            if (availFilteredDataset().length === 1) {
                // Disable "Add Filter" button if true
                addFilter.attr('disabled', true);
            } else {
                // Enable "Add Filter" button if false
                addFilter.attr('disabled', null);
            }
        }

    });
}