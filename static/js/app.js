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

// Locate 'ul' elements
var ulTagEle = d3.select('#ul-filter-tag');
var ulValueEle = d3.select('#ul-filter-value');
var ulDelEle = d3.select('#ul-filter-del');

// Locate 'button' element for "Add Filter"
var butAddEle = d3.select('#filter-add');

// Object to store applied filter names and layers
var usedFilterInfo = {'alligator': []};

// UFO dataset
const ufoDataset = data;
// Filters used for filtering the UFO dataset
const ufoFilterArr = ['datetime', 'city', 'state', 'country', 'shape'];
// names used for different filter layers in html form area
const filterLayerArr = ['alligator', 'bison', 'cougar', 'coyote', 'raccoon'];
// Keys of UFO data
const tableCol = ['datetime', 'city', 'state', 'country', 'shape', 'durationMinutes', 'comments'];

// Event listeners whose selection need to be updated once new elements are appended by javascript
// Function before "Add Filter" button is clicked
// Counterparts inside "add filter event listener" take over the work after "Add Filter" button is clicked
formDisplayAvailFilters();
formSelectFilterName();
formSelectFilterValue();
butDelFilter();

// >>>>>>>>>>>>>>>    EVENT LISTENER    >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>  BUTTON: ADD FILTER  >>>>>>>>>>>>>>>
butAddEle.on("click", function() {

    // Prevent the webpage from self-refreshing
    d3.event.preventDefault();

    // Retrieve array containing filter layer info
    let currApplLayerArr = Object.keys(usedFilterInfo);
    // Determine array of currently available filter layer names
    // Note that since "Add Filter" button is active, there should be layer name(s) available
    let currAvailLayerArr = filterLayerArr.filter((layer) => !currApplLayerArr.includes(layer));  
    // Assign the first name of the above array as new layer name and update object of applied filter info
    let newLayer = currAvailLayerArr.shift();
    usedFilterInfo[newLayer] = [];    

    // Generate 'id' for new 'li' and 'select' in all forms
    let newLiTagId = basicLiTag + newLayer;
    let newLiValueId = basicLiValue + newLayer;
    let newLiDelId = basicLiDel + newLayer;
    let newSelTagId = basicSelTag + newLayer;
    let newSelValueId = basicSelValue + newLayer;
    let newBtnDelId = basicBtnDel + newLayer;

    // Append new 'li' element to 'ulTagEle', 'ulValueEle', and 'ulDelEle' with 'class' and 'id', respectively
    let newLiTagEle = ulTagEle.append('li').attr('class', 'list-group-item form-control-lg my-5').attr('id', `${newLiTagId}`);
    let newLiValueEle = ulValueEle.append('li').attr('class', 'list-group-item form-control-lg my-5').attr('id', `${newLiValueId}`);
    let newLiDelEle = ulDelEle.append('li').attr('class', 'list-group-item form-control-lg my-5 px-0').attr('id', `${newLiDelId}`);
    // Append new 'label' element to new 'li' in all forms, respectively
    newLiTagEle.append('label').attr('for', `${newSelTagId}`).text("Filter");
    newLiValueEle.append('label').attr('for', `${newSelValueId}`).text("Filter value");
    newLiDelEle.append('br');
    // Append new 'button' element to new 'li' with 'id', 'type', and 'class'
    newLiDelEle.append('button').attr('id', `${newBtnDelId}`).attr('type', 'submit').attr('class', 'btn btn-filter-del btn-outline-danger font-weight-bold').text("Delete Filter");
    // Append new 'select' element to new 'li' with 'class' and 'id', respectively
    let newSelTagEle = newLiTagEle.append('select').attr('class', 'sel-filter-tag').attr('id', `${newSelTagId}`);
    let newSelValueEle = newLiValueEle.append('select').attr('class', 'sel-filter-value').attr('id', `${newSelValueId}`);
    // Append new 'option' element to new 'select' in the first two forms and set as placeholder for dropdown menu in both forms, respectively
    newSelTagEle.append('option').attr('value', 'placeholder').attr('selected', true).attr('disabled', true).attr('hidden', true).text("Select a filter");
    newSelValueEle.append('option').attr('value', 'placeholder').attr('selected', true).attr('disabled', true).attr('hidden', true).text("Choose a filter from left");
    
    // Check if there are more than 5 filters
    // Note that "currAvailLayerArr" is updated by ".shift()"
    if (currAvailLayerArr.length !== 0) {
        // Enable "Add Filter" button if true
        butAddEle.attr('disabled', null);
        // Disable "Add Filter" button if false
    } else {
        butAddEle.attr('disabled', true);
    }

    // VERY IMPORTANT: EVENT LISTENERS NEED TO BE UPDATED TO GRAB NEWLY APPENDED 'SELECT' ELEMENTS OR 'DELETE FILTER' BUTTON ONCE NEW FILTER IS ADDED
    // Note that passing d3.selectAll('.sel-filter-tag') to globally defined variable does not work
    formDisplayAvailFilters();
    formSelectFilterName();
    formSelectFilterValue();
    butDelFilter();
});

// >>>>>>>>>>>>>>>    EVENT LISTENER    >>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>    BUTTON: SUBMIT    >>>>>>>>>>>>>>>
d3.select('#filter-submit').on('click', function() {

    // Prevent the webpage from self-refreshing
    d3.event.preventDefault();

    // Locate "tbody" element
    let tbody = d3.select('tbody');

    // Clear contents in 'tbody' element
    tbody.html("");
    // Display filtered data in table
    availFilteredUfoDataset().forEach((d) => {
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

    // New array to store unique values of given filter
    let newArray =[];
    // Push unique values of given filter to "newArray"
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
function availFilteredUfoDataset() {

    // Retrieve array containing each unavailable (applied) filter tags w/o values
    let usedFilterArr = Object.values(usedFilterInfo);
    // Narrow down array to contain each available filter tags and values
    let usedFilterNameAndValueArr = usedFilterArr.filter((ele) => ele.length === 2);
    // Set initial current available ufo dataset array as "ufoDataset"
    let currAvailUfoDataset = ufoDataset;
    // Retrieve array containing currently availalbe ufo dataset
    if (usedFilterNameAndValueArr.length > 0) {
        for (let i=0; i<usedFilterNameAndValueArr.length; i++) {
            currAvailUfoDataset = currAvailUfoDataset.filter((d) => d[usedFilterNameAndValueArr[i][0]] === usedFilterNameAndValueArr[i][1]);
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
    let usedFilterArr = Object.values(usedFilterInfo);    
    // Retrieve array containing currently applied filter tags
    let currUnavailFilter = usedFilterArr.map((ele) => ele[0]);
    // Determine currently available filter tags
    let currAvailFilter = ufoFilterArr.filter((ele) => !currUnavailFilter.includes(ele));
    // Return array containing currently available filters as callback value
    return currAvailFilter;

}

// .......... FUNCTION 4 ..........
/**
 * Return boolean with "true" for no more filter can be applied and "false" the opposite
 */
function applyMoreFilter() {

    // Remove "durationMinutes" and "comments" from available filtered UFO dataset
    let truncDataset = availFilteredUfoDataset().forEach((d) => {
        delete d.durationMinutes;
        delete d.comments;
    });
    
    // Check if all data in truncated available UFO dataset are the same
    if (truncDataset.filter((d) => d !== truncDataset[0]).length === 0) {
        // If all data are the same, return false
        return false;
    } else {
        // If not all data are the same, return true (applying new filter is possible)
        return true;
    }

}


// ** ********************************************************************************************//
//      FUNCTION FOR EVENT LISTENER -- 'select' element -- filter name form -- "mousedown"        //
// ********************************************************************************************* *//
/**
 * Display array of available filters as dropdown list in "filter name" form
 */
function formDisplayAvailFilters() {
 
    d3.selectAll('.sel-filter-tag').on("mousedown", function() {     
 
        // . ............... Event validation and info retrival ............... .//
        // Retrieve form layer of fired event
        let eventLayer = this.id.split('-')[3];
        // Retrieve form text of fired event
        let eventText = this.value;
        // Validate firing of "mousedown" event
        console.log(`Event "mousedown" fired: text of "${eventText}" and "${eventLayer}" layer in the form are retrieved.`);

        // . ............... Application of retrival info ............... .//
        // Update object of used filter to remove data for current form layer if exists
        // if (Object.keys(usedFilterInfo).includes(eventLayer)) {
        //     usedFilterInfo[eventLayer] = undefined;
        // } <==== This does not work as removed info for thie layer will immediately be added back by "formSelectFilterName()"
        
        // Determine array of available filters
        let availFilterArr = getCurrAvailFilter();
        // // Add pre-existing filter name to array of available filters because we want it also to be selectable
        // if (eventText !== 'placeholder') {
        //     availFilterArr.push(eventText);
        // }

        // Grab 'select' element for current form layer
        let eventSelTagId = basicSelTag + eventLayer;
        let eventSelTagEle = d3.select(`#${eventSelTagId}`);

        // Remove all pre-existing 'option' element
        eventSelTagEle.selectAll('option').remove();

        // Put back pre-existing displayed 'option' element because we want it also to be selectable
        if (eventText !== 'placeholder') {
            eventSelTagEle.append('option').attr('value', eventText).text(eventText);
        }
        // Append available filters to 'option' element for display in dropdown menu
        availFilterArr.forEach((filter) => {
            eventSelTagEle.append('option').attr('value', filter).text(filter);             
        });
        // THE APPENDING ORDER IS VERY IMPORTANT. PRE-EXISTING FILTER SHOULD BE APPENDED FIRSTLY AND INDIVIDUALLY
        // PUTTING IT BACK TO AVAILABLE FILTER ARRAY TO BE APPENDED TOGETHER WILL OTHERWISE RENDER A SWITCH BY SHOWING THE FIRST FILTER NAME IN ALPHABETICAL ORDER, WHICH MESSED UP THE ENTIRE LIST

    });

}

// ** ********************************************************************************************//
//        FUNCTION FOR EVENT LISTENER -- 'select' element -- filter name form -- "change"         //
// ********************************************************************************************* *//
/**
 * Select filter in "filter name" form and generate array of filter values as dropdown list in "filter value" form
 */
function formSelectFilterName() {

    d3.selectAll('.sel-filter-tag').on("change", function() {     

        // . ............... Event validation and info retrival ............... .//
        // Retrieve form layer of fired event
        let eventLayer = this.id.split('-')[3];
        // Retrieve form text of fired event
        let eventText = this.value;
        // Validate firing of "change" event
        console.log(`Event (tag) "change" fired: filter name of "${eventText}" and "${eventLayer}" layer in the form are retrieved.`);
        
        // . ............... Application of retrival info ............... .//
        // Update object of used filter with current form layer as well as name of applied filter
        // Note that data of current layer has just been removed by "formDisplayAvailFilters()"
        usedFilterInfo[eventLayer] = [eventText];

        // Determine array of unique values for selected filter
        let availUniqueFilterValueArr = uniqueFilterValue(eventText, availFilteredUfoDataset());

        // Grab 'select' element on the same layer but from "filter value" form
        let eventSelValueId = basicSelValue + eventLayer;
        let eventSelValueEle = d3.select(`#${eventSelValueId}`);
        // Determine 'class' name for 'option' element added by javascript within the above 'select' element        
        let eventOptValueClass = basicOptValue + eventLayer;
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
//        FUNCTION FOR EVENT LISTENER -- 'select' element -- filter value form -- "change"        //
// ********************************************************************************************* *//
/**
 * Select filter value in "filter value" form
 */
function formSelectFilterValue() {

    d3.selectAll('.sel-filter-value').on("change", function() {     

        // . ............... Event validation and info retrival ............... .//
        // Retrieve form layer of fired event
        let eventLayer = this.id.split('-')[3];
        // Retrieve form text of fired event
        let eventText = this.value;
        // Validate firing of "change" event
        console.log(`Event (value) "change" fired: filter value of "${eventText}" and "${eventLayer}" layer in the form are retrieved.`);

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
        if (Object.keys(usedFilterInfo).length !== 5) {
            // Only execute the following codes when not all filters are applied in filtering UFO dataset
            if (availFilteredUfoDataset().length === 1) {
                // Disable "Add Filter" button if true
                butAddEle.attr('disabled', true);
            } else {
                // Enable "Add Filter" button if false
                butAddEle.attr('disabled', null);
            }
        }

    });

}


// ** ********************************************************************************************//
//          FUNCTION FOR EVENT LISTENER -- 'button' element -- "Delete Filter" -- "click"         //
// ********************************************************************************************* *//

/**
 * Delete filter name and value as well as the "Delete Filter" button itself on the same form layer
 */
function butDelFilter() {

    d3.selectAll('.btn-filter-del').on("click", function() {
        
        // Check if more than one filter has been applied (only one form layer on webpage)
        if(Object.keys(usedFilterInfo).length < 2) {
            // Pop up alert window and give info that the only form layer can not be deleted
            alert("NOT AN OPTION WITH ONLY ONE FILTER LAYER IN THE FORM !!!");
        // Fire the event listener if there are more than one form layers on webpage
        } else {

            // Prevent the webpage from self-refreshing
            d3.event.preventDefault();

            // Retrieve form layer of fired event
            let eventLayer = this.id.split('-')[3];

            // Determine 'id' names for 'li' elements in the same layer
            let eventLiTagId = basicLiTag + eventLayer;
            let eventLiValueId = basicLiValue + eventLayer;
            let eventLiDelId = basicLiDel + eventLayer;
            // Remove 'li' elements
            d3.select(`#${eventLiTagId}`).remove();    
            d3.select(`#${eventLiValueId}`).remove();    
            d3.select(`#${eventLiDelId}`).remove();
            
            // Update object of used filter by removing data for current form layer 
            delete usedFilterInfo[eventLayer];

            // Enable "Add Filter" button if filter applying is possible
            if (applyMoreFilter) {
                butAddEle.attr('disabled', null);
            }
        }

    });
    
}