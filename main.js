const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/402-FTB-ET-WEB-FT/events'

const state = {
  names: [],
  dates: [],
  locations: [],
  descriptions: [],
  ids: []
}

//grab  elements
const eventList = document.getElementById('events');
const form = document.querySelector("form");



const deleteEvent = async (e) => {
  console.log("delete button")
  const buttonID = e.target.getAttribute("data-event-id")
  console.log(buttonID)
  
  const deleteURL = `${API_URL}/${buttonID}`
  console.log(deleteURL)
  console.log( await fetch(deleteURL))
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
  render();
}

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
  //render();
});

const render = () => {
  eventList.innerHTML=''
  state.names.forEach((event, idx) => {
    const tr = document.createElement("tr");
    const nameData = document.createElement("td");
    const dateData = document.createElement("td");
    const locData = document.createElement("td");
    const descData = document.createElement("td");
    const deleteButton = document.createElement("button");
    nameData.innerText = event;
    dateData.innerText = state.dates[idx];
    locData.innerText = state.locations[idx];
    descData.innerText = state.descriptions[idx];
    descData.classList.add("descrip")
    deleteButton.innerText = "delete event";

    deleteButton.classList.add("delete");
    deleteButton.setAttribute("data-event-id", state.ids[idx]);

    tr.appendChild(nameData);
    tr.appendChild(dateData);
    tr.appendChild(locData);
    tr.appendChild(descData);
    tr.appendChild(deleteButton);
    eventList.appendChild(tr);
  })
  const deleteButtons = document.querySelectorAll(".delete");

  deleteButtons.forEach(button => {
    button.addEventListener("click", deleteEvent);
  })


}
const fetchEvents = async () => {
  try {
    const res = await fetch(API_URL);
    const events = await res.json()
    events.data.forEach(event => {
      state.names.push(event.name)
      state.dates.push(new Date(event.date))
      state.locations.push(event.location)
      state.descriptions.push(event.description)
      state.ids.push(event.id)
    });
  } catch {
    throw new Error("whoops, couldn't find it!")
  }
  render();
}
fetchEvents();

