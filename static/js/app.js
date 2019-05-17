// from data.js
const tableData = data;

// Select the "Filter Table" button
var submit = d3.select('#filter-btn');

submit.on('click', function() {

    // Prevent the webpage from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    let inputElement = d3.select('#datetime');

    // Get the value property of the input element
    // With 'date/time' being set as filter, change input type as 'date' to unify user input
    let inputValue = dateFormater(inputElement.property('value'));

    // // Check 'inputValue'
    // console.log(inputValue);

    // Retrieve data that meets the filting criteria
    let filteredData = tableData.filter((record) => record.datetime === inputValue);
    
    // // check 'filteredData'
    // console.log(filteredData);

    // Save detailed data correspondingly in designated arrays
    let dates = filteredData.map((record) => record.datetime);
    let cities = filteredData.map((record) => record.city);
    let states = filteredData.map((record) => record.state);
    let cntries = filteredData.map((record) => record.country);
    let shapes = filteredData.map((record) => record.shape);
    let durMins = filteredData.map((record) => record.durationMinutes);
    let comments = filteredData.map((record) => record.comments);

    // Locate 'tbody'
    let tbody = d3.select('tbody');

    for (let i=0; i<filteredData.length; i++) {
        tr = tbody.append('tr');
        tr.append('td').text(dates[i]);
        tr.append('td').text(cities[i]);
        tr.append('td').text(states[i]);
        tr.append('td').text(cntries[i]);
        tr.append('td').text(shapes[i]);
        tr.append('td').text(durMins[i]);
        tr.append('td').text(comments[i]);        
    }

});

/**
 * Input: in 'yyyy-mm-dd' format  
 * Output: in 'm/d/yyyy' format 
 * @param {string} date 
 */
function dateFormater(date) {
    // Divide date into array of ['m', 'd', 'yyyy']
    let dateArray = date.split('-');
    // Remove '0' in tens from month and date digits whose value is less than 10 
    for (let i=1; i<3; i++) {
        dateArray[i] = parseInt(dateArray[i]).toString();
    }
    // Join 'm', 'd', and 'yyyy' to make 'newDate' in 'm/d/yyyy' format
    newDate = dateArray[1] + '/' +dateArray[2] + '/' + dateArray[0];
    // Return 'newDate'
    return newDate;
}