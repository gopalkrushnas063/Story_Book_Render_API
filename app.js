//-----------------Add Story----------------------

async function addStory() {
  let story = {
    title: document.getElementById("title").value,
    type: document.getElementById("type").value,
    image: document.getElementById("image").value,
    content: document.getElementById("content").value,
  };

  let response = await fetch("https://story-book-api.onrender.com/story", {
    method: "POST",
    body: JSON.stringify(story), // Pass the story object here
    headers: {
      "Content-type": "application/json",
    },
  });


  if (response.ok) {
    // Handle success
    alert("Story added successfully");
    console.log("Story added successfully");
  } else {
    // Handle errors
    console.error("Failed to add the story");
  }
}

//-----------------Get All Stories----------------------

let localUrl = "https://story-book-api.onrender.com/story";
let getData = async () => {
  let res = await fetch(localUrl);
  let data = await res.json();
  append(data);
  return data.items;
};

getData();

let append = (data) => {
  console.log(data);

  let container = document.querySelector("tbody");
  container.innerHTML = null;

  data.forEach((el) => {
    let pID = document.createElement("td");
    pID.innerText = el.id;
    let title = document.createElement("td");
    title.innerText = el.title;
    let type = document.createElement("td");
    type.innerText = el.type;
    let content = document.createElement("td");
    content.innerText = el.content;
    let image = document.createElement("td");
    image.innerText = el.image;

    // Action buttons
    let updateButton = document.createElement("button");
    updateButton.innerText = "Update";
    updateButton.addEventListener("click", () => openUpdateModal(el));

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => openDeleteModal(el));

    let viewButton = document.createElement("button");
    viewButton.innerText = "View";
    viewButton.addEventListener("click", () => openViewModal(el));

    // Create a cell for the action buttons
    let actions = document.createElement("td");
    actions.appendChild(updateButton);
    actions.appendChild(deleteButton);
    actions.appendChild(viewButton);

    let tr = document.createElement("tr");
    tr.append(pID, title, type, content, image, actions);
    container.append(tr);
  });
};

function openDeleteModal(story) {
  // console.log(story.id);
  deleteFun(story.id);

  $("#deleteModal").modal("show");
}

// Function to open the update modal with story details
function openUpdateModal(story) {
  // Populate the modal fields with story details
  console.log(story.id);
  document.getElementById("utitle").value = story.title;
  document.getElementById("utype").value = story.type;
  document.getElementById("ucontent").value = story.content;
  document.getElementById("uimage").value = story.image;

  // Attach the story ID to the "Update" button
  document.getElementById("updateStory").dataset.storyId = story.id;

  $("#updateModal").modal("show");
}

// Function to update a story
async function updateStory() {
  const storyId = document.getElementById("updateStory").dataset.storyId;

  let updatedStory = {
    title: document.getElementById("utitle").value,
    type: document.getElementById("utype").value,
    content: document.getElementById("ucontent").value,
    image: document.getElementById("uimage").value,
  };

  try {
    const response = await fetch(
      `https://story-book-api.onrender.com/story/${storyId}`,
      {
        method: "PUT",
        body: JSON.stringify(updatedStory),
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    if (response.ok) {
      // Handle success
      alert("Story updated successfully");
      console.log("Story updated successfully");
      // Close the update modal if needed
      $("#updateModal").modal("hide");
    } else {
      // Handle errors
      console.error("Failed to update the story");
    }
  } catch (error) {
    console.error("An error occurred while updating the story:", error);
  }
}

function deleteFun(id) {
  document.getElementById("confirmDelete").addEventListener("click", () => {
    
    console.log(id);
    fetch(`https://story-book-api.onrender.com/story/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 204) {
          alert("Deleted");
          $("#deleteModal").modal("hide");
        } else {
          console.error("Failed to delete the story");
        }
      })
      .catch((error) => {
        console.error("Error deleting story:", error);
      });
  });
}
