# Homework-14_Aliens-R-Real
<h3><strong>WEBPAGE DESCRIPTION</strong></h3><br/>
<p><strong>Caution</strong>: This webpage is the only proved-to-be-safe port on earth that connects database of the eye-witness reports for the extra-terrestrial (ET). Right in the center there is a dark color box with two dropdown lists set in parallel. That's where to make calls for specific report(s) from the UFO database. You can choose from any one out of the "datetime", "country", "state", "city", and "shape" filters on the left list followed by selecting its available value from the right. Setting up multiple filters is absolutely welcomed. To do that, you just need to click the green "Add Filter" button and a new layer of filter box will be created. The more filters being added, the less in numbers the available UFO dataset is. As mentioned, there are currently five filters available; therefore, a total of five layers cound be created at most on the webpage. Once the threshold is met, the button will be unclickable. Encountered an early unclickable button? It is because all five filters for your selected data are the same. Try adjusting the selection of filter(s) and value(s) or simply delete one filter layer; the "Add Filter" button will probably be enabled again. Yes, the red "Delete Filter" button on the right of each data layer is designated to delete all elements in the specific layer (including itself). However, you can not delete the last layer of filter. A pop up alert will be activated in that scenario. Last thing: WHERE IS THE DATA? You won't be able to see it unless you click the "Submit" button disguided at bottom right corner of the box. It is actually safer than any encryption method as we all believe that ETs are color-blinded for sky blue and white. All right, enjoy your searching!</p><br/>


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
<li> Except "Submit" listener and "Add Filter" itself, all other listeners need to be updated to grab newly appended target element(s). 
However, passing d3.selection to globally defined variable does not work</li>
<li> The "mousedown" event is called twice if clicking on the box without selecting any fliter, causing an unexpected filter display that one filter name shows up twice with another filter name disappeared. HAVE NOT BEEN ADDRESSED YET. (UPDATE: addressed by adding an 'else' statement to append the "placeholder" back if not used.)
</ol>
