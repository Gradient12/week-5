/* =====================
  Set up our map
===================== */
var map = L.map('map', {
  center: [39.9522, -75.1639],
  zoom: 14
});
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

var myMarkers = [];
/* =====================
  Lab 2, Part 1 - jQuery

  In this course, we've set our focus on HTML, CSS, & Javascript as they are useful in the construction
  of mapping applications. One thing that isn't yet clear is how to handle user input. This is difficult
  because we've got to expand our thinking to span HTML and javascript - the fields with which
  a users can interact are ultimately specified in HTML <input> elements. Luckily, we've already seen
  how CSS solves this problem (with the use of selectors) and can extend that syntax into our work
  with javascript.

  A few reminders about the basic forms of CSS selector:
  1. The simplest selector case is specification of a tag directly. The selector "p" will grab all
     <p> elements whereas "h1" will grab all <h1> elements.

  2. An HTML tag's "class" is referenced through a prefixed period. A page that has multiple movie
     div elements in which there is a title header might look like this:
     <div>
       <h4 class="movie-title"></h4>
       <div class="movie-detail"></div>
     </div>
     On this page, ".movie-title" can be used to grab all of the tags with a "movie-title" class.

  3. An HTML tag's "id" is referenced with a hashtag. The selector "#winning" will grab the element
     (element is singular here - an ID should always be unique to the DOM it sits on) where
     <tag id="winning">.
     For example:
     <div>
       <p id="winning">Charlie Sheen</p>
     </div>
     On this simple DOM, "#winning" is the <p> tag with "Charlie Sheen".

  4. CSS selectors can be combined to refine our meaning. In the movie-title example above, we can
     find all and only h4 elements with the class "movie-title" with the selector "h4.movie-title"
     which is, in english, "h4 elements with the class 'movie-title'".

  In jQuery, we use this syntax as well. It looks like this: $(*selector*); We could, for instance,
  grab all h4 movie-titles with $('h4.movie-title');

  Many of the exercises in this portion of lab 2 involve reading and writing to HTML inputs with the
  help of jQuery selectors and associated methods for querying the DOM. The method you'll use again
  and again on this lab is jQuery's `val`. With no arguments, it queries an input value. Provided
  a value as an argument, it will actually set that value in the HTML DOM.

  Example:
    Reading: $(someSelector).val();
    Writing: $(someSelector).val(valueToSet);

  Task 1: Change HTML to create useful labels for our UI
    *NOTE*: Do not edit part1-jquery.html. You should be able to change the text of an HTML element
            with jQuery alone! Try this: $(SELECTOR).text('text to set');

    Let's change the labels of our input elements so that they're meaningful. We don't want the
    page to say 'This is the first text input'. Instead we should imagine meaningful inputs and label
    accordingly. Be sure that the labels you choose make sense for the element types provided. A
    checkbox has only two states: on and off. This is useful for boolean values (e.g. isDoctor,
    hasHair). Text fields allow for more complex representations (e.g. name, address). Numeric fields
    are specialized to only allow numeric values (possible meanings include: ageInYears, pointsScored).
    The color field is specialized to use HTML5 colorpickers provided by each browser and store data
    as a string in hexadecimal color format (i.e. '#ffffff'); suitables representations include e.g.
    hairColor, markerColor.

    Try to imagine a single object that you're describing. For example, if your object is "person",
    you might want to include a name, an address, an age, a couple of boolean characteristics, and a
    favorite color. Don't spend too much time on thinking about the perfect object to represent with
    this form, anything will do.

  Task 2: Setting (writing) input values
    *NOTE*: An input's value is not the same as an HTML element's text. We use $(selector).val() as
            opposed to $(selector).text() in this case.

    Fill out the input form with some imagined values. If you chose to make the form about the
    properties of people, the name might be 'bob' and the favorite color could be green (hint: you'll
    want to get formatting exactly right to set a color field; experiment in the console to see what
    the color you'll specify should look like).

  Task 3: Getting (reading) input values
    Write the code necessary to read from your input form and return a javascript object (with keys
    to clarify the meaning of each value) that has all the data that's stored in your form.

  Task 4: Enable user interaction with the form
    At this point, we're really only using HTML input fields as a kind of storage. We create some data,
    put that data on the DOM, and read it back out. What we really want to do is interact with the
    form we've created as part of a GUI (Graphical User Interface - pronounced like 'gooey'). To do
    this, we can use another jQuery method: 'prop'.

    Here's a simple, disabled input field:
    <input id="someInput" type="number" disabled>

    You can see in this HTML that the input field is disabled. You could also see this by querying
    that property's value through jQuery:
    $('#someInput').prop('disabled');

    Setting the property's value is just slightly more involved:
    $('#someInput').prop('disabled', false); -> <input id="someInput" type="number">
    $('#someInput').prop('disabled', true);  -> <input id="someInput" type="number" disabled>

    Enable *all* fields on this form.

  Task 5: Add a button trigger to log this form's object to console
    We now can enter data through the HTML and create an object to represent that data. Add a button
    click event to the button at the bottom of your form. This means that we want to use jQuery to
    bind your input-reading function (what you did in task 3) to the button's 'click' event.
    Here's the documentation for click: https://api.jquery.com/click/

    Keep in mind that events are asynchronous, just like ajax. The function you bind is not called
    until the event on which it is bound is triggered.

  Task 6: Plot input data to the map on button click
    Modify this form to include at least a lat (number), long (number), description (text), and
    color (color) inputs. With these inputs you should be able to plot a circle marker
    (http://leafletjs.com/reference.html#circlemarker) to the lat/long on the form, with the color
    provided, and a bound popup which gives you the description.

  // STRETCH GOALS
  Task 7: Use default values - OPTIONAL
    We don't want the application to crash if our user fails to enter values for every field. Add
    whatever logic is necessary to set default values if a field is empty.

  Task 8: Try Leaflet's divIcon
    Instead of using a default leaflet marker or a circleMarker, try using a L.divIcon. A div icon
    is just an HTML <div> element on which CSS can be applied (HINT: background-color or
    background-image are necessary if you want to see the icon). When you've successfully implemented
    a divIcon, you should be able to grab it by reference to its class: 'leaflet-marker-icon'. So,
    in jQuery, $('.leaflet-marker-icon').

  Task 9: Make a parametric function (make it accept parameters/arguments) to fill the form out
    At this point, we have an object which corresponds to a (at least partially) filled out form.
    That being so, we should be able to write a function that accepts, as an argument,
    one of those objects and properly fills out the form to match the values of that object. Try to
    update the code below so that an object entered into your form-filling function is stored on the
    HTML and fully reconstituted by the code you've written to read from the form.

    Use `_.isEqual` to make sure the object you feed in is the same as the one you read back out.
===================== */

var form = {};

var UpdateForm = function(){
  form = {
    title : $('#text-input1').val(),
    name : $('#text-input2').val(),
    address : $('#text-input3').val(),
    age : $('#numeric-input').val(),
    married : $('#cbox-input1').prop("checked"),
    hasChildren : $('#cbox-input2').prop("checked"),
    favoriteColor : $('#color-input').val(),
    latitude:$('#numeric-input-lat').val(),
    longitude:$('#numeric-input-lng').val(),
    description:$('#text-input4').val()
  };
};

$(document).ready(function() {
  // Do your stuff here
  $('#text-label1').text('My title is');
  $('#text-label2').text('My name is');
  $('#text-label3').text('My address is');
  $('#number-label').text('My age is');
  $('#checkbox-label1').text('I am married.');
  $('#checkbox-label2').text('I have children.');
  $('#color-label').text('My favorite color is');
  $('button').text('Submit');
  $('#text-label4').text('Description');

  // Enable all inputs
  $('#text-input1').prop('disabled',false);
  $('#text-input2').prop('disabled',false);
  $('#text-input3').prop('disabled',false);
  $('#numeric-input').prop('disabled',false);
  $('#cbox-input1').prop('disabled',false);
  $('#cbox-input2').prop('disabled',false);
  $('#color-input').prop('disabled',false);


  $('#text-input1').val('Mr');
  $('#text-input2').val('W');
  $('#text-input3').val('Meyerson hall');
  $('#numeric-input').val('100');
  $('#cbox-input1').prop("checked",true);
  $('#cbox-input2').prop("checked",true);
  $('#color-input').val('#FFFFFF');
  $('button').val('Submit');
  $('#text-input4').val('Your description goes here.');

  $('#numeric-input-lat').val(39.9522);
  $('#numeric-input-lng').val(-75.1639);

  UpdateForm();
  console.log(form);

  $( "button" ).click(function() {
    resetMap();
    UpdateForm();
    var lat = form.latitude;
    var lng = form.longitude;


    var pathOpts = {'radius': 10,
                'fillColor': form.favoriteColor};
    var description = form.description;
    myMarkers = [L.circleMarker([lat, lng],pathOpts).bindPopup(description)];

    _.each(myMarkers,function(m){
      m.addTo(map);
    });

    var alartString = "Here is your marker:\n";
    for (var i in form){
      alartString+= i +": " + form[i] +"\n";
    }

    alert(alartString);

  });

});

var resetMap = function() {
  _.each(myMarkers,function(m){
    map.removeLayer(m);
  });
  myMarkers = [];
};
