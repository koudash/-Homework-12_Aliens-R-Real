# Homework-14_Aliens-R-Real
<h3><strong>WEBPAGE DESCRIPTION</strong></h3><br/>"
<p><strong>Warning</strong>: This webpage is the only proved-to-be-safe port on earth that connects database of the eye-witness reports for
the extra-terrestrial (ET). Right in the middle of the webpage there is a dark color box with two dropdown menu in it. That's where we set 
up the filter to call for specific reports from the database. Currently, we provide "datetime", "country", "state", "city", and "shape" filters
to choose from. All you need to do is to go to the "filter" dropdown menu and choose one; then do the same thing on the right to select 
the filter value. Want to set up multiple filters? No problem. Just click the green "Add Filter" button and a new layer of box will be created
for you. As I mentioned, there are five filters available. So you can only have five layers of filters created at most. Once reaching the 
threshold, the button will be disabled. Encountered an early disabled "Add Filter" button? That is because all five filters for your selected
data are the same. Try altering your filters or simply delete one layer of filter, the "Add Filter" button will possibly be enabled again. Yes,
the red "Delete Filter" button on the right of each layer is designated to delete all elements in the specific layer (including itself). One
more thing I would like to mention is that you can not delete the last layer of filter. It just can not let you do it. A pop up alert will be
activated in that scenario. Last thing: where is the data? You won't be able to see it unless you hit the "Submit" button disguised at bottom right 
corner of the box. It is safer than any encryption method as we all believe that ETs are color-blinded for sky blue and white. All right, 
enjoy your searching!</p><br/>


<h3><strong>DESIGN OF THE WEBPAGE</strong></h3><br/>
<ul>Six event listeners were employed to maintain the data retrival process in the webpage:<br/>

<li>"mousedown" listener targeting "filter" dropdown menu</li>
<p>     -- to generate "filter" list for display</p>
<li>"change" listener targeting "filter" dropdown menu</li>
<p>     -- to select filter in "filter" box and generate "unique values of filter for display in "filter value" box</p>
<li>"change" listener targeting "filter value" dropdown menu</li>
<p>     -- to select filter value in "fliter value" box</p>
<li>"click" listener targeting "Delete Filter" button</li>
<p>     -- to delete filter name and value as well the "Delete Filter" button itself on the same form layer</p>
<li>"click" listener targeting "Add Filter" button</li>
<p>     -- to create another layer of box for "filter" and "filter value"</p>
<li>"click" listener targeting "Submit" button</li>
<p>     -- to retrieve available data matching the filter and value info</p>
</ul><br/>


<H3><strong>NOTES</strong></H3>

<ol>
<li> Except "Submit" listener and "Delete Filter" itself, all other listeners need to be updated to grab newly appended target element. 
However, passing d3.selection to globally defined variable does not work</li>
<li> The "mousedown" event is called twice rather than once if clicking on the box without selecting any fliter, causing an unexpected
filter display of having one filter name twice and in short for anther filter.HAVE NOT BEEN ADDRESSED YET.
</ol>
