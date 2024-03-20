//the URL to out API with the event endpoint

const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2402-FTB-ET-WEB-FT/events'

//state, stored as an array of objects

let state = {
  names: [],
  dates: [],
  locations: [],
  descriptions: [],
  ids: []
}

//grab  elements
const eventList = document.getElementById('events');
const form = document.querySelector("form");

//event handler to delete a post

const deleteEvent = async (e) => {
  const buttonID = e.target.getAttribute("data-event-id")
  const deleteURL = `${API_URL}/${buttonID}`
  try {
    const response = await fetch(deleteURL, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error("failed to delete")
    }
  } catch (err) {
    console.log(err.message)
  }
  fetchEvents();
}

//eventListener and handler for submitting a new event

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData(form);
    const eventName = formData.get("event-name")
    const currentDate = new Date();
    const eventDate = currentDate.toISOString();
    const eventLoc = formData.get("event-loc")
    const eventDesc = formData.get("event-desc")

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: eventName,
        description: eventDesc,
        date: eventDate,
        location: eventLoc
      })
    })
    if (!response.ok) {
      throw new Error(" Failed to POST")
    }
    console.log("success!")
  } catch (err) {
    console.log(err.message)
  }
  fetchEvents();
});

//render the page by creating html elements and adding state to their contents

const render = () => {
  state.ids.forEach((event, idx) => {
    const tr = document.createElement("tr");
    const nameData = document.createElement("td");
    const dateData = document.createElement("td");
    const locData = document.createElement("td");
    const descData = document.createElement("td");
    const deleteButton = document.createElement("button");
    nameData.innerText = state.names[idx]
    dateData.innerText = state.dates[idx];
    locData.innerText = state.locations[idx];
    descData.innerText = state.descriptions[idx];
    descData.classList.add("descrip")
    deleteButton.innerText = "delete event";

    //use data-attributes to give the delete button a unique identifier
    deleteButton.classList.add("delete");
    deleteButton.setAttribute("data-event-id", state.ids[idx]);

    tr.appendChild(nameData);
    tr.appendChild(dateData);
    tr.appendChild(locData);
    tr.appendChild(descData);
    tr.appendChild(deleteButton);
    eventList.appendChild(tr);


  })
  //after creating all elements, loop through buttons to addEventlisteners to each
  const deleteButtons = document.querySelectorAll(".delete");

  deleteButtons.forEach(button => {
    button.addEventListener("click", deleteEvent);
  })


}
//call to API, clear state and page, add API data to state
const fetchEvents = async () => {
  try {
    const res = await fetch(API_URL);
    const events = await res.json();

//clear state and empty eventList before repopulating page

    state.dates = [];
    state.names = [];
    state.locations = [];
    state.ids = [];
    state.descriptions = [];
    eventList.innerHTML = '';

    events.data.forEach(event => {
      if (!state.ids.includes(events.data.id)) {
        state.names.push(event.name)
        state.dates.push(new Date(event.date))
        state.locations.push(event.location)
        state.descriptions.push(event.description)
        state.ids.push(event.id)
      }
    });
  } catch {
    throw new Error("whoops, couldn't find it!")
  }
  render();
}
fetchEvents();

