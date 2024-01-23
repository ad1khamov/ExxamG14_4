window.addEventListener('load', () => {
	const form = document.querySelector("#new-task-form");
	const input = document.querySelector("#new-task-input");
	const list_el = document.querySelector("#tasks");

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const task = input.value;

		const task_el = document.createElement('div');
		task_el.classList.add('task');

		const task_content_el = document.createElement('div');
		task_content_el.classList.add('content');

		task_el.appendChild(task_content_el);

		const task_input_el = document.createElement('input');
		task_input_el.classList.add('text');
		task_input_el.type = 'text';
		task_input_el.value = task;
		task_input_el.setAttribute('readonly', 'readonly');

		task_content_el.appendChild(task_input_el);

		const task_actions_el = document.createElement('div');
		task_actions_el.classList.add('actions');

		const task_edit_el = document.createElement('button');
		task_edit_el.classList.add('edit');
		task_edit_el.innerText = 'Edit';

		const task_delete_el = document.createElement('button');
		task_delete_el.classList.add('delete');
		task_delete_el.innerText = 'Delete';

		task_actions_el.appendChild(task_edit_el);
		task_actions_el.appendChild(task_delete_el);

		task_el.appendChild(task_actions_el);

		list_el.appendChild(task_el);

		input.value = '';

		task_edit_el.addEventListener('click', (e) => {
			if (task_edit_el.innerText.toLowerCase() == "edit") {
				task_edit_el.innerText = "Save";
				task_input_el.removeAttribute("readonly");
				task_input_el.focus();
			} else {
				task_edit_el.innerText = "Edit";
				task_input_el.setAttribute("readonly", "readonly");
			}
		});

		task_delete_el.addEventListener('click', (e) => {
			list_el.removeChild(task_el);
		});
	});
});



const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/tasklist', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

const taskSchema = new mongoose.Schema({
  text: String,
  userId: String,
});

const Task = mongoose.model('Task', taskSchema);

app.use(bodyParser.json());

app.post('/tasks', async (req, res) => {
  const { text, userId } = req.body;

  try {
    const task = new Task({ text, userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/tasks/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    await Task.findByIdAndDelete(taskId);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const apiUrl = 'https://todo-for-n92.cyclic.app/';



window.addEventListener('load', () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");

  const userId = 'replace-with-your-user-id';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const task = input.value;

    try {
      const res = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: task, userId }),
      });

      if (!res.ok) {
        throw new Error('Failed to add task');
      }

      const newTask = await res.json();

      const task_el = document.createElement('div');
      task_el.classList.add('task');

      const task_content_el = document.createElement('div');
      task_content_el.classList.add('content');

      task_el.appendChild(task_content_el);

      const task_input_el = document.createElement('input');
      task_input_el.classList.add('text');
      task_input_el.type = 'text';
      task_input_el.value = newTask.text;
      task_input_el.setAttribute('readonly', 'readonly');

      task_content_el.appendChild(task_input_el);

      const task_actions_el = document.createElement('div');
      task_actions_el.classList.add('actions');

      const task_edit_el = document.createElement('button');
      task_edit_el.classList.add('edit');
      task_edit_el.innerText = 'Edit';

      const task_delete_el = document.createElement('button');
      task_delete_el.classList.add('delete');
      task_delete_el.innerText = 'Delete';

      task_actions_el.appendChild(task_edit_el);
      task_actions_el.appendChild(task_delete_el);

      task_el.appendChild(task_actions_el);

      list_el.appendChild(task_el);

      input.value = '';

      task_edit_el.addEventListener('click', async () => {
        if (task_edit_el.innerText.toLowerCase() == "edit") {
          task_edit_el.innerText = "Save";
          task_input_el.removeAttribute("readonly");
          task_input_el.focus();
        } else {
          task_edit_el.innerText = "Edit";
          task_input_el.setAttribute("readonly", "readonly");

          try {
            await fetch(`${apiUrl}/tasks/${newTask._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ text: task_input_el.value }),
            });
          } catch (error) {
            console.error('Failed to edit task', error);
          }
        }
      });

      task_delete_el.addEventListener('click', async () => {
        try {
          await fetch(`${apiUrl}/tasks/${newTask._id}`, {
            method: 'DELETE',
          });

          list_el.removeChild(task_el);
        } catch (error) {
          console.error('Failed to delete task', error);
        }
      });
    } catch (error) {
      console.error('Failed to add task', error);
    }
  });
});




const postInput = document.getElementById('postInput');
const postList = document.getElementById('postList');

async function fetchPosts() {
    try {
        const response = await fetch(' https://todo-for-n92.cyclic.app/todos/add
        ');
        const data = await response.json();
        displayPosts(data);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function displayPosts(posts) {
    postList.innerHTML = '';
    posts.forEach(post => {
        const newPost = document.createElement('li');
        newPost.innerHTML = `<span>${post.title}</span>
                             <button class="edit-btn" onclick="editPost(${post.id})">Edit</button>
                             <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>`;

        newPost.addEventListener('click', () => {
            newPost.classList.toggle('completed');
        });

        postList.appendChild(newPost);
    });
}

async function addPost() {
    const postText = postInput.value.trim();
    if (postText !== '') {
        try {
            const response = await fetch('https://todo-for-n92.cyclic.app/todos/:id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: postText,
                }),
            });
            const data = await response.json();
            postInput.value = '';
        } catch (error) {
            console.error('Error adding post:', error);
        }
    }
}

async function editPost(postId) {
    const updatedText = prompt('Edit post:');
    if (updatedText !== null) {
        try {
            const response = await fetch(`https://todo-for-n92.cyclic.app/todos?id={postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updatedText,
                }),
            });
            const data = await response.json();
        } catch (error) {
            console.error('Error editing post:', error);
        }
    }
}

async function deletePost(postId) {
    const confirmation = confirm('Are you sure you want to delete this post?');
    if (confirmation) {
        try {
            const response = await fetch(`https://todo-for-n92.cyclic.app/todos/:id{postId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }
}

fetchPosts();

